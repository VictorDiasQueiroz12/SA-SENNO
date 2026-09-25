// Middleware generico de validacao com Zod.
//
// Recebe um schema (definido em src/validators/) e devolve um middleware
// pronto para ser usado em qualquer rota:
//   router.post("/register", validate(registerSchema), authController.register)
//
// Se a validacao falhar, responde 400 com uma mensagem clara, sem chegar
// a chamar o controller. Se passar, substitui req.body pela versao "parseada"
// pelo Zod (ja com trim/lowercase/etc aplicados pelos schemas).

const AppError = require("../utils/AppError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return next(new AppError(firstIssue.message, 400));
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
