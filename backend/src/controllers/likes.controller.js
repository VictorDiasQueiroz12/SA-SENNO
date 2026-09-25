const likeService = require("../services/like.service");

async function like(req, res, next) {
  try {
    const result = await likeService.like(req.params.sightingId, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function unlike(req, res, next) {
  try {
    const result = await likeService.unlike(req.params.sightingId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { like, unlike };
