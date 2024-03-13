const express = require('express');
const router = express.Router();

const deleteNewsController = require('../app/controllers/DeleteNewsController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/delete-news/:id', deleteNewsController.index)
router.post('/delete-news/:id', deleteNewsController.delete)

module.exports = router;
