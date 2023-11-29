const express = require('express');

const { getAllPlanets } = require('../controllers/planets.controller');

const router = express.Router();

router.get('/', getAllPlanets);

module.exports = router;
