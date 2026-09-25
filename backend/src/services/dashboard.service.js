const prisma = require("../config/prisma");

async function getStats() {
  const [
    totalUsers,
    totalSightings,
    byDangerLevel,
    byStatus,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.sighting.count(),
    prisma.sighting.groupBy({ by: ["dangerLevel"], _count: true }),
    prisma.sighting.groupBy({ by: ["status"], _count: true }),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);

  // Top criaturas mais registradas (ranking - Bloco 22, mas ja calculado aqui
  // para reaproveitar no dashboard administrativo)
  const topCreatures = await prisma.sighting.groupBy({
    by: ["creatureId"],
    _count: true,
    orderBy: { _count: { creatureId: "desc" } },
    take: 5,
  });
  const creatureIds = topCreatures.map((c) => c.creatureId);
  const creatures = await prisma.creature.findMany({
    where: { id: { in: creatureIds } },
    select: { id: true, name: true },
  });
  const creatureNameById = Object.fromEntries(creatures.map((c) => [c.id, c.name]));

  return {
    totalUsers,
    totalSightings,
    byDangerLevel: byDangerLevel.map((d) => ({ dangerLevel: d.dangerLevel, count: d._count })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    pendingReports,
    topCreatures: topCreatures.map((c) => ({
      creatureId: c.creatureId,
      name: creatureNameById[c.creatureId],
      count: c._count,
    })),
  };
}

module.exports = { getStats };
