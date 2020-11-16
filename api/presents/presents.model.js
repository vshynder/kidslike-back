const { Schema, model } = require('mongoose');

const PresentsModel = new Schema({
  title: String,
  childId: String,
  bal: Number,
  image: String,
  dateCreated: Date,
});

module.exports = model('Presents', PresentsModel);
