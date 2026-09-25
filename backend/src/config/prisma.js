// Instancia unica (singleton) do PrismaClient.
//
// Por que um arquivo separado so para isso?
// Se cada service/controller criasse o seu proprio "new PrismaClient()",
// a aplicacao abriria uma quantidade descontrolada de conexoes com o banco.
// Importando sempre esta mesma instancia, toda a aplicacao compartilha o
// mesmo pool de conexoes gerenciado pelo Prisma.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
