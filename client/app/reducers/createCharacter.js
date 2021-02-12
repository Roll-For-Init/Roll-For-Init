import {
  LOADING_ON,
  LOADING_OFF,
  THROW_ERROR,
  GET_RACE_INFO
} from "../actions";

export const createCharacter = (
  state = {
    races: [
      { name: "dragonborn", subraces: [] },
      { name: "dwarf", subraces: [] },
      { name: "elf", subraces: [] },
      { name: "gnome", subraces: [] },
      {
        name: "half-elf",
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
      { name: "half-orc", subraces: [] },
      { name: "halfling", subraces: [] },
      { name: "human", subraces: [] },
      { name: "tiefling", subraces: [] }
    ],
    selectedRace: null,
    selectedInfo: null
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
      let result;
      state.races.find(race =>
        race.subraces.find(subrace => {
          if (subrace.name === action.payload) {
            result = subrace;
          }
        })
      );

      return {
        ...state,
        selectedRace: result,
        selectedInfo: result
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
