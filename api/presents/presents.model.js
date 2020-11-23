const { Schema, model } = require('mongoose');

const PresentsSchema = new Schema({
  title: { type: String, required: true },
  childId: { type: String, required: true },
  bal: { type: Number, required: true },
  image: { type: String, required: true },
  dateCreated: Date,
});

exports.PresentsModel = model('Presents', PresentsSchema);
exports.PresentsSchema = PresentsSchema;
