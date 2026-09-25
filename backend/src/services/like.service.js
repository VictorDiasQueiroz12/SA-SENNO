const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const notificationService = require("./notification.service");

async function like(sightingId, userId) {
  const sighting = await prisma.sighting.findUnique({ where: { id: sightingId } });
  if (!sighting) throw new AppError("Avistamento nao encontrado.", 404);

  const existing = await prisma.like.findUnique({
    where: { userId_sightingId: { userId, sightingId } },
  });
  if (existing) throw new AppError("Voce ja curtiu este avistamento.", 409);

  await prisma.like.create({ data: { userId, sightingId } });

  if (sighting.userId !== userId) {
    await notificationService.create(
      sighting.userId,
      "NEW_LIKE",
      "Alguem curtiu seu avistamento.",
      sightingId
    );
  }

  return getSummary(sightingId, userId);
}

async function unlike(sightingId, userId) {
  const existing = await prisma.like.findUnique({
    where: { userId_sightingId: { userId, sightingId } },
  });
  if (!existing) throw new AppError("Voce ainda nao curtiu este avistamento.", 404);

  await prisma.like.delete({ where: { userId_sightingId: { userId, sightingId } } });

  return getSummary(sightingId, userId);
}

async function getSummary(sightingId, userId) {
  const [count, likedByCurrentUser] = await Promise.all([
    prisma.like.count({ where: { sightingId } }),
    userId
      ? prisma.like.findUnique({ where: { userId_sightingId: { userId, sightingId } } })
      : null,
  ]);
  return { likesCount: count, likedByCurrentUser: Boolean(likedByCurrentUser) };
}

module.exports = { like, unlike, getSummary };
