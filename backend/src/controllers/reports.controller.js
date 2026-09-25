const reportService = require("../services/report.service");

async function create(req, res, next) {
  try {
    const report = await reportService.create(req.params.sightingId, req.user.id, req.body.reason);
    res.status(201).json({ report });
  } catch (error) {
    next(error);
  }
}

async function listPending(req, res, next) {
  try {
    const reports = await reportService.listPending();
    res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const report = await reportService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, listPending, updateStatus };
