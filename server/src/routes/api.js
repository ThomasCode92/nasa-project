const express = require('express');

const planetsRouter = require('./planets.router');
const launchesRouter = require('./launches.router');

const api = express.Router();

// Routes
api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;
