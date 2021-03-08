import {
  CREATE_CHARACTER,
  SUBMIT_CHARACTER_SUCCESS,
  SUBMIT_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
  SET_RACE,
  SET_CLASS
} from '../actions/types';

const initialCharacter = {
  race: null,
  class: null,
  background: null,
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
          payload.race.index === null
            ? null
            : { ...state.race, ...payload.race },
      };
    case SET_CLASS:
        return {
            ...state,
            class:
                payload.theClass.index === null 
                ? null
                : {...state.theClass, ...payload.theClass},
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
    default:
      return state;
  }
}
