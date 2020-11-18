const express = require('express');
const childrenRouter = express.Router();
const childrenController = require('./children.controller');
// const authController = require('../auth/auth.controller');

childrenRouter.post(
  '/addchild',
  childrenController.validChild,
  childrenController.addChild,
); // authController.authorization

module.exports = childrenRouter;
