const { Router } = require('express');
const presentsController = require('./presents.controller');
const {imageUploader} = require('./uploadImage')

const router = Router();


router.post('/addPresent', imageUploader, presentsController.validPresent, presentsController.addPresent);
router.post('/buyPresent', presentsController.buyPresent);
router.delete('/:presentId', presentsController.removePresent);
router.get('/:userId',presentsController.getAllPresentsChild)

module.exports = router;
