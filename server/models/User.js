const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ]
}, {
  timestamps: true
})

const User = mongoose.model("User", UserSchema);
module.exports = User;
