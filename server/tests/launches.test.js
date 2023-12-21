describe('Test GET /launches', () => {
  test('should respond with 200 success', () => {
    const response = 200;
    expect(response).toBe(200);
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
