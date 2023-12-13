const express = require('express');

const { httpGetAllLaunches } = require('../controllers/launches.controller');

const router = express.Router();

router.get('/', httpGetAllLaunches);

module.exports = router;
