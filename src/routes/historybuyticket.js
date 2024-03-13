const express = require('express');
const router = express.Router();

const historyBuyTicketController = require('../app/controllers/HistoryBuyTicketController');

router.get('/', historyBuyTicketController.index);

module.exports = router;
