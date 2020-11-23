const { Router } = require('express');
const presentsController = require('./presents.controller');

const router = Router();


router.post('/addPresent', presentsController.addPresent);
router.post('/buyPresent', presentsController.buyPresent);
router.delete('/:presentId', presentsController.removePresent);
router.get('/:userId',presentsController.getAllPresentsChild)

module.exports = router;
