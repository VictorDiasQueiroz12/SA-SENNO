// Router central da API.
//
// Cada recurso (auth, sightings, comments, etc.) tera seu proprio arquivo
// de rotas dentro de src/routes/, e sera registrado aqui com app.use().
// Isso mantem o app.js limpo e centraliza, em um unico lugar, a visao
// geral de quais recursos a API expoe.
//
// Neste bloco (4), so o health check esta implementado de fato.
// Os demais estao comentados como preparacao para os proximos blocos -
// nao ha logica de negocio nenhuma ainda, apenas a estrutura pronta
// para receber cada arquivo de rota conforme for sendo implementado.

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "little-ville-backend",
    timestamp: new Date().toISOString(),
  });
});

// Implementado no Bloco 6:
router.use("/auth", require("./auth.routes"));

// Implementado no Bloco 10:
router.use("/sightings", require("./sightings.routes"));
router.use("/creatures", require("./creatures.routes"));

// Implementado nos Blocos 11-16:
router.use("/comments", require("./comments.routes"));
router.use("/reports", require("./reports.routes"));
router.use("/notifications", require("./notifications.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/uploads", require("./uploads.routes"));

// TODO REMOVER ANTES DA ENTREGA FINAL - rota TEMPORARIA do Bloco 8, criada apenas
// para testar authMiddleware + authorize("ADMIN") isoladamente, antes de existir
// qualquer rota administrativa real. Deve ser removida assim que o dashboard
// administrativo (Bloco 15) estiver implementado e a autorizacao ja tiver sido
// validada por voce localmente (roteiro de curl do Bloco 8).
router.get("/admin/ping", authMiddleware, authorize("ADMIN"), (req, res) => {
  res.status(200).json({
    message: "Acesso administrativo confirmado.",
    userId: req.user.id,
    role: req.user.role,
  });
});

// Todas as rotas planejadas ja estao implementadas acima.

module.exports = router;
