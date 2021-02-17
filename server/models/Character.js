const mongoose = require("mongoose");

var { Schema } = mongoose;

//Needs updating to fit current model. Date updated/created are good parameters to keep track of.
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
  // level: {},
  // experience: {
  //   current,
  //   threshold,
  // },
  // race: {},
  // class: [{
  //   name: {},
  //   levels: {},
  // }],
  // traits: [{
  //   ribbon: [{
  //     name: {},
  //     description: {},
  //   }],
  //   damage: [{
  //     name: {},
  //     description: {},
  //     mechanics: [{
  //       stat: {}
  //       skill: {}, 
  //       set: {},
  //     }],
  //     charges: {
  //       current: {},
  //       max: {},
  //     }
  //   }],
  //   utility [{
  //     name: {},
  //     description: {},
  //     mechanics: [{
  //       stat: {},
  //       skill: {}, 
  //       set: {},
  //     }],
  //     charges: {
  //       current: {},
  //       max: {},
  //     }
  //   }],
  // }],
  // background: {
  //   name: {},
  //   features: [{
  //     name: {},
  //     description: {},
  //   }],
  // },
  // prof_bonus: {},
  // miscproficiencies: {
  //   armor: [],
  //   weapons: [],
  //   tools: [],
  //   languages: [],
  // },
  // ability_scores: {
  //   str: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   dex: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   con: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   int: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   wis: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   cha: {
  //     score: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  // },
  // saving_throws: {
  //   str: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   dex: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   con: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   int: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   wis: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  //   cha: {
  //     proficiency: {},
  //     modifier: {},
  //     advantage: {},
  //     disadvantage: {},
  //   },
  // },
  // skills: [],
  // ac: {},
  // health: {
  //   current: {},
  //   max: {},
  //   temp: {},
  // },
  // hitdice: {
  //   current: {},
  //   max: {},
  //   type: {},
  // },
  // initiativebonus: {},
  // attacks: [{
  //   advantage: {},
  //   disadvantage: {},
  // }],
  // weapons: [{
  //   name: {},
  //   attacktype: {},
  //   damagetype: {},
  //   damagedice: {},
  //   modifier: {},
  //   ammunition: {
  //     current:,
  //     max:,
  //   },
  // }],
  // spells: {
  //   slots: {
  //     current: {},
  //     max: {},
  //   },
  //   castingability: {},
  //   advantage: {},
  //   disadvantage: {},
  //   combat: [],
  //   utility: [],
  // },
  // defenses: {
  //   advantage: {},
  //   disadvantage: {},
  //   resistances: [],
  //   immunities: [],
  //   vulnerabilities: [],
  // },
  // conditions: [],
  // deatht_throws: {
  //   successes: {},
  //   failures: {},
  // },
  // inspiration: {},
  // inventory: [],
  // treasure: {
  //   copper: {},
  //   silver: {},
  //   electrum: {},
  //   gold: {},
  //   platium: {},
  //   other: [{
  //     name: {},
  //     value: {},
  //   }]
  // },
  // speed: {},
  // size: {},
  // lore: {
  //   alignment: {},
  //   personality_traits: {},
  //   ideals: {},
  //   bonds: {},
  //   flaws: {},
  //   backstory: {},
  //   allies: {},
  //   additional_features: {},
  //   log: {},
  // },
  // physical_stats: {
  //   age: {},
  //   height: {},
  //   weight: {},
  //   eyes: {},
  //   skin: {},
  //   hair: {},
  // },
  // portrait: {},
}, {
  timestamps: true
});

const Character = mongoose.model("Character", CharacterSchema);
module.exports = Character;
