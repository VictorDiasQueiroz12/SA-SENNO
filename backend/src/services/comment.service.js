const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const notificationService = require("./notification.service");

const authorSelect = { select: { id: true, name: true } };

function toPublic(comment) {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: comment.user,
  };
}

async function listBySighting(sightingId) {
  const comments = await prisma.comment.findMany({
    where: { sightingId },
    include: { user: authorSelect },
    orderBy: { createdAt: "asc" },
  });
  return comments.map(toPublic);
}

async function create(sightingId, userId, content) {
  const sighting = await prisma.sighting.findUnique({ where: { id: sightingId } });
  if (!sighting) throw new AppError("Avistamento nao encontrado.", 404);

  const comment = await prisma.comment.create({
    data: { sightingId, userId, content },
    include: { user: authorSelect },
  });

  if (sighting.userId !== userId) {
    await notificationService.create(
      sighting.userId,
      "NEW_COMMENT",
      "Alguem comentou no seu avistamento.",
      sightingId
    );
  }

  return toPublic(comment);
}

async function update(id, userId, content) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new AppError("Comentario nao encontrado.", 404);
  if (comment.userId !== userId) {
    throw new AppError("Voce nao tem permissao para editar este comentario.", 403);
  }
  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
    include: { user: authorSelect },
  });
  return toPublic(updated);
}

async function remove(id, requester) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new AppError("Comentario nao encontrado.", 404);
  const isOwner = comment.userId === requester.id;
  const isAdmin = requester.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    throw new AppError("Voce nao tem permissao para excluir este comentario.", 403);
  }
  await prisma.comment.delete({ where: { id } });
}

module.exports = { listBySighting, create, update, remove };
