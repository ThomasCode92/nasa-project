const express = require('express');

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
} = require('../controllers/launches.controller');

const router = express.Router();

router.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);

module.exports = router;
