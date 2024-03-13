const express = require('express');
const router = express.Router();

const buyTicket3Controller = require('../app/controllers/BuyTicket3Controller');

// router.get('/:slug',loginController.login);
router.get('/:slug',buyTicket3Controller.index);
router.get('/', buyTicket3Controller.show);

module.exports = router;
