const { Router } = require('express');
const AuthController = require('./users.controller');

const router = Router();

router.get('/verify/:verificationToken', AuthController.verificationEmail);

router.post(
  '/register',
  AuthController.validateCreateUser,
  AuthController.register,
);

module.exports = router;
