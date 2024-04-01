const path = require('path');
const http = require('http');

const app = require('./app');
const { mongoConnect } = require('./services/mongo.service');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

// If not in production, load environment variables from .env.local file
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
}

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
