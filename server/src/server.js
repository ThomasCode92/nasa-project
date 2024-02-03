const http = require('http');

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.gbekhgk.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', err => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
