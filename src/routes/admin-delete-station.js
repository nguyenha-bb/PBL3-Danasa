const express = require('express');
const router = express.Router();

const deleteStationController = require('../app/controllers/DeleteStationController');

router.get('/delete-station/:id', deleteStationController.index);
router.post('/delete-station/:id', deleteStationController.delete);

module.exports = router;
