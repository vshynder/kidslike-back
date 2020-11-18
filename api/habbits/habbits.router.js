const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');

habbitsRouter.post(
  '/addhabbit',
  habbitsController.validIdChild,
  habbitsController.addHabbit,
);

module.exports = habbitsRouter;
