// Encapsula geracao e validacao de JWT.
//
// O payload do token carrega apenas o essencial para identificar o usuario
// e sua role - nunca dados sensiveis (nunca o passwordHash, por exemplo).
// Qualquer informacao dentro de um JWT pode ser lida por qualquer pessoa
// que tiver o token (o JWT nao e criptografado, so assinado) - entao
// tratamos o payload como informacao publica, apenas com integridade
// garantida pela assinatura.

const jwt = require("jsonwebtoken");
const env = require("../config/env");

function generateToken(user) {
  const payload = {
    sub: user.id, // "subject" - identifica de quem e o token
    role: user.role,
  };

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// Lanca erro se o token for invalido ou tiver expirado -
// quem chama essa funcao (o auth.middleware) e responsavel por tratar isso.
function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { generateToken, verifyToken };
