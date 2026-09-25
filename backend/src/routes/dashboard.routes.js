const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.get("/", authMiddleware, authorize("ADMIN"), dashboardController.getStats);

module.exports = router;
