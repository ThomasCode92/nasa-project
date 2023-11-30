const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

// prettier-ignore
const keplerDataFile = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');
const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(keplerDataFile)
      .pipe(parse({ comment: '#', columns: true }))
      .on('data', data => {
        if (!isHabitablePlanet(data)) return;
        habitablePlanets.push(data);
      })
      .on('end', () => {
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      })
      .on('error', error => {
        reject(error);
      });
  });
}

module.exports = { planets: habitablePlanets, loadPlanetsData };
