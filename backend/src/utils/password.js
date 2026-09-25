// Encapsula o uso do bcrypt em duas funcoes simples.
//
// Por que encapsular em vez de chamar bcrypt direto no service?
// Se um dia precisarmos trocar o numero de "salt rounds" ou a biblioteca,
// mudamos em um unico lugar, sem procurar chamadas espalhadas pelo projeto.

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Gera o hash a partir da senha em texto puro.
// O hash resultante ja inclui o salt embutido (padrao do bcrypt),
// entao nao precisamos guardar o salt separadamente no banco.
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compara a senha digitada no login com o hash salvo no banco.
// Retorna true/false - nunca expoe o hash nem permite "descobrir" a senha.
async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

module.exports = { hashPassword, comparePassword };
