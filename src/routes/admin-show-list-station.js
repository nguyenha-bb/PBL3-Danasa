const express = require('express');
const router = express.Router();

const showListStationController = require('../app/controllers/ShowListStationController');

router.get('/list-station', showListStationController.index);

module.exports = router;
