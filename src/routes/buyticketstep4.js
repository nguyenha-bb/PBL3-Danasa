const express = require('express');
const router = express.Router();

const buyTicket4Controller = require('../app/controllers/BuyTicket4Controller');

// router.get('/:slug',loginController.login);
// router.get('/:slug',buyTicket4Controller.show);
router.get('/', buyTicket4Controller.show);
router.post('/', buyTicket4Controller.index);
router.get('/confirm', buyTicket4Controller.showConfirm);
router.post('/confirm', buyTicket4Controller.confirm);

module.exports = router;
