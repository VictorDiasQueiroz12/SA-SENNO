// Middleware global de tratamento de erros.
//
// Precisa ser o ULTIMO middleware registrado no app.js (depois de todas as rotas),
// porque o Express so trata uma funcao como "error handler" quando ela tem
// 4 parametros: (err, req, res, next).
//
// Regra do briefing (item 29): nunca expor stack trace ou detalhes internos
// para o usuario final. Em desenvolvimento, ainda assim logamos o erro
// completo no console do servidor (para o time conseguir debugar).

const env = require("../config/env");
const multer = require("multer");

function errorHandlerMiddleware(err, req, res, next) {
  // Log interno (nunca enviado ao cliente): ajuda a debugar durante o desenvolvimento
  console.error("[erro]", err);

  // Erros do Multer (ex: arquivo maior que o limite) nao tem statusCode
  // por padrao - tratamos como erro conhecido (400) em vez de 500.
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Erro no upload: ${err.message}` });
  }

  const statusCode = err.statusCode || 500;

  const isKnownError = Boolean(err.statusCode);

  const responseBody = {
    error: isKnownError ? err.message : "Erro interno no servidor. Tente novamente mais tarde.",
  };

  // Em desenvolvimento, ajuda a debugar sem expor isso em producao
  if (env.nodeEnv === "development" && !isKnownError) {
    responseBody.debug = err.message;
  }

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandlerMiddleware;
