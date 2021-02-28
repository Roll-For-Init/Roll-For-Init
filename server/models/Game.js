const mongoose = require("mongoose");

var { Schema } = mongoose;

const GameSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  //DM, GM, owner of the party/lobby
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  invited: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  party: {
    type: Schema.Types.ObjectId,
    ref: "Party",
  },
  encounters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Encounter"  
    }
  ],
  current_encounter: {
    type: Schema.Types.ObjectId,
    ref: "Encounter"
  },
}, {
  timestamps: true
});

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
