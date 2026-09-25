const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reports.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const { reportSchema, reportStatusSchema } = require("../validators/report.validator");

// Admin: lista denuncias pendentes e altera status
router.get("/", authMiddleware, authorize("ADMIN"), reportsController.listPending);
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN"),
  validate(reportStatusSchema),
  reportsController.updateStatus
);

module.exports = router;
