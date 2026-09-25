const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { commentSchema } = require("../validators/comment.validator");

router.put("/:id", authMiddleware, validate(commentSchema), commentsController.update);
router.delete("/:id", authMiddleware, commentsController.remove);

module.exports = router;
