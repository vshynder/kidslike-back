const { Schema, model } = require('mongoose');

const HabbitsSchema = {}; // Заглушка
// const { HabbitsSchema } = require('../habbits/habbits.model');

const TasksSchema = {}; // Заглушка
// const { TaskSchema } = require('../tasks/tasks.model');

const PresentsSchema = {}; // Заглушка
// const { PresentsSchema } = require('../presents/presents.model');

const ChildrenSchema = new Schema({
  idUser: { type: String, required: true },
  name: { type: String },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  stars: { type: Number, default: 0 },
  habbits: [HabbitsSchema],
  tasks: [TasksSchema],
  presents: [PresentsSchema],
});

// module.exports = model('Children', ChildrenSchema);

exports.ChildrenModel = model('Children', ChildrenSchema);
exports.ChildrenSchema = ChildrenSchema;
