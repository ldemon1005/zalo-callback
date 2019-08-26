const express = require('express');
const router = express.Router();
const caseController = require('../controllers/case');
const checkAuth = require('../middlewares');

router.get('/', checkAuth, caseController.list);
router.get('/:id', checkAuth, caseController.detail);
router.post('/', checkAuth, caseController.create);
router.post('/batch', checkAuth, caseController.createBatch);
router.patch('/:id', checkAuth, caseController.update);
router.delete('/:id', checkAuth, caseController.delete);

module.exports = router;