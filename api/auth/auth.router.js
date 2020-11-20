const { Router } = require('express');
const LoginController = require('./login.controller');
const router = Router();

const { googleOAuth, facebookOAuth, initUser } = require('./auth.controller');

router.get('/google', googleOAuth.formQueryString.bind(googleOAuth));
router.get(
  '/google/callback',
  googleOAuth.loginFormGoogle.bind(googleOAuth),
  initUser.bind(),
);
router.get('/facebook', facebookOAuth.formQueryString.bind(facebookOAuth));
router.get(
  '/facebook/callback',
  facebookOAuth.loginFormFacebook.bind(facebookOAuth),
  initUser.bind(),
);

router.get('/login', LoginController.validateUserLogin, LoginController.login);
router.put('/logout', LoginController.authorize, LoginController.logout);

module.exports = router;
