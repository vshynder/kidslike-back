const { Router } = require('express');
const router = Router();
const tokenController = require('./token.controller')


router.post('/token_refresh/:token',tokenController)
module.exports = router;
