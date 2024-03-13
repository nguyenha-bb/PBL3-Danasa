const express = require('express');
const router = express.Router();

const deleteScheduleController = require('../app/controllers/DeleteScheduleController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/delete-schedule/:id', deleteScheduleController.index);
router.post('/delete-schedule/:id',deleteScheduleController.delete);

module.exports = router;
