const { Schema, model } = require('mongoose');

const authUserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatarURL: { type: String, required: true },
  status: {
    type: String,
    requred: true,
    enum: ['created', 'verified'],
    default: 'created',
  },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
});

module.exports = new model('User', authUserSchema);
