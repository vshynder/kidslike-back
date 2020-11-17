const express = require('express');
const habbitsRouter = express.Router();
const habbitsController = require('./habbits.controller');

// habbitsRouter.post('/addhabbit', habbitsController.addHabbit);
// habbitsRouter.get('/gethabbit', habbitsController.getHabbit);
habbitsRouter.get(
  '/getallhabbitsuser',
  habbitsController.getAllHabbitsChildrenByUser,
);

module.exports = habbitsRouter;
