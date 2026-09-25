// Controllers de autenticacao.
// Responsabilidade: receber a requisicao (ja validada pelo middleware de Zod),
// chamar o service correspondente, e devolver a resposta HTTP.
// Nenhuma regra de negocio aqui - so "traducao" entre HTTP e o service.

const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    // req.user e preenchido pelo auth.middleware.js (ver Bloco 6, item 6)
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
