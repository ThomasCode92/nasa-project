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

async function loadLaunchData() {
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

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap(payload => payload['customers']);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['data_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} - ${launch.mission}`);
  }
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found!');
  }

  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function findLaunchById(id) {
  return await launches.findOne({ flightNumber: id });
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
