const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const AppError = require("../utils/AppError");

router.post("/", authMiddleware, upload.single("photo"), (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Nenhum arquivo enviado.", 400);
    }
    // Apenas a referencia (URL relativa) e devolvida - o banco nunca guarda o arquivo em si.
    const photoUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ photoUrl });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
