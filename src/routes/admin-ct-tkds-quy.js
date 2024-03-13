const express = require('express');
const router = express.Router();

const detailSalesQuarterController = require('../app/controllers/DetailSalesQuarterController');


router.get('/detail-sales-quy', detailSalesQuarterController.index);

module.exports = router;
