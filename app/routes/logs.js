const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs');
//const checkAuth = require('../middlewares');
router.get('/', logsController.list);

module.exports = router;