const express = require('express');
const router = express.Router();

const createScheduleController = require('../app/controllers/CreateScheduleController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/create-schedule', createScheduleController.index);
router.get('/create-schedule/getCoach',createScheduleController.getCoach);
router.get('/create-schedule/getDataStation',createScheduleController.getDataStation);
router.post('/create-schedule/create',createScheduleController.createSchedule);
router.get('/create-schedule/getDirect', createScheduleController.findInfoRoute);

module.exports = router;
