const { Schema, model } = require('mongoose');

const PresentsSchema = new Schema({
  title: String,
  childId: { type: String, required: true },
  reward: Number,
  image: String,
  dateCreated: Date,
});

exports.PresentsModel = model('Presents', PresentsSchema);
exports.PresentsSchema = PresentsSchema;
