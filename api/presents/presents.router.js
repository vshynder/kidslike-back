const { Router } = require('express');
const presentsController = require('./presents.controller');
const LoginController = require('../auth/login.controller');
const { imageUploader } = require('./uploadImage');

const router = Router();

router.post(
  '/',
  LoginController.authorize,
  imageUploader,
  presentsController.addPresentValidation,
  presentsController.addPresent,
);
router.patch(
  '/buy/:presentId',
  LoginController.authorize,
  presentsController.buyPresent,
);
router.delete(
  '/:presentId',
  LoginController.authorize,
  presentsController.removePresent,
);
router.patch(
  '/:presentId',
  LoginController.authorize,
  presentsController.updatePresentValidation,
  presentsController.updatePresent,
);
router.get(
  '/',
  LoginController.authorize,
  presentsController.getAllPresentsChild,
);

module.exports = router;
