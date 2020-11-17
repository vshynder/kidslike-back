const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: '', required: false },
  avatarURL: { type: String, required: true },
  status: {
    type: String,
    requred: true,
    enum: ['created', 'verified'],
    default: 'created',
  },
  childrens: [{ type: ObjectId, ref: 'Children' }],
  verificationToken: { type: String, default: '', required: false },
  sessionToken: { type: String, default: '', required: false },
});

// module.exports = new model('User', UserSchema);
