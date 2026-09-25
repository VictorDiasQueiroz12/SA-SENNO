// server.js
//
// Responsabilidade deste arquivo: LIGAR o servidor.
// Importa a aplicacao ja montada (app.js) e sobe o servidor HTTP na porta
// configurada. Nao define nenhum middleware ou rota aqui - isso e
// responsabilidade exclusiva do app.js.
//
// Essa separacao entre "montar" (app.js) e "ligar" (server.js) permite,
// por exemplo, testar a aplicacao sem precisar abrir uma porta de rede real.

const env = require("./config/env");
const app = require("./app");

app.listen(env.port, () => {
  // Nunca logamos valores sensiveis do .env (JWT_SECRET, senhas, etc.) aqui -
  // apenas informacoes de status, seguras de aparecer no console/log.
  console.log(`[server] Little Ville backend rodando na porta ${env.port} (ambiente: ${env.nodeEnv})`);
});
