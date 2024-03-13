const express = require('express');
const router = express.Router();

const createNewsController = require('../app/controllers/CreateNewsController');


router.post('/create-news', createNewsController.createNews);
router.get('/create-news', createNewsController.index);

module.exports = router;
