const { launches } = require('../models/launches.model');

function getAllLaunches(req, res) {
  const allLaunches = Array.from(launches.values());
  return res.status(200).json(allLaunches);
}

module.exports = {
  getAllLaunches,
};
