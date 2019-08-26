const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query');
const checkAuth = require('../../../middlewares');

router.get('/', checkAuth, queryController.getQuery);

module.exports = router;