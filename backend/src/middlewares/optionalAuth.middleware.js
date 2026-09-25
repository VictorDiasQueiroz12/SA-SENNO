// Middleware de autenticacao OPCIONAL.
//
// Diferente do auth.middleware.js (Bloco 6), que BLOQUEIA a requisicao
// se nao houver token valido, este middleware e usado em rotas PUBLICAS
// que precisam, ainda assim, saber "quem esta perguntando" quando possivel -
// por exemplo, para decidir se um avistamento PENDING deve aparecer para
// o proprio dono, mesmo que a rota continue acessivel a visitantes anonimos.
//
// Resultado: req.user sera um objeto { id, role } se o token for valido,
// ou null se nao houver token, ou se o token for invalido/expirado.
// Em nenhum caso este middleware interrompe a requisicao com erro.

const { verifyToken } = require("../utils/jwt");

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch (error) {
    // Token presente mas invalido/expirado: nesta rota publica, tratamos
    // como anonimo em vez de bloquear - o usuario so perde o acesso extra
    // que o token daria (ex: ver os proprios avistamentos pendentes).
    req.user = null;
  }

  next();
}

module.exports = optionalAuthMiddleware;
