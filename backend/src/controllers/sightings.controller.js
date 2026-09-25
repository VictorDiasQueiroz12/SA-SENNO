// Controllers de Avistamentos.
// Nenhuma regra de negocio aqui - so recebe a requisicao (ja validada pelo
// Zod, quando aplicavel) e chama o service correspondente.

const sightingService = require("../services/sighting.service");

async function list(req, res, next) {
  try {
    const result = await sightingService.list(req.query, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const sighting = await sightingService.getById(req.params.id, req.user);
    res.status(200).json({ sighting });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const sighting = await sightingService.create(req.user.id, req.body);
    res.status(201).json({ sighting });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const sighting = await sightingService.update(req.params.id, req.body, req.user);
    res.status(200).json({ sighting });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await sightingService.remove(req.params.id, req.user);
    res.status(200).json({ message: "Avistamento excluido." });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const sighting = await sightingService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ sighting });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove, updateStatus };
