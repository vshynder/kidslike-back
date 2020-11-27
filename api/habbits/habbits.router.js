const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');
const LoginController = require('../auth/login.controller');

habbitsRouter.post(
  '/addhabbit',
  habbitsController.validIdChild,
  habbitsController.validAddHabit,
  habbitsController.addHabbit,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

habbitsRouter.get(
  '/getallhabbitsuser',
  habbitsController.getAllHabbitsChildrenByUser,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

habbitsRouter.patch(
  '/updatehabbit',
  habbitsController.validUpdateHabbit,
  habbitsController.validIdHabbit,
  habbitsController.updateHabbit,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

habbitsRouter.delete(
  '/delhabbit/:idHabbit',
  habbitsController.validDeleteHabbit,
  habbitsController.deleteHabbit,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

habbitsRouter.patch(
  '/checkhabbit',
  habbitsController.validCheckHabbit,
  habbitsController.validIdHabbit,
  habbitsController.checkHabbit,
); // LoginController.authorize // <= ДОБАВИТЬ!!!

module.exports = habbitsRouter;
