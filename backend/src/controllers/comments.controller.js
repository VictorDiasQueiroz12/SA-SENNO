const commentService = require("../services/comment.service");

async function list(req, res, next) {
  try {
    const comments = await commentService.listBySighting(req.params.sightingId);
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const comment = await commentService.create(req.params.sightingId, req.user.id, req.body.content);
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const comment = await commentService.update(req.params.id, req.user.id, req.body.content);
    res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await commentService.remove(req.params.id, req.user);
    res.status(200).json({ message: "Comentario excluido." });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, update, remove };
