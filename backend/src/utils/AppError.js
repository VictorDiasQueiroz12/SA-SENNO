// Erro customizado com um statusCode HTTP associado.
//
// Por que isso existe: o errorHandler.middleware.js decide se mostra a
// mensagem de erro para o usuario (erro "conhecido", esperado pela regra de
// negocio - ex: "E-mail ja cadastrado") ou se esconde os detalhes (erro
// inesperado, ex: falha de conexao com o banco). A diferenca entre os dois
// casos e justamente ter ou nao um statusCode definido explicitamente.
//
// Uso nos services/controllers dos proximos blocos, por exemplo:
//   throw new AppError("E-mail ja cadastrado", 409);

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

module.exports = AppError;
