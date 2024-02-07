const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.gbekhgk.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const MONGO_TEST_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.gbekhgk.mongodb.net/${process.env.MONGODB_TEST_DATABASE}?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', err => {
  console.error(err);
});

async function mongoConnect(useTestDb) {
  const dbUrl = useTestDb ? MONGO_TEST_URL : MONGO_URL;
  await mongoose.connect(dbUrl);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

async function clearDatabase() {
  await mongoose.connection.db.dropCollection('launches');
}

module.exports = { mongoConnect, mongoDisconnect, clearDatabase };
