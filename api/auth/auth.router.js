const { Router } = require('express');
const router = Router();

const LoginController = require('./login.controller');
const { googleOAuth, facebookOAuth, initUser } = require('./auth.controller');
const SignUpController = require('./users.controller');

//google and facebook auth
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

//Register
router.get('/verify/:verificationToken', SignUpController.verificationEmail);
router.post(
  '/register',
  SignUpController.validateCreateUser,
  SignUpController.register,
);

//Login, logout & current
router.post('/login', LoginController.validateUserLogin, LoginController.login);
router.get(
  '/current',
  LoginController.authorize,
  LoginController.getCurrentUser,
);
router.delete('/logout', LoginController.authorize, LoginController.logout);

module.exports = router;
