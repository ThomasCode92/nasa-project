const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets.router');

const publicFolder = path.join(__dirname, '..', 'public');

const app = express();

// General middleware
app.use(express.json());
app.use(express.static(publicFolder));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined')); // Request logger

// Routes
app.use('/planets', planetsRouter);

module.exports = app;
