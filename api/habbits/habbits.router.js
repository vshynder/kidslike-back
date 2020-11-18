const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');

habbitsRouter.get(
  '/getallhabbitsuser',
  habbitsController.getAllHabbitsChildrenByUser,
);

module.exports = habbitsRouter;
