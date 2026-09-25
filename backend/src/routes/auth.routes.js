const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// Rotas publicas
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Rota protegida: precisa de um JWT valido (authMiddleware) para ser acessada
router.get("/me", authMiddleware, authController.me);

module.exports = router;
