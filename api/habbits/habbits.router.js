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

habbitsRouter.delete(
  '/delhabbit',
  habbitsController.validIdHabbit,
  habbitsController.deleteHabbit,
);

habbitsRouter.patch('/confirmed/:id', habbitsController.confirmedHabit);
habbitsRouter.patch('/unconfirmed/:id', habbitsController.unconfirmed);

module.exports = habbitsRouter;
