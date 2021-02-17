const mongoose = require("mongoose");

var { Schema } = mongoose;

//Needs updating to fit current model. Date updated/created are good parameters to keep track of.
const PartySchema = new Schema({
  name: {
    type: String,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
  },
  characters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Character",
    },
  ],
  description: {
    type: String,
  },
}, {
  timestamps: true
});

const Party = mongoose.model("Party", PartySchema);
module.exports = Party;
