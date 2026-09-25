const prisma = require("../config/prisma");

async function create(userId, type, message, referenceId = null) {
  return prisma.notification.create({
    data: { userId, type, message, referenceId },
  });
}

async function listForUser(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function markAsRead(id, userId) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    const AppError = require("../utils/AppError");
    throw new AppError("Notificacao nao encontrada.", 404);
  }
  return prisma.notification.update({ where: { id }, data: { read: true } });
}

module.exports = { create, listForUser, markAsRead };
