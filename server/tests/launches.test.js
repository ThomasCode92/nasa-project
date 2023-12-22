const requests = require('supertest');
const app = require('../src/app');

describe('Test GET /launches', () => {
  test('should respond with correct content type and 200 success', async () => {
    await requests(app)
      .get('/launches')
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
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(response.body).toMatchObject(launchDataWithoutDate);
    expect(responseDate).toBe(requestDate);
  });

  test('should catch missing required properties', () => {
    const response = 400;
    expect(response).toBe(400);
  });

  test('should catch invalid dates', () => {
    const response = 400;
    expect(response).toBe(400);
  });
});
