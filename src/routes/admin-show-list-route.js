const express = require('express');
const router = express.Router();

const showListRouteController = require('../app/controllers/ShowListRouteController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/list-route', showListRouteController.index);

module.exports = router;
