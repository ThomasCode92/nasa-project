const express = require('express');

const { getAllLaunches } = require('../controllers/launches.controller');

const router = express.Router();

router.get('/', getAllLaunches);

module.exports = router;
