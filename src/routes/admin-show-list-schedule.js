const express = require('express');
const router = express.Router();

const showListScheduleController = require('../app/controllers/ShowListScheduleController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/list-schedule', showListScheduleController.index);
module.exports = router;
