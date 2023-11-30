const fs = require('fs');
const { parse } = require('csv-parse');

let habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

fs.createReadStream('kepler_data.csv')
  .pipe(parse({ comment: '#', columns: true }))
  .on('data', data => {
    if (!isHabitablePlanet(data)) return;
    habitablePlanets.push(data);
  })
  .on('end', () => {
    habitablePlanets = habitablePlanets.map(habitablePlanet => {
      return habitablePlanet['kepler_name'];
    });

    console.log(`${habitablePlanets.length} habitable planets found!`);
    console.log(habitablePlanets);
  })
  .on('error', error => {
    console.error(error);
  });

module.exports = { planets: habitablePlanets };
