const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', err => {
  console.error(err);
});

async function mongoConnect(useTestDb) {
  const dbUrl = useTestDb ? process.env.MONGO_TEST_URL : process.env.MONGO_URL;
  await mongoose.connect(dbUrl);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

async function clearDatabase() {
  await mongoose.connection.db.dropCollection('launches');
  await mongoose.connection.db.dropCollection('planets');
}

module.exports = { mongoConnect, mongoDisconnect, clearDatabase };
