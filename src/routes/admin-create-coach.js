const express = require('express');
const router = express.Router();

const createCoachController = require('../app/controllers/CreateCoachController');

router.get('/create-coach', createCoachController.index);
router.get('/create-coach/getNumberSeat',createCoachController.getNumberSeat);
router.post('/create-coach/create',createCoachController.create);
router.get('/create-coach/fail',createCoachController.fail);

module.exports = router;
