// prisma/seed.js
//
// Responsabilidades deste seed (Bloco 3):
//   1. Criar ou atualizar o administrador padrao, usando as variaveis ADMIN_* do .env.
//   2. Cadastrar a lista inicial de criaturas oficiais (isCustom: false).
//
// O que este seed NAO faz (ainda):
//   - Nao cria avistamentos, comentarios, likes, denuncias ou notificacoes de demonstracao.
//     Isso sera adicionado em um bloco futuro, junto com o CRUD de Avistamentos,
//     para que os dados de exemplo facam sentido com o modelo ja implementado.
//
// Idempotencia: este script pode ser executado varias vezes sem criar duplicatas.
// Isso e garantido por "upsert" (cria se nao existe, atualiza se ja existe),
// usando campos unicos (email do usuario, nome da criatura) como criterio de busca.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// Lista inicial de criaturas oficiais do sistema (Etapa 2 / item 10 do briefing).
// Todas entram com isCustom: false, diferenciando-as das criaturas
// que os usuarios poderao cadastrar livremente ao criar um avistamento.
const OFFICIAL_CREATURES = [
  "Pé Grande",
  "Lobisomem",
  "Chupa-cabra",
  "Mothman",
  "Criatura desconhecida",
];

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Variaveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD sao obrigatorias no .env para rodar o seed."
    );
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  // upsert por email: se o admin ja existir, atualiza nome/senha/role;
  // se nao existir, cria. Isso permite, por exemplo, trocar a senha do
  // admin padrao apenas alterando o .env e rodando o seed novamente.
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`[seed] Administrador pronto: ${admin.email} (id: ${admin.id})`);
}

async function seedCreatures() {
  for (const name of OFFICIAL_CREATURES) {
    // upsert por name (campo @unique no schema): evita duplicar a
    // criatura se o seed for rodado mais de uma vez.
    const creature = await prisma.creature.upsert({
      where: { name },
      update: {
        isCustom: false,
      },
      create: {
        name,
        isCustom: false,
      },
    });

    console.log(`[seed] Criatura oficial pronta: ${creature.name}`);
  }
}

async function main() {
  console.log("[seed] Iniciando seed de administrador e criaturas oficiais...");
  await seedAdmin();
  await seedCreatures();
  console.log("[seed] Concluido.");
}

main()
  .catch((error) => {
    console.error("[seed] Erro ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
