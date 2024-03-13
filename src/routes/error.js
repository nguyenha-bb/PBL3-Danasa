const express = require('express');
const router = express.Router();

const errorController = require('../app/controllers/errorController');

router.get('/',errorController.error);
module.exports = router;