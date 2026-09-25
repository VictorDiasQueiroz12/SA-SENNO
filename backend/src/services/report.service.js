const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const notificationService = require("./notification.service");

async function create(sightingId, userId, reason) {
  const sighting = await prisma.sighting.findUnique({ where: { id: sightingId } });
  if (!sighting) throw new AppError("Avistamento nao encontrado.", 404);

  const existing = await prisma.report.findUnique({
    where: { userId_sightingId: { userId, sightingId } },
  });
  if (existing) throw new AppError("Voce ja denunciou este avistamento.", 409);

  const report = await prisma.report.create({
    data: { sightingId, userId, reason },
  });

  // Notifica administradores (evento administrativo) - busca todos os admins.
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  await Promise.all(
    admins.map((admin) =>
      notificationService.create(admin.id, "ADMIN_EVENT", "Nova denuncia registrada.", sightingId)
    )
  );

  return report;
}

async function listPending() {
  return prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      sighting: { select: { id: true, location: true, description: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function updateStatus(id, status, adminId) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw new AppError("Denuncia nao encontrada.", 404);

  return prisma.report.update({
    where: { id },
    data: { status, reviewedByUserId: adminId, reviewedAt: new Date() },
  });
}

module.exports = { create, listPending, updateStatus };
