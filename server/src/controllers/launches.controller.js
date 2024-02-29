const {
  getAllLaunches,
  findLaunchById,
  scheduleNewLaunch,
  abortLaunchById,
} = require('../models/launches.model');

async function httpGetAllLaunches(req, res) {
  console.log(req.query);

  const allLaunches = await getAllLaunches();
  return res.status(200).json(allLaunches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const isValid =
    launch.mission && launch.rocket && launch.launchDate && launch.target;

  if (!isValid) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  // a string (or unix timestamp) representing a date
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const launch = await findLaunchById(launchId);

  // if launch doesn't exist, return 404
  if (!launch) {
    return res.status(404).json({ error: 'Launch not found' });
  }

  // if launch exists, try to change its status to aborted
  const isAborted = await abortLaunchById(launchId);

  if (!isAborted) {
    return res.status(400).json({ error: 'Launch not aborted' });
  }

  return res.status(200).json({ message: 'Launch aborted successfully' });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
