const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiV1Routes = require('./routes/api');

const publicFolder = path.join(__dirname, '..', 'public');

const app = express();

// General middleware
app.use(express.json());
app.use(express.static(publicFolder));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined')); // Request logger

// Routes
app.use('/api/v1', apiV1Routes);

app.get('/*', (req, res) => {
  res.sendFile(path.join(publicFolder, 'index.html'));
});

module.exports = app;
