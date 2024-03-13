const express = require('express');
const router = express.Router();

const deleteCusController = require('../app/controllers/DeleteCusController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/delete-cus/:id', deleteCusController.indexDetail);
router.get('/delete-cus', deleteCusController.index);
router.post('/delete-cus', deleteCusController.deleteCus);
router.post('/delete-cus/search', deleteCusController.loadData);
router.delete('/delete-cus/delete', deleteCusController.delete);

module.exports = router;
