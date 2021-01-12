const express = require('express');
const router = express.Router();
const zaloController = require('../controllers/zaloChannel');
// const checkAuth = require('../middlewares');

router.post('/zalo/sendMessage', zaloController.sendMessage);
router.get('/zalo/sendMessage', zaloController.sendMessage);
router.post('/zalo/saveJourney', zaloController.saveJourney);
router.post('/zalo/publishJourney', zaloController.publishJourney);
router.post('/zalo/validateJourney', zaloController.validateJourney);
router.post('/zalo/stopJourney', zaloController.stopJourney);
router.get('/zalo/callbackGetAccessToken', zaloController.stopJourney);

module.exports = router;