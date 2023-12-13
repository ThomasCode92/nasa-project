const { getAllLaunches } = require('../models/launches.model');

function httpGetAllLaunches(req, res) {
  const allLaunches = getAllLaunches();
  return res.status(200).json(allLaunches);
}

module.exports = {
  httpGetAllLaunches,
};
