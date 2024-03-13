const express = require('express');
const router = express.Router();

const showListNewsController = require('../app/controllers/ShowListNewsController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/list-news', showListNewsController.index);

module.exports = router;
