const { Router } = require('express');

const router = Router();
const GoogleOAuthController = require('./auth.controller')


router.post('google/',GoogleOAuthController.formQueryString)
router.post('google/callback',GoogleOAuthController.loginFormGoogle, GoogleOAuthController.initifacationUser)
module.exports = router;
