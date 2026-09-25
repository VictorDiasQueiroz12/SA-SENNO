const { z } = require("zod");

const commentSchema = z.object({
  content: z
    .string({ required_error: "Comentario e obrigatorio." })
    .trim()
    .min(1, "Comentario nao pode ser vazio.")
    .max(1000, "Comentario muito longo."),
});

module.exports = { commentSchema };
