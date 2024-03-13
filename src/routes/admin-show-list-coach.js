const express = require('express');
const router = express.Router();

const showListCoachController = require('../app/controllers/ShowListCoachController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/list-coach', showListCoachController.index);

module.exports = router;
