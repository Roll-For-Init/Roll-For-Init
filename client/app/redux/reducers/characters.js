import {
  CREATE_CHARACTER,
  SUBMIT_CHARACTER_SUCCESS,
  SUBMIT_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
  SET_RACE,
  SET_CLASS,
  SET_BACKGROUND,
  SET_ABILITIES
} from '../actions/types';

const initialCharacter = {
  race: null, //.ability_bonuses, .choices{equipment: , proficiencies,  etc...}
  class: null, //.choices{equipment: ,proficiencies:,  etc...}, .equipment
  background: null, //.equipment, //.choices{}
  abilities: null, 
  options: null,
  description: null,
  equipment: null,
  submitted: false,
};

const character = (state = initialCharacter, action, charID) => {
  if (state === initialCharacter) {
    state = {
      ...state,
      ...charID,
    };
  }

  const { type, payload } = action;

  switch (type) {
    case SET_RACE:
      return {
        ...state,
        race:
            (payload.race.index && payload.race.index!=state.race?.index)
            ? payload.race
            : { ...state.race, ...payload.race },
     };
    case SET_CLASS:
        return {
            ...state,
            class:
                (payload.theClass.index && payload.theClass.index!=state.class?.index)
                ? payload.theClass
                : {...state.class, ...payload.theClass},
        }
    case SET_BACKGROUND:
        console.log(payload.background);
        console.log(state.background);
        return {
            ...state,
            background:
                (payload.background.index && payload.background.index != state.background?.index)
                ? payload.background
                : {...state.background, ...payload.background},
        }
    case SET_ABILITIES:
        return {
            ...state,
            abilities:
                {...state.abilities, ...payload.abilities}
        }
    default:
      return state;
  }
};

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_CHARACTER_SUCCESS:
      return {
        ...state,
        [payload.name]: payload,
      };
    case SUBMIT_CHARACTER_FAIL:
      return {
        ...state,
      };
    case UPDATE_CHARACTER_SUCCESS:
      return {
        ...state,
        [payload.name]: payload,
      };
    case UPDATE_CHARACTER_FAIL:
      return {
        ...state,
      };
    case CREATE_CHARACTER:
    case SET_RACE:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_CLASS:
        return {
            ...state,
            [payload.charID]: character(state[payload.charID], action, payload),
        }
    case SET_BACKGROUND:
        return {
            ...state,
            [payload.charID]: character(state[payload.charID], action, payload),
        }
    case SET_ABILITIES:
    return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
    }
    default:
      return state;
  }
}
