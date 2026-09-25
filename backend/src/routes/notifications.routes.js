const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notifications.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, notificationsController.list);
router.patch("/:id/read", authMiddleware, notificationsController.markAsRead);

module.exports = router;
