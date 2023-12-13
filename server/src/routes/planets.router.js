const express = require('express');

const { httpGetAllPlanets } = require('../controllers/planets.controller');

const router = express.Router();

router.get('/', httpGetAllPlanets);

module.exports = router;
