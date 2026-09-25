// Le e valida as variaveis de ambiente uma unica vez, na inicializacao do servidor.
// Se alguma variavel obrigatoria estiver faltando, o servidor nao sobe -
// preferimos falhar cedo (no boot) a falhar tarde (em producao, no meio de uma requisicao).

require("dotenv").config();

const requiredVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "ADMIN_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "FRONTEND_URL",
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Variaveis de ambiente obrigatorias ausentes: ${missing.join(", ")}. ` +
      "Verifique o arquivo .env (veja .env.example como referencia)."
  );
}

const env = {
  port: process.env.PORT || 3333,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  admin: {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL,
  uploadMaxSizeMb: Number(process.env.UPLOAD_MAX_SIZE_MB) || 5,
};

module.exports = env;
