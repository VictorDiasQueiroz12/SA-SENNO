const { z } = require("zod");

const reportSchema = z.object({
  reason: z
    .string({ required_error: "Motivo da denuncia e obrigatorio." })
    .trim()
    .min(5, "Descreva o motivo com pelo menos 5 caracteres.")
    .max(1000, "Motivo muito longo."),
});

const reportStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"], {
    required_error: "Status e obrigatorio.",
  }),
});

module.exports = { reportSchema, reportStatusSchema };
