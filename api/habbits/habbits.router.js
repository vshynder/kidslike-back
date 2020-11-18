const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');

habbitsRouter.post(
  '/addhabbit',
  habbitsController.validIdChild,
  habbitsController.addHabbit,
);

habbitsRouter.get(
  '/getallhabbitsuser',
  habbitsController.getAllHabbitsChildrenByUser,
);

habbitsRouter.patch(
  '/updatehabbit',
  habbitsController.validIdHabbit,
  habbitsController.updateHabbit,
);

module.exports = habbitsRouter;
