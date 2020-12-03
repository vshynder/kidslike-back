const express = require('express');
const childrenRouter = express.Router();
const childrenController = require('./children.controller');
const LoginController = require('../auth/login.controller');

childrenRouter.post(
  '/addchild',
  LoginController.authorize,
  childrenController.validChild,
  childrenController.addChild,
);

childrenRouter.get(
  "/allChildrens",
  LoginController.authorize,
  childrenController.getAllChildrensCurrentUser
)


module.exports = childrenRouter;
