const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const SessionSchema = new Schema({
  sid: { type: ObjectId },
});

module.exports = model('Session', SessionSchema);
