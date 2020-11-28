const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');
const LoginController = require('../auth/login.controller');

habbitsRouter.post(
  '/addhabbit',
  LoginController.authorize,
  habbitsController.validIdChild,
  habbitsController.validAddHabit,
  habbitsController.addHabbit,
);

habbitsRouter.get(
  '/getallhabbitsuser',
  LoginController.authorize,
  habbitsController.getAllHabbitsChildrenByUser,
);

habbitsRouter.patch(
  '/updatehabbit',
  LoginController.authorize,
  habbitsController.validUpdateHabbit,
  habbitsController.validIdHabbit,
  habbitsController.updateHabbit,
);

habbitsRouter.delete(
  '/:idHabbit',
  LoginController.authorize,
  habbitsController.validDeleteHabbit,
  habbitsController.deleteHabbit,
);

habbitsRouter.patch(
  '/checkhabbit',
  LoginController.authorize,
  habbitsController.validCheckHabbit,
  habbitsController.validIdHabbit,
  habbitsController.checkHabbit,
);

module.exports = habbitsRouter;
