const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const ChildrenSchema = new Schema({
  idUser: { type: String, required: true },
  name: { type: String },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  stars: { type: Number, default: 0 },
  habbits: { type: Array, required: true },
  tasks: [{ type: ObjectId, ref: 'Tasks' }],
  presents: [{ type: ObjectId, ref: 'Presents' }],
});

exports.ChildrenModel = model('Children', ChildrenSchema);
