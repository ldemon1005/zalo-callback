const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/callback', authController.callback);
router.post('/authorize', authController.authorize);
router.get('/code', authController.code);

module.exports = router;