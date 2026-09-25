const express = require("express");
const router = express.Router();

const sightingsController = require("../controllers/sightings.controller");
const commentsController = require("../controllers/comments.controller");
const likesController = require("../controllers/likes.controller");
const reportsController = require("../controllers/reports.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createSightingSchema,
  updateSightingSchema,
  updateStatusSchema,
} = require("../validators/sighting.validator");
const { commentSchema } = require("../validators/comment.validator");
const { reportSchema } = require("../validators/report.validator");

// Publicas, mas com autenticacao OPCIONAL (para aplicar a regra de
// visibilidade: dono/admin podem ver avistamentos nao verificados).
router.get("/", optionalAuthMiddleware, sightingsController.list);
router.get("/:id", optionalAuthMiddleware, sightingsController.getById);

// Exige autenticacao - qualquer usuario logado pode criar
router.post("/", authMiddleware, validate(createSightingSchema), sightingsController.create);

// Exige autenticacao - propriedade do recurso OU admin, verificado dentro do service
router.put("/:id", authMiddleware, validate(updateSightingSchema), sightingsController.update);
router.delete("/:id", authMiddleware, sightingsController.remove);

// Exclusivo de ADMIN - moderacao de status
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN"),
  validate(updateStatusSchema),
  sightingsController.updateStatus
);

// Comentarios (Bloco 11) - aninhados sob o avistamento
router.get("/:sightingId/comments", commentsController.list);
router.post("/:sightingId/comments", authMiddleware, validate(commentSchema), commentsController.create);

// Curtidas (Bloco 12) - aninhadas sob o avistamento
router.post("/:sightingId/likes", authMiddleware, likesController.like);
router.delete("/:sightingId/likes", authMiddleware, likesController.unlike);

// Denuncias (Bloco 13) - criacao aninhada sob o avistamento
router.post("/:sightingId/reports", authMiddleware, validate(reportSchema), reportsController.create);

module.exports = router;
