const { getAllLaunches, addNewLaunch } = require('../models/launches.model');

function httpGetAllLaunches(req, res) {
  const allLaunches = getAllLaunches();
  return res.status(200).json(allLaunches);
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const isValid =
    launch.mission && launch.rocket && launch.launchDate && launch.destination;

  if (!isValid) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  // a string (or unix timestamp) representing a date
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }

  addNewLaunch(launch);

  return res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
