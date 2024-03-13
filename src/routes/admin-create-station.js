const express = require('express');
const router = express.Router();

const createStationController = require('../app/controllers/CreateStationController');

router.post('/create-station', createStationController.createStation);
router.get('/create-station', createStationController.index);

module.exports = router;
