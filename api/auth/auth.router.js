const { Router } = require('express');

const router = Router();
const LoginController = require('./login.controller');
const GoogleOAuthController = require('./auth.controller');

router.post('google/', GoogleOAuthController.formQueryString);
router.post(
  'google/callback',
  GoogleOAuthController.loginFormGoogle,
  GoogleOAuthController.initifacationUser,
);

router.post('/login', LoginController.validateUserLogin, LoginController.login);
router.get('/authorize', LoginController.authorize);
router.delete('/logout', LoginController.authorize, LoginController.logout);
module.exports = router;
