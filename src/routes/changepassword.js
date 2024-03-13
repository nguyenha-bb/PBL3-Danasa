const express = require('express');
const router = express.Router();

const changePasswordController = require('../app/controllers/ChangePasswordController');

router.get('/',changePasswordController.index);
router.post('/',changePasswordController.update);


module.exports = router;
