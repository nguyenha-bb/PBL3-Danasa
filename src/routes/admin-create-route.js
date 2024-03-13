const express = require('express');
const router = express.Router();

const createRouteController = require('../app/controllers/CreateRouteController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/create-route', createRouteController.index);
router.post('/create-route', createRouteController.save)

module.exports = router;
