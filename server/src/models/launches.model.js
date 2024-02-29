const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort('-flightNumber');
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function populateLaunches() {
  console.log('Downloading launch data...');

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: 'rocket', select: { name: 1 } },
        { path: 'payloads', select: { customers: 1 } },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed!');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap(payload => payload['customers']);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} - ${launch.mission}`);

    // Populate launches collection
    await saveLaunch(launch);
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) return console.log('Launch data already loaded!');

  await populateLaunches();
}

async function getAllLaunches(skip, limit) {
  return await launches.find({}, { _id: 0, __v: 0 }).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function findLaunchById(id) {
  return await findLaunch({ flightNumber: id });
}

async function scheduleNewLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNumber();

  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found!');
  }

  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber + 1,
    target: planet,
    upcoming: true,
    success: true,
    customers: ['Zero to Mastery', 'NASA'],
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  findLaunchById,
  scheduleNewLaunch,
  abortLaunchById,
};
