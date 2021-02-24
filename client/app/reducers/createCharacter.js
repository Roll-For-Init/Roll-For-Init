import {
  LOADING_ON,
  LOADING_OFF,
  THROW_ERROR,
  GET_RACE_INFO,
  GET_CLASS_INFO,
  GET_BACKGROUND_INFO,
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
          console.log(classes.name, action.payload);
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
