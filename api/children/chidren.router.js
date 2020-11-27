const express = require('express');
const childrenRouter = express.Router();
const childrenController = require('./children.controller');
const LoginController = require('../auth/login.controller');

childrenRouter.post(
  '/addchild',
  childrenController.validChild,
  childrenController.addChild,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

module.exports = childrenRouter;
