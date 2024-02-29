/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = config;
