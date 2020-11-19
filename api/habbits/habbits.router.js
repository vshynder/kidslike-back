const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');

habbitsRouter.get(
  '/getallhabbitsuser',
  habbitsController.getAllHabbitsChildrenByUser,
);

habbitsRouter.post(
  '/addhabbit',
  habbitsController.validIdChild,
  habbitsController.addHabbit,
);

habbitsRouter.patch('/confirmed/:id', habbitsController.confirmedHabit);
habbitsRouter.patch('/unconfirmed/:id', habbitsController.unconfirmed);

module.exports = habbitsRouter;
