const { Schema, model } = require('mongoose');

const TaskModel = new Schema({
  title: String,
  price: Number,
  days: Number,
  startDay: Date,
  finishDay: Date,
});

module.exports = model('Tasks', TaskModel);
