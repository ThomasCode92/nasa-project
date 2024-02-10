const { getAllPlanets } = require('../models/planets.model');

async function httpGetAllPlanets(req, res) {
  const allPlanets = await getAllPlanets();
  return res.status(200).json(allPlanets);
}

module.exports = {
  httpGetAllPlanets,
};
