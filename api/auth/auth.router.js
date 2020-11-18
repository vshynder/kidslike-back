const { Router } = require('express');

const router = Router();
const {googleOAuth,facebookOAuth,initUser} = require('./auth.controller')


router.get('/google',googleOAuth.formQueryString.bind(googleOAuth));
router.get('/google/callback',googleOAuth.loginFormGoogle.bind(googleOAuth),initUser.bind());
router.get('/facebook',facebookOAuth.formQueryString.bind(facebookOAuth));
router.get('/facebook/callback', facebookOAuth.loginFormFacebook.bind(facebookOAuth),initUser.bind());

module.exports = router;
