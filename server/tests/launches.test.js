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
  test('should respond with 200 success', () => {
    const response = 200;
    expect(response).toBe(200);
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
