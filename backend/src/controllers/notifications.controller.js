const notificationService = require("../services/notification.service");

async function list(req, res, next) {
  try {
    const notifications = await notificationService.listForUser(req.user.id);
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ notification });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, markAsRead };
