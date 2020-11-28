const { Schema, model , Types:{ObjectId}} = require('mongoose');

const { HabbitsSchema } = require('../habbits/habbits.model');

const TasksSchema = {}; // Заглушка
// const { TaskSchema } = require('../tasks/tasks.model');

const { PresentsSchema } = require('../presents/presents.model'); // Заглушка
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
  tasks: [{ type: ObjectId, ref: 'Tasks' }],
  presents: [{ type: ObjectId, ref: 'Presents' }],
});

exports.ChildrenModel = model('Children', ChildrenSchema);
exports.ChildrenSchema = ChildrenSchema;
