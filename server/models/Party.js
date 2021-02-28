const mongoose = require("mongoose");

var { Schema } = mongoose;

const PartySchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  characters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Character",
    },
  ],
  allies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Monster",
    }
  ],
}, {
  timestamps: true
});

const Party = mongoose.model("Party", PartySchema);
module.exports = Party;
