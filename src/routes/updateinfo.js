const express = require('express');
const router = express.Router();

const updateinfoController = require('../app/controllers/UpdateInfoController');

// router.get('/:slug',loginController.login);
router.post('/', updateinfoController.update);
router.get('/',updateinfoController.index);

module.exports = router;
