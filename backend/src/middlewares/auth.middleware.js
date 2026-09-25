// Middleware de AUTENTICACAO (diferente de autorizacao - ver authorize.middleware.js).
//
// Responsabilidade unica: descobrir QUEM esta fazendo a requisicao,
// a partir do token JWT enviado no header Authorization.
// Nao decide se essa pessoa PODE ou nao acessar o recurso - isso e
// responsabilidade do authorize.middleware.js (Bloco 8).
//
// Se o token for valido, popula req.user = { id, role } e deixa a
// requisicao seguir. Se nao houver token, ou ele for invalido/expirado,
// responde 401 (nao autenticado) e interrompe a requisicao.

const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token de autenticacao ausente.", 401));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    // Populamos req.user com o minimo necessario para o resto da aplicacao.
    // Nao fazemos uma consulta ao banco aqui de proposito: isso manteria
    // este middleware rapido e simples, ja que o payload do token ja
    // contem id e role. Rotas que precisarem de dados completos e
    // atualizados do usuario (ex: /auth/me) buscam no banco explicitamente.
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    return next(new AppError("Token invalido ou expirado.", 401));
  }
}

module.exports = authMiddleware;
