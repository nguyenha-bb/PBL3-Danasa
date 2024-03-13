const express = require('express');
const router = express.Router();

const deleteCoachController = require('../app/controllers/DeleteCoachController');

// router.get('/:slug',loginController.login);
// router.get('/:slug',showListCusController.show);
router.get('/delete-coach/:id', deleteCoachController.index);
router.post('/delete-coach/:id',deleteCoachController.delete);

module.exports = router;
