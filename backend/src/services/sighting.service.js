// Regras de negocio do CRUD de Avistamentos.
// O controller so chama estas funcoes e traduz o resultado em resposta HTTP.

const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { findOrCreateCreature } = require("./creature.service");
const notificationService = require("./notification.service");
const { RELEVANT_DANGER_LEVELS } = require("../config/notifications");

// O que e devolvido em toda consulta de avistamento: dados proprios,
// criatura relacionada, e autor - SEM email nem passwordHash do autor.
const sightingInclude = {
  creature: {
    select: { id: true, name: true, isCustom: true },
  },
  user: {
    select: { id: true, name: true }, // nunca email ou passwordHash aqui
  },
  _count: {
    select: { comments: true, likes: true },
  },
};

function toPublicSighting(sighting, likedByCurrentUser = false) {
  return {
    id: sighting.id,
    location: sighting.location,
    latitude: sighting.latitude,
    longitude: sighting.longitude,
    occurredAt: sighting.occurredAt,
    description: sighting.description,
    photoUrl: sighting.photoUrl,
    dangerLevel: sighting.dangerLevel,
    status: sighting.status,
    createdAt: sighting.createdAt,
    updatedAt: sighting.updatedAt,
    creature: sighting.creature,
    author: sighting.user,
    commentsCount: sighting._count?.comments ?? 0,
    likesCount: sighting._count?.likes ?? 0,
    likedByCurrentUser,
  };
}

// ---------- CRIACAO ----------

async function create(userId, data) {
  const creature = await findOrCreateCreature(data.creatureName, userId);

  const sighting = await prisma.sighting.create({
    data: {
      userId, // sempre do usuario autenticado, nunca do body
      creatureId: creature.id,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      occurredAt: data.occurredAt,
      description: data.description,
      dangerLevel: data.dangerLevel,
      photoUrl: data.photoUrl || null,
      status: "PENDING", // sempre PENDING na criacao, nunca vindo do body
    },
    include: sightingInclude,
  });

  return toPublicSighting(sighting);
}

// ---------- LISTAGEM ----------
//
// Regra de visibilidade (apresentada e aprovada antes da implementacao):
//   - Por padrao: so status VERIFIED aparece.
//   - ?mine=true (usuario autenticado): mostra TODOS os proprios avistamentos,
//     em qualquer status.
//   - ADMIN pode usar ?status=X para ver qualquer status, de qualquer usuario.

