const express = require('express');

const planetsRouter = require('./routes/planets.router');

const app = express();

app.use(express.json());
app.use('/planets', planetsRouter);

module.exports = app;
