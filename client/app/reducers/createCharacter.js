import {
  LOADING_ON,
  LOADING_OFF,
  THROW_ERROR,
  GET_RACE_INFO,
  GET_CLASS_INFO,
  GET_BACKGROUND_INFO,
  CLEAR_SELECTED_INFO
} from "../actions";

export const createCharacter = (
  state = {
    races: [
      { name: "dragonborn", subraces: [] },
      { name: "dwarf", subraces: [] },
      {
        name: "elf",
        subraces: [
          {
            name: "high elf",
            skills: {
              dexterity: 2,
              intelligence: 1,
              speed: 30,
              size: "medium"
            },
            traits: [
              {
                name: "dark vision",
                description: "You have superior vision blah blah blah"
              },
              {
                name: "dark vision",
                description: "You have superior vision blah blah blah"
              },
              {
                name: "dark vision",
                description: "You have superior vision blah blah blah"
              },
              {
                name: "dark vision",
                description: "You have superior vision blah blah blah"
              }
            ]
          }
        ]
      },
      { name: "gnome", subraces: [] },
      { name: "half-elf", subraces: [] },
      { name: "half-orc", subraces: [] },
      { name: "halfling", subraces: [] },
      { name: "human", subraces: [] },
      { name: "tiefling", subraces: [] }
    ],
    classes: [
      {
        name: "Barbarian"
      },
      {
        name: "Bard"
      },
      {
        name: "Cleric"
      },
      {
        name: "Druid"
      },
      {
        name: "Fighter"
      },
      {
        name: "Monk"
      },
      {
        name: "Paladin"
      },
      {
        name: "Ranger"
      },
      {
        name: "Rogue"
      },
      {
        name: "Sorcerer"
      }
    ],
    backgrounds: [
      {
        index: "acolyte",
        name: "Acolyte",
        desc:
          "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshippers into the presence of the divine. You are not necessarily a cleric--performing sacred rites is not the same thing as channeling divine power.",
        starting_proficiencies: [
          {
            index: "skill-insight",
            name: "Skill: Insight",
            url: "/api/proficiencies/skill-insight"
          },
          {
            index: "skill-religion",
            name: "Skill: Religion",
            url: "/api/proficiencies/skill-religion"
          }
        ],
        language_options: {
          choose: 2,
          type: "languages",
          from: [
            {
              index: "common",
              name: "Common",
              url: "/api/languages/common"
            },
            {
              index: "dwarvish",
              name: "Dwarvish",
              url: "/api/languages/dwarvish"
            },
            {
              index: "elvish",
              name: "Elvish",
              url: "/api/languages/elvish"
            },
            {
              index: "giant",
              name: "Giant",
              url: "/api/languages/giant"
            },
            {
              index: "gnomish",
              name: "Gnomish",
              url: "/api/languages/gnomish"
            },
            {
              index: "goblin",
              name: "Goblin",
              url: "/api/languages/goblin"
            },
            {
              index: "halfling",
              name: "Halfling",
              url: "/api/languages/halfling"
            },
            {
              index: "orc",
              name: "Orc",
              url: "/api/languages/orc"
            },
            {
              index: "abyssal",
              name: "Abyssal",
              url: "/api/languages/abyssal"
            },
            {
              index: "celestial",
              name: "Celestial",
              url: "/api/languages/celestial"
            },
            {
              index: "draconic",
              name: "Draconic",
              url: "/api/languages/draconic"
            },
            {
              index: "deep-speech",
              name: "Deep Speech",
              url: "/api/languages/deep-speech"
            },
            {
              index: "infernal",
              name: "Infernal",
              url: "/api/languages/infernal"
            },
            {
              index: "primordial",
              name: "Primordial",
              url: "/api/languages/primordial"
            },
            {
              index: "sylvan",
              name: "Sylvan",
              url: "/api/languages/sylvan"
            },
            {
              index: "undercommon",
              name: "Undercommon",
              url: "/api/languages/undercommon"
            }
          ]
        },
        feature: {
          name: "Shelter of the Faithful",
          desc: [
            "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
            "You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple."
          ]
        },
      },
      {
        index: "criminal",
        name: "Criminal",  
        desc: "You have spent your life in the service of a criminaling.",          
        starting_proficiencies: [
            {
                "index": "skill-insight",
                "name": "Skill: Insight",
                "url": "/api/proficiencies/skill-insight"
            },
            {
                "index": "skill-religion",
                "name": "Skill: Religion",
                "url": "/api/proficiencies/skill-religion"
            }
        ],
        language_options: {
            choose: 2,
            type: "languages",
            from: [
                {
                    "index": "common",
                    "name": "Common",
                    "url": "/api/languages/common"
                },
                {
                    "index": "dwarvish",
                    "name": "Dwarvish",
                    "url": "/api/languages/dwarvish"
                },
                {
                    "index": "elvish",
                    "name": "Elvish",
                    "url": "/api/languages/elvish"
                },
                {
                    "index": "giant",
                    "name": "Giant",
                    "url": "/api/languages/giant"
                },
                {
                    "index": "gnomish",
                    "name": "Gnomish",
                    "url": "/api/languages/gnomish"
                },
                {
                    "index": "goblin",
                    "name": "Goblin",
                    "url": "/api/languages/goblin"
                },
                {
                    "index": "halfling",
                    "name": "Halfling",
                    "url": "/api/languages/halfling"
                },
                {
                    "index": "orc",
                    "name": "Orc",
                    "url": "/api/languages/orc"
                },
                {
                    "index": "abyssal",
                    "name": "Abyssal",
                    "url": "/api/languages/abyssal"
                },
                {
                    "index": "celestial",
                    "name": "Celestial",
                    "url": "/api/languages/celestial"
                },
                {
                    "index": "draconic",
                    "name": "Draconic",
                    "url": "/api/languages/draconic"
                },
                {
                    "index": "deep-speech",
                    "name": "Deep Speech",
                    "url": "/api/languages/deep-speech"
                },
                {
                    "index": "infernal",
                    "name": "Infernal",
                    "url": "/api/languages/infernal"
                },
                {
                    "index": "primordial",
                    "name": "Primordial",
                    "url": "/api/languages/primordial"
                },
                {
                    "index": "sylvan",
                    "name": "Sylvan",
                    "url": "/api/languages/sylvan"
                },
                {
                    "index": "undercommon",
                    "name": "Undercommon",
                    "url": "/api/languages/undercommon"
                }
            ]
        },
        feature: {
          name: "Shelter of the Faithful",
          desc: [
              "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
              "You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple."
          ]
        },
      },
    ],
    selectedInfo: null,
    character: {
      race: null,
      class: null,
      background: null,
      abilities: null,
      options: null,
      description: null,
      equipment: null
    }
  },
  action
) => {
  switch (action.type) {
    case LOADING_ON:
      return {
        ...state,
        loading: true
      };

    case LOADING_OFF:
      return {
        ...state,
        loading: false
      };

    case CLEAR_SELECTED_INFO:
      return {
        ...state,
        selectedInfo: null
      };

    case GET_RACE_INFO:
      let raceResult;
      state.races.find(race =>
        race.subraces.find(subrace => {
          if (subrace.name === action.payload) {
            raceResult = subrace;
          }
        })
      );

      return {
        ...state,
        character: { ...state.character, race: raceResult },
        selectedInfo: raceResult
      };

    case GET_CLASS_INFO:
      let classResult;
      state.classes.find(classes => {
        if (classes.name === action.payload) {
          classResult = classes;
        }
      });
      return {
        ...state,
        character: { ...state.character, class: classResult },
        selectedInfo: classResult
      };

    case GET_BACKGROUND_INFO:
      let backgroundResult;
      state.backgrounds.find(backgrounds => {
        if (backgrounds.name === action.payload) {
          console.log(backgrounds.name, action.payload);
          backgroundResult = backgrounds;
        }
      });
      return {
        ...state,
        background: { ...state.character, background: backgroundResult },
        selectedInfo: backgroundResult
      };

    case THROW_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};
