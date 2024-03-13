const express = require('express');
const router = express.Router();

const editRouteController = require('../app/controllers/EditRouteController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/edit-route/:id', editRouteController.index);
router.patch('/edit-route/:id', editRouteController.save);

module.exports = router;
