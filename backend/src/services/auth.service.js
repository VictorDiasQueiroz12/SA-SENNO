// Regras de negocio de autenticacao.
// O controller so chama estas funcoes e devolve a resposta HTTP -
// toda a logica (verificar duplicidade, comparar senha, gerar token)
// fica concentrada aqui.

const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

// Formato padrao de usuario devolvido pela API - NUNCA inclui passwordHash.
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function register({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("E-mail ja cadastrado.", 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash }, // role usa o default (USER) do schema
  });

  const token = generateToken(user);

  return { user: toPublicUser(user), token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mensagem generica de proposito: nao revelamos se o problema foi
  // "e-mail nao existe" ou "senha errada". Isso evita que alguem use
  // o endpoint de login para descobrir quais e-mails estao cadastrados.
  if (!user) {
    throw new AppError("E-mail ou senha invalidos.", 401);
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("E-mail ou senha invalidos.", 401);
  }

  const token = generateToken(user);

  return { user: toPublicUser(user), token };
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  return toPublicUser(user);
}

module.exports = { register, login, getUserById, toPublicUser };