async function list(query, requester) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 12, 1), 50);

  const where = {};

  if (query.creature) {
    where.creature = { name: { contains: query.creature, mode: "insensitive" } };
  }

  if (query.dangerLevel) {
    where.dangerLevel = query.dangerLevel;
  }

  if (query.dateFrom || query.dateTo) {
    where.occurredAt = {};
    if (query.dateFrom) where.occurredAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.occurredAt.lte = new Date(query.dateTo);
  }

  if (query.search) {
    where.OR = [
      { description: { contains: query.search, mode: "insensitive" } },
      { location: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const isAdmin = Boolean(requester && requester.role === "ADMIN");
  const wantsMine = Boolean(requester && query.mine === "true");

  if (wantsMine) {
    where.userId = requester.id;
    if (query.status) {
      where.status = query.status;
    }
    // sem filtro de status explicito: mostra todos os status do proprio usuario
  } else if (isAdmin && query.status) {
    where.status = query.status;
  } else {
    where.status = "VERIFIED";
  }

  const [items, total] = await Promise.all([
    prisma.sighting.findMany({
      where,
      include: sightingInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.sighting.count({ where }),
  ]);

  return {
    items: items.map(toPublicSighting),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
  };
}

// ---------- DETALHE ----------

async function getById(id, requester) {
  const sighting = await prisma.sighting.findUnique({
    where: { id },
    include: sightingInclude,
  });

  if (!sighting) {
    throw new AppError("Avistamento nao encontrado.", 404);
  }

  const isOwner = Boolean(requester && sighting.userId === requester.id);
  const isAdmin = Boolean(requester && requester.role === "ADMIN");

  if (sighting.status !== "VERIFIED" && !isOwner && !isAdmin) {
    // 404 e nao 403 de proposito: nao revelamos que um avistamento nao
    // verificado existe para quem nao tem permissao de ve-lo.
    throw new AppError("Avistamento nao encontrado.", 404);
  }

  let likedByCurrentUser = false;
  if (requester) {
    const like = await prisma.like.findUnique({
      where: { userId_sightingId: { userId: requester.id, sightingId: sighting.id } },
    });
    likedByCurrentUser = Boolean(like);
  }

  return toPublicSighting(sighting, likedByCurrentUser);
}

// ---------- EDICAO (PUT) ----------
// Dados normais do avistamento apenas - "status" nunca e aceito aqui,
// independentemente de quem esta editando (USER dono ou ADMIN).

async function update(id, data, requester) {
  const sighting = await prisma.sighting.findUnique({ where: { id } });

  if (!sighting) {
    throw new AppError("Avistamento nao encontrado.", 404);
  }

  const isOwner = sighting.userId === requester.id;
  const isAdmin = requester.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError("Voce nao tem permissao para editar este avistamento.", 403);
  }

  const creature = await findOrCreateCreature(data.creatureName, requester.id);

  const updated = await prisma.sighting.update({
    where: { id },
    data: {
      creatureId: creature.id,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      occurredAt: data.occurredAt,
      description: data.description,
      dangerLevel: data.dangerLevel,
      photoUrl: data.photoUrl || null,
      // status: NAO incluido de proposito - fica exclusivo do PATCH /:id/status
    },
    include: sightingInclude,
  });

  return toPublicSighting(updated);
}

// ---------- EXCLUSAO (hard delete) ----------
// Comment, Like e Report relacionados sao removidos em cascata pelo
// proprio PostgreSQL, conforme onDelete: Cascade definido no schema.

async function remove(id, requester) {
  const sighting = await prisma.sighting.findUnique({ where: { id } });

  if (!sighting) {
    throw new AppError("Avistamento nao encontrado.", 404);
  }

  const isOwner = sighting.userId === requester.id;
  const isAdmin = requester.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError("Voce nao tem permissao para excluir este avistamento.", 403);
  }

  await prisma.sighting.delete({ where: { id } });
}

// ---------- ALTERACAO DE STATUS (PATCH /:id/status) ----------
// Rota exclusiva de ADMIN - a checagem de role acontece no middleware
// authorize('ADMIN'), nao aqui. Este service assume que quem chamou
// ja tem permissao.

async function updateStatus(id, status) {
  const sighting = await prisma.sighting.findUnique({ where: { id } });

  if (!sighting) {
    throw new AppError("Avistamento nao encontrado.", 404);
  }

  const updated = await prisma.sighting.update({
    where: { id },
    data: { status },
    include: sightingInclude,
  });

  // Notificacao de "avistamento relevante" (item 19.3): dispara quando o
  // avistamento passa a VERIFIED e o nivel de perigo esta na lista
  // configurada em config/notifications.js. Notifica todos os usuarios,
  // exceto o proprio autor.
  if (status === "VERIFIED" && RELEVANT_DANGER_LEVELS.includes(updated.dangerLevel)) {
    const users = await prisma.user.findMany({
      where: { id: { not: updated.userId } },
      select: { id: true },
    });
    await Promise.all(
      users.map((u) =>
        notificationService.create(
          u.id,
          "RELEVANT_SIGHTING",
          `Novo avistamento relevante: ${updated.creature.name} (${updated.dangerLevel}).`,
          updated.id
        )
      )
    );
  }

  return toPublicSighting(updated);
}

module.exports = { create, list, getById, update, remove, updateStatus };
