const mongoose = require("mongoose");

var { Schema } = mongoose;

const CharacterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  player: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Character = mongoose.model("Character", CharacterSchema);
module.exports = Character;
