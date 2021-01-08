const express = require('express');
const router = express.Router();
const zaloController = require('../controllers/zaloChannel');
// const checkAuth = require('../middlewares');

router.post('/zalo/sendMessage', zaloController.sendMessage);
router.get('/zalo/sendMessage', zaloController.sendMessage);

module.exports = router;