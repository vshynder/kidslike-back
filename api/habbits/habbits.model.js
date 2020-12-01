const { Schema, model } = require('mongoose');

const HabbitsSchema = new Schema({
  nameHabbit: { type: String, required: true },
  priceHabbit: { type: Number, required: true },
  ownerHabbits: { type: String, required: false },
  idChild: { type: String, required: true },
  sprintHabbit: {
    type: String,
    required: true,
    default: '1111111111',
  },
  genderChild: { type: String, required: false },
});

exports.HabbitsModel = model('Habbits', HabbitsSchema);
