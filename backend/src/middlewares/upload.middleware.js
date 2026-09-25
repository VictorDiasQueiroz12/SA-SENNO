// Upload local de imagens (desenvolvimento). Em producao, sera substituido
// por um storage externo (opcoes a apresentar antes do deploy - Bloco 34).

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    // Nome de arquivo gerado pelo servidor (nunca o nome original do
    // usuario) - evita path traversal e nomes de arquivo perigosos.
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError("Tipo de arquivo nao permitido. Envie JPEG, PNG ou WEBP.", 400));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.uploadMaxSizeMb * 1024 * 1024 },
});

module.exports = upload;
