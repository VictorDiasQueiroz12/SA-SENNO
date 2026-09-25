// Configuracao do CORS.
//
// Importante (correcao feita durante a Etapa 1 da conversa com o usuario):
// usar JWT em vez de sessao/cookie NAO elimina a necessidade de configurar CORS.
// Frontend (Netlify) e backend continuam em dominios diferentes, entao o
// navegador so vai permitir as requisicoes se o backend responder com os
// headers de CORS corretos, liberando explicitamente a origem do frontend.
//
// Por isso nunca usamos origin: "*" aqui - a API exige autenticacao,
// entao restringir a origem e uma camada adicional de protecao.

const env = require("./env");

const corsOptions = {
  origin: env.frontendUrl,
  credentials: false, // nao usamos cookies (JWT vai no header Authorization)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
