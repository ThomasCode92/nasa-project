const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

// prettier-ignore
const keplerDataFile = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

async function savePlanet(planet) {
  const data = { keplerName: planet.kepler_name };

  try {
    await planets.findOneAndUpdate(data, data, { upsert: true });
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(keplerDataFile)
      .pipe(parse({ comment: '#', columns: true }))
      .on('data', async data => {
        if (!isHabitablePlanet(data)) return;
        await savePlanet(data);
      })
      .on('end', async () => {
        const planets = await getAllPlanets();
        console.log(`${planets.length} habitable planets found!`);
        resolve();
      })
      .on('error', error => {
        reject(error);
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

module.exports = { loadPlanetsData, getAllPlanets };
