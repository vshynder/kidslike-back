const { Schema, model } = require('mongoose');

const HabbitsSchema = new Schema({
  nameHabbit: { type: String, required: true },
  priceHabbit: { type: Number, required: true },
  ownerHabbits: { type: String, required: true },
  sprintHabbit: {
    type: Array,
    default: [
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
      { confirmed: false, isProcessed: false },
    ],
  },
});

exports.HabbitsModel = model('Habbits', HabbitsSchema);
exports.HabbitsSchema = HabbitsSchema;
