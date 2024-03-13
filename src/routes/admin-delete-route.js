const express = require('express');
const router = express.Router();

const deleteRouteController = require('../app/controllers/DeleteRouteController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/delete-route/:id', deleteRouteController.index);
router.delete('/delete-route/:id', deleteRouteController.save);

module.exports = router;
