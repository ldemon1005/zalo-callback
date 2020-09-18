const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook');
const calllogController = require('../controllers/calllog');
// const checkAuth = require('../middlewares');

router.post('/log', calllogController.detail);
router.post('/logs', calllogController.details);
router.post('/callback', webhookController.callback);
router.get('/getCallback', webhookController.getCallback);
router.get('/getAccessTokenZalo', webhookController.getAccessTokenZalo);

module.exports = router;