const express = require('express');
const router = express.Router();

const contactController = require('../app/controllers/ContactController');

router.get('/:slug',contactController.show);
router.get('/',contactController.index);


module.exports = router;
