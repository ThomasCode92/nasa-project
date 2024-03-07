const requests = require('supertest');

const {
  mongoConnect,
  mongoDisconnect,
  clearDatabase,
} = require('../src/services/mongo.service');
const { loadPlanetsData } = require('../src/models/planets.model');
const app = require('../src/app');

const USE_TEST_DB = !process.env.CI;

beforeAll(async () => {
  await mongoConnect(USE_TEST_DB);
  await loadPlanetsData();
});

afterAll(async () => {
  await clearDatabase();
  await mongoDisconnect();
});

describe('Test GET /launches', () => {
  test('should respond with correct content type and 200 success', async () => {
    await requests(app)
      .get('/api/v1/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launch', () => {
  const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-62 f',
    launchDate: 'January 4, 2028',
  };

  const launchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-62 f',
  };

  test('should respond with correct content type and 201 success', async () => {
    const response = await requests(app)
      .post('/api/v1/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(response.body).toMatchObject(launchDataWithoutDate);
    expect(responseDate).toBe(requestDate);
  });

  test('should catch missing required properties', async () => {
    const response = await requests(app)
      .post('/api/v1/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });

  test('should catch invalid dates', async () => {
    const response = await requests(app)
      .post('/api/v1/launches')
      .send({ ...completeLaunchData, launchDate: 'hello' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Invalid launch date',
    });
  });
});
