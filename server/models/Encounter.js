const mongoose = require("mongoose");

var { Schema } = mongoose;

const EncounterSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  party: {
    type: Schema.Types.ObjectId,
    ref: "Party",
  },
  enemies: [{
      type: Schema.Types.ObjectId,
      ref: "Monster"
  }],
  reward: {
      experience: {},
      items: [],
  },
  initiative: {},
  complete: {
      type: Boolean,
      required: true,
      default: false,
  }, 
}, {
  timestamps: true
});

const Encounter = mongoose.model("Encounter", EncounterSchema);
module.exports = Encounter;
