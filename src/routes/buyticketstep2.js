const express = require('express');
const router = express.Router();

const buyTicket2Controller = require('../app/controllers/BuyTicket2Controller');

// router.get('/:slug',loginController.login);
router.get('/:slug',buyTicket2Controller.show);
router.get('/', buyTicket2Controller.index);

module.exports = router;
