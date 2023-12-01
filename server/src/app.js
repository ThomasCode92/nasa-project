const path = require('path');

const express = require('express');
const cors = require('cors');

const planetsRouter = require('./routes/planets.router');

const publicFolder = path.join(__dirname, '..', 'public');

const app = express();

app.use(express.json());
app.use(express.static(publicFolder));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/planets', planetsRouter);

module.exports = app;
