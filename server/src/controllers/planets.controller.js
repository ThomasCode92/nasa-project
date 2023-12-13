const { getAllPlanets } = require('../models/planets.model');

function httpGetAllPlanets(req, res) {
  const allPlanets = getAllPlanets();
  return res.status(200).json(allPlanets);
}

module.exports = {
  httpGetAllPlanets,
};
