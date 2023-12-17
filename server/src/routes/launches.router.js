const express = require('express');

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require('../controllers/launches.controller');

const router = express.Router();

router.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);

router.delete('/:id', httpAbortLaunch);

module.exports = router;
