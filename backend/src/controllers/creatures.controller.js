const creatureService = require("../services/creature.service");

async function list(req, res, next) {
  try {
    const creatures = await creatureService.listAll();
    res.status(200).json({ creatures });
  } catch (error) {
    next(error);
  }
}

async function ranking(req, res, next) {
  try {
    const ranking = await creatureService.getRanking();
    res.status(200).json({ ranking });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, ranking };
