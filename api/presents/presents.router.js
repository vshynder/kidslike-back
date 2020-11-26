const { Router } = require('express');
const presentsController = require('./presents.controller');
const LoginController = require('../auth/login.controller');
const {imageUploader} = require('./uploadImage')

const router = Router();


router.post('/addPresent', LoginController.authorize, imageUploader, presentsController.addPresent, presentsController.validPresent);
router.post('/buyPresent', LoginController.authorize, presentsController.buyPresent);
router.delete('/:presentId', LoginController.authorize, presentsController.removePresent);
router.get('/:userId', LoginController.authorize, presentsController.getAllPresentsChild)

module.exports = router;
