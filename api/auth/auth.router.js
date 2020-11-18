const { Router } = require('express');

const router = Router();

const LoginController = require('./login.controller');
// const {googleOAuth,facebookOAuth,initUser} = require('./auth.controller')


// router.post('google/', GoogleOAuthController.formQueryString);
// router.post(
//   'google/callback',
//   GoogleOAuthController.loginFormGoogle,
//   GoogleOAuthController.initifacationUser,
// );




// router.get('/google',googleOAuth.formQueryString.bind(googleOAuth));
// router.get('/google/callback',googleOAuth.loginFormGoogle.bind(googleOAuth),initUser.bind());
// router.get('/facebook',facebookOAuth.formQueryString.bind(facebookOAuth));
// router.get('/facebook/callback', facebookOAuth.loginFormFacebook.bind(facebookOAuth),initUser.bind());

router.post('/login', LoginController.validateUserLogin, LoginController.login);
router.get('/authorize', LoginController.authorize);
router.delete('/logout', LoginController.authorize, LoginController.logout);


module.exports = router;
