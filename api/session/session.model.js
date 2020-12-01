const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  sid: { type: Schema.Types.ObjectId },
});

module.exports = model('Session', sessionSchema);
