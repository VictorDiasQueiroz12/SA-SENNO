// Validacao dos dados de entrada com Zod.
//
// Por que validar aqui, antes do controller?
// Assim o controller/service nunca recebem dados no formato errado -
// se o e-mail nao for um e-mail valido, ou a senha for muito curta,
// a requisicao e rejeitada com 400 antes de tocar em qualquer logica
// de negocio ou no banco de dados.

const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Nome e obrigatorio." })
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome muito longo."),
  email: z
    .string({ required_error: "E-mail e obrigatorio." })
    .trim()
    .toLowerCase()
    .email("E-mail invalido."),
  password: z
    .string({ required_error: "Senha e obrigatoria." })
    .min(6, "Senha deve ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail e obrigatorio." })
    .trim()
    .toLowerCase()
    .email("E-mail invalido."),
  password: z.string({ required_error: "Senha e obrigatoria." }).min(1, "Senha e obrigatoria."),
});

module.exports = { registerSchema, loginSchema };
