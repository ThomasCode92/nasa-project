const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'kepler exploration x',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort('-flightNumber');
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDb.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found!');
  }

  await launchesDb.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

function existsLaunchWithId(id) {
  return launches.has(id);
}

async function scheduleNewLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNumber();
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber + 1,
    upcoming: true,
    success: true,
    customers: ['Zero to Mastery', 'NASA'],
  });

  await saveLaunch(newLaunch);
}

function abortLaunchById(launchId) {
  const abortedLaunch = launches.get(launchId);

  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;

  return abortedLaunch;
}

module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
