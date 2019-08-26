const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const checkAuth = require('../middlewares');
router.get('/', checkAuth, accountController.list);
router.get('/listBatch', checkAuth, accountController.listBatch);
router.get('/:id', checkAuth, accountController.detail);
router.post('/', checkAuth, accountController.create);
router.post('/batch', checkAuth, accountController.createBatch);
router.patch('/:id', checkAuth, accountController.update);
router.delete('/:id', checkAuth, accountController.delete);

module.exports = router;