const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    
    ref: 'USER',
  },
  token: String,
  created_at: Date,
  expires_at: Date,
});

// Duplicate the ID field.
tokenSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
tokenSchema.set('toJSON', {
  virtuals: true,
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
