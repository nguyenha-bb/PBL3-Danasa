const express = require('express');
const router = express.Router();

const showListCusController = require('../app/controllers/ShowListCusController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/list-cus', showListCusController.index);

module.exports = router;
