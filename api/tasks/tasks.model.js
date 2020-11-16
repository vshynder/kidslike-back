const { Schema, Types, model } = require('mongoose');

const TaskModel = new Schema({
  title: String,
  reward: Number,
  daysToDo: Number,
  startDay: Date,
  finishDay: Date,
  childId: Types.ObjectId,
});

module.exports = model('Tasks', TaskModel);
