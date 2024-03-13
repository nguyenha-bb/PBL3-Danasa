const express = require('express');
const router = express.Router();

const loginController = require('../app/controllers/LoginController');

router.get('/logout', loginController.show);
router.post('/', loginController.checkUser);
router.get('/',loginController.index);

module.exports = router;
