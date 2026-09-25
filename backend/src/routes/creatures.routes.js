const express = require("express");
const router = express.Router();

const creaturesController = require("../controllers/creatures.controller");

// Publica - usada principalmente para autocomplete no formulario do frontend
router.get("/", creaturesController.list);

// Publica - ranking de criaturas mais avistadas (item 22 do briefing)
router.get("/ranking", creaturesController.ranking);

module.exports = router;
