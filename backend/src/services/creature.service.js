// Regras de negocio relacionadas a criaturas.
//
// Estrategia definida nos Blocos 2/3: toda criatura e um registro na tabela
// Creature (nunca um texto solto no Sighting), para que o ranking futuro
// (Bloco 22) sempre agregue por creatureId, com resultados confiaveis.

const prisma = require("../config/prisma");

// Busca uma criatura pelo nome (case-insensitive) ou cria uma nova,
// marcada como isCustom: true e associada a quem a cadastrou.
//
// Limitacao conhecida (aceitavel para o escopo academico): se duas
// requisicoes chegarem ao mesmo tempo com o mesmo nome em maiusculas/
// minusculas diferentes (ex: "Yeti" e "yeti"), existe uma pequena chance
// de condicao de corrida gerar duas criaturas quase iguais, ja que a
// constraint @unique do banco e case-sensitive. Para o volume e o
// contexto de uso deste projeto, o risco e minimo e aceitamos essa
// limitacao em vez de adicionar lock/transacao extra para resolve-la.
async function findOrCreateCreature(rawName, userId) {
  const name = rawName.trim();

  const existing = await prisma.creature.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existing) {
    return existing;
  }

  return prisma.creature.create({
    data: {
      name,
      isCustom: true,
      createdByUserId: userId,
    },
  });
}

async function listAll() {
  return prisma.creature.findMany({
    select: { id: true, name: true, isCustom: true },
    orderBy: { name: "asc" },
  });
}

// Ranking publico de criaturas mais avistadas (item 22 do briefing).
// Conta apenas avistamentos VERIFIED, consistente com a regra de
// visibilidade publica definida no Bloco 10.
async function getRanking() {
  const grouped = await prisma.sighting.groupBy({
    by: ["creatureId"],
    where: { status: "VERIFIED" },
    _count: true,
    orderBy: { _count: { creatureId: "desc" } },
  });

  const totalVerified = grouped.reduce((sum, g) => sum + g._count, 0);

  const creatureIds = grouped.map((g) => g.creatureId);
  const creatures = await prisma.creature.findMany({
    where: { id: { in: creatureIds } },
    select: { id: true, name: true },
  });
  const nameById = Object.fromEntries(creatures.map((c) => [c.id, c.name]));

  return grouped.map((g) => ({
    creatureId: g.creatureId,
    name: nameById[g.creatureId],
    count: g._count,
    percentage: totalVerified > 0 ? Math.round((g._count / totalVerified) * 100) : 0,
  }));
}

module.exports = { findOrCreateCreature, listAll, getRanking };
