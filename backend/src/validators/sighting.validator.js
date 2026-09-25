// Validacao dos dados de avistamento com Zod.
//
// IMPORTANTE: nenhum destes schemas inclui "status" ou "userId" como campos
// aceitos na criacao/edicao normal - isso e o que garante, no nivel de
// validacao, que o cliente nao consiga "injetar" esses campos protegidos.
// Mesmo que o body da requisicao contenha status/userId, o Zod descarta
// qualquer campo que nao esteja explicitamente definido no schema.

const { z } = require("zod");

const DANGER_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
const SIGHTING_STATUSES = ["PENDING", "IN_REVIEW", "VERIFIED", "REJECTED"];

// Campos comuns a criacao e edicao (dados normais do avistamento).
const sightingBaseSchema = {
  creatureName: z
    .string({ required_error: "Criatura e obrigatoria." })
    .trim()
    .min(2, "Nome da criatura deve ter pelo menos 2 caracteres.")
    .max(100, "Nome da criatura muito longo."),

  location: z
    .string({ required_error: "Localizacao e obrigatoria." })
    .trim()
    .min(3, "Localizacao deve ter pelo menos 3 caracteres.")
    .max(200, "Localizacao muito longa."),

  latitude: z
    .number({ required_error: "Latitude e obrigatoria." })
    .min(-90, "Latitude invalida.")
    .max(90, "Latitude invalida."),

  longitude: z
    .number({ required_error: "Longitude e obrigatoria." })
    .min(-180, "Longitude invalida.")
    .max(180, "Longitude invalida."),

  occurredAt: z.coerce
    .date({ required_error: "Data/hora do avistamento e obrigatoria." })
    .refine((date) => date.getTime() <= Date.now(), {
      message: "A data do avistamento nao pode ser no futuro.",
    }),

  description: z
    .string({ required_error: "Descricao e obrigatoria." })
    .trim()
    .min(10, "Descricao deve ter pelo menos 10 caracteres.")
    .max(2000, "Descricao muito longa."),

  dangerLevel: z.enum(DANGER_LEVELS, {
    required_error: "Nivel de perigo e obrigatorio.",
    invalid_type_error: "Nivel de perigo invalido.",
  }),

  // Opcional neste bloco - a integracao completa com upload de arquivo e o Bloco 16.
  photoUrl: z.string().trim().max(500).optional().or(z.literal("")),
};

const createSightingSchema = z.object(sightingBaseSchema);

// Edicao (PUT): mesmos campos de dados normais, sem "status".
// Tratamos como substituicao completa dos dados editaveis (nao e um PATCH parcial),
// o que mantem a mesma logica de validacao da criacao - mais simples de explicar.
const updateSightingSchema = z.object(sightingBaseSchema);

// Alteracao de status (PATCH /:id/status): endpoint exclusivo de ADMIN,
// validado separadamente pela rota (authMiddleware + authorize('ADMIN')).
const updateStatusSchema = z.object({
  status: z.enum(SIGHTING_STATUSES, {
    required_error: "Status e obrigatorio.",
    invalid_type_error: "Status invalido.",
  }),
});

module.exports = {
  createSightingSchema,
  updateSightingSchema,
  updateStatusSchema,
  DANGER_LEVELS,
  SIGHTING_STATUSES,
};
