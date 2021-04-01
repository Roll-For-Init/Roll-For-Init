const mongoose = require("mongoose");

const { Schema } = mongoose;

const CharacterSchema = new Schema({ //Add class specific slots
  charID: String,
  name: String,
  level: {
    type: Number,
    default: 1
  },
  experience: {
    current: Number,
    threshhold: Number
  },
  race: {
    name: String,
    description: {
        age: String,
        size: String,
        summary: [String]
    }
  },
  class: [
    {
      name: String,
      levels: Number
    }
  ],
  features: [
      {
          name: String,
          description: String,
          /*
          charges: {
              current: Number,
              max: Number
          }*/
      }
      /*
    {
      ribbon: [
        {
          name: String,
          description: String
        }
      ],
      damage: [
        {
          name: String,
          description: String,
          mechanics: [
            {
              skill: String,
              stat: Number,
              is_active: {
                type: Boolean,
                default: false
              }
            }
          ],
          charges: {
            current: Number,
            max: Number
          }
        }
      ],
      utility: [
        {
          name: String,
          duration: String,
          description: String,
          mechanics: [
            {
              skill: Number,
              stat: Number,
              is_active: {
                type: Boolean,
                default: false
              }
            }
          ],
          charges: {
            current: Number,
            max: Number
          }
        }
      ]
    }*/
  ],
  traits: [
      {
          name: String,
          description: String,
          charges: {
              current: Number,
              max: Number
          }
      }
      /*
    {
      ribbon: [
        {
          name: String,
          description: String
        }
      ],
      damage: [
        {
          name: String,
          description: String,
          mechanics: [
            {
              skill: String,
              stat: Number,
              is_active: {
                type: Boolean,
                default: false
              }
            }
          ],
          charges: {
            current: Number,
            max: Number
          }
        }
      ],
      utility: [
        {
          name: String,
          duration: String,
          description: String,
          mechanics: [
            {
              skill: String,
              stat: Number,
              is_active: {
                type: Boolean,
                default: false
              }
            }
          ],
          charges: {
            current: Number,
            max: Number
          }
        }
      ]
    }*/
  ],
  background: {
    name: String,
    /*
    features: [
      {
        name: String,
        description: String
      }
    ]*/
  },
  proficiency_bonus: Number,
  misc_proficiencies: {
    armor: [ {name: String} ], //and desc?
    weapons: [ {name: String} ],
    tools: [ {name: String} ],
    languages: [ {name: String} ]
  },
  ability_scores: {
    str: {
      score: Number,
      modifier: Number,
      advantage: Number
    },
    dex: {
      score: Number,
      modifier: Number,
      advantage: Number
    },
    con: {
      score: Number,
      modifier: Number,
      advantage: Number
    },
    int: {
      score: Number,
      modifier: Number,
      advantage: Number
    },
    wis: {
      score: Number,
      modifier: Number,
      advantage: Number
    },
    cha: {
      score: Number,
      modifier: Number,
      advantage: Number
    }
  },
  saving_throws: {
    str: {
      proficiency: Boolean,
      modifier: Number,     // NOT base ability score modifier
      advantage: Number
    },
    dex: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    con: {
      proficiency: Boolean,
      modifier: Number,   
      advantage: Number
    },
    int: {
      proficiency: Boolean,
      modifier: Number, 
      advantage: Number
    },
    wis: {
      proficiency: Boolean,
      modifier: Number,   
      advantage: Number
    },
    cha: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    }
  },
  skills: {     // should these skills have an associated ability, or are we getting that from the api?
    acrobatics: {
      proficiency: Boolean,
      // i.e., should each skill have an ability field (like DEX for acrobatics)
      modifier: Number,     // NOT base ability score modifier that is accessed through the abscore object. this is for stuff like expertise
      advantage: Number
    },
    animal_handling: {
      proficiency: Boolean,
      modifier: Number,    
      advantage: Number
    },
    arcana: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    athletics: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    deception: {
      proficiency: Boolean,
      modifier: Number, 
      advantage: Number
    },
    history: {
      proficiency: Boolean,
      modifier: Number,    
      advantage: Number
    },
    insight: {
      proficiency: Boolean,
      modifier: Number,  
      advantage: Number
    },
    intimidation: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    investigation: {
      proficiency: Boolean,
      modifier: Number,    
      advantage: Number
    },
    medicine: {
      proficiency: Boolean,
      modifier: Number,
      advantage: Number
    },
    nature: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    perception: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    performance: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    persuasion: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    religion: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    sleight_of_hand: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    stealth: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
    survival: {
      proficiency: Boolean,
      modifier: Number,     
      advantage: Number
    },
  },
  ac: Number,
  equipped_armor: [
    {
      name: String,
      description: String,
      armor_type: String,        // e.g. light, medium, heavy
      base_ac: Number,
      modifier: String,    // modifier is max +2 bonus?
      /*mechanics: [
        {
          skill: String,
          stat: Number,
          is_active: {
            type: Boolean,
            default: false
          }
        }
      ],*/
    }
  ],
  health: {
    current: Number,
    max: Number,
    temp: Number
  },
  hit_dice: [ //for multiclassing
    {
        current: Number,
        max: Number,
        die_type: Number
    }       // '4d4", etc.
  ],
  initiative_bonus: Number,
  attacks: {
    advantage: Number,
    weapons: [
      {
        name: String,
        attack_type: String,
        damage_type: String,
        damage_dice: String,
        modifier: Number,
        ammunition: {
          current: Number,
          max: Number
        }
      }
    ],
    magic_weapons: [
      {
        name: String,
        attack_type: String,
        damage_type: String,
        damage_dice: String,
        modifier: Number,
        ammunition: {
          current: Number,
          max: Number
        }/*,
        mechanics: [
          {
            skill: String,
            stat: Number,
            is_active: {
              type: Boolean,
              default: false
            }  
          }
        ]*/
      }
    ]
  },
  spells: {
    slots: [{
      current: Number,
      max: Number
    }],
    casting_ability: String,
    advantage: Number,
    cards: [
        {
            name: String,
            level: Number,
            desc: String,    // e.g. "ranged" 
            spell_type: String,
            school: {},
            casting_time: String,   // in terms of actions?, e.g. "instantaneous"
            components: [String], //v, c, etc
            material: String,
            duration: String,
            dc: {
            name: String,         // optional field for attribute (WIS, PER, etc.)
            success: Number       // percentage, half damage?? 
            },
            damage: {
                damage_type: String, 
                damage_at_slot_level: {}
            }      
        }
    ]
    /*
    combat: [
      {
        name: String,
        level: Number,
        description: String,    // e.g. "ranged" 
        spell_type: String,
        school: String,
        casting_time: String,   // in terms of actions?, e.g. "instantaneous"
        components: [
          {
            name: String        // v, s, r 
          }
        ],
        material: String,
        duration: String,
        damage_type: String,    // acid, necrotic, etc.
        dc: {
          name: String,         // optional field for attribute (WIS, PER, etc.)
          success: Number       // percentage, half damage?? 
        },
        damage: String           // "4d4", etc.
      }
    ],
    utility: [
      {
        name: String,
        description: String    // need anything else? no charges, but what's missing?
      }
    ]*/
  },
  defenses: {
    advantage: Number, // if advantage is -1, 0, or 1
    resistances: [ {name: String} ],
    immunities: [ {name: String} ],
    vulnerabilities: [ {name: String} ]
  },
  conditions: [ {name: String} ],
  death_throws: {
      successes: Number,
      failures: Number
  },
  inspiration: {
    type: Boolean,
    default: false
  },
  inventory: [
    {
      name: String,
      description: String,
      category: String,
      weight: Number,
      quantity: Number,
      cost: {
        amount: Number,
        denomination: String        // e.g. "gp", "sp", etc.
      },
      /*
      mechanics: [
        {
          skill: String,
          stat: Number,
          is_active: {
            type: Boolean,
            default: false
          }
        }
      ]*/
    }
  ],
  treasure: {
    cp: Number,
    sp: Number,
    ep: Number,
    gp: Number,
    pp: Number,
    other: [
      {
        name: String,
        value: Number
      }
    ]
  },
  walking_speed: Number,
  size: String,           // "small", "medium"
  lore: {
    alignment: String,
    personality_traits: String,
    ideals: String,
    bonds: String,
    flaws: String,
    backstory: String,
    relationships: String,
    //organizations: String,
    //additional_features: String
  },
  physical_description: {   // all strings so that users can put whatever they want, never referenced in code so doesn't matter
    age: String,
    height: String,
    weight: String,
    eyes: String,
    skin: String,
    hair: String
  },
  portrait: {
      // image, stored on server?
  },/*
  character_gallery: [
    {
      // array of images
    }
  ],*/
  /*public: {
    type: Boolean,
    default: false,
  },*/
  date_updated: {
    type: Date,
    default: Date.now,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Character = mongoose.model("Character", CharacterSchema);
module.exports = Character;
