const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'kepler exploration x',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function existsLaunchWithId(id) {
  return launches.has(id);
}

function addNewLaunch(launch) {
  latestFlightNumber++;

  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  });

  launches.set(latestFlightNumber, newLaunch);
}

function abortLaunchById(launchId) {}

module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  addNewLaunch,
  abortLaunchById,
};
