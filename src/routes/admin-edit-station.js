const express = require('express');
const router = express.Router();

const editStationController = require('../app/controllers/EditStationController');

router.get('/edit-station/:id/fail',editStationController.fail);
router.get('/edit-station/:id', editStationController.index);
router.post('/edit-station/:id',editStationController.edit);

module.exports = router;
