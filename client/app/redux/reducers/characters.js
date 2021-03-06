import {
  CREATE_CHARACTER,
  SUBMIT_CHARACTER_SUCCESS,
  SUBMIT_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
  SET_RACE,
  SET_CLASS,
  SET_BACKGROUND,
  SET_DESCRIPTION,
  SET_ABILITIES,
  SET_EQUIPMENT,
  SET_SPELLS,
  SET_PAGE,
  SET_UPDATE,
  SET_ARRAY_UPDATE,
} from '../actions/types';

const initialCharacter = {
  race: null, //.ability_bonuses, .proficiencies, .choices{equipment: , proficiencies,  etc...}, .description {summary, physical, age}
  class: null /*{
    //.choices{equipment: ,proficiencies:,  etc...}, .equipment, .proficiencies
    spellcasting: {
      cantrips_known: 0,
      spells_known: 0,
    },
    index: null,
    
  }*/,

  background: null, //.equipment, .choices{}, .proficiencies, .personality{traits, ideals, bonds, flaws}
  abilities: null,
  options: null,
  description: null,
  equipment: null,
  spells: null,
  submitted: false,
  page: { name: 'race', index: 0 },
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
    case CREATE_CHARACTER:
      return {
        ...state,
        charID: payload.charID,
      };
    case SET_RACE:
      return {
        ...state,
        race:
          payload.race.index && payload.race.index != state.race?.index
            ? payload.race
            : { ...state.race, ...payload.race },
      };
    case SET_CLASS:
      return {
        ...state,
        class:
          payload.theClass.index && payload.theClass.index != state.class?.index
            ? payload.theClass
            : { ...state.class, ...payload.theClass },
      };
    case SET_BACKGROUND:
      return {
        ...state,
        background:
          payload.background?.index &&
          payload.background?.index != state.background?.index
            ? payload.background
            : { ...state.background, ...payload.background },
      };
    case SET_DESCRIPTION:
      return {
        ...state,
        description:
          payload.description.index &&
          payload.description.index != state.description?.index
            ? payload.description
            : { ...state.description, ...payload.description },
      };
    case SET_ABILITIES:
      return {
        ...state,
        abilities: { ...state.abilities, ...payload.abilities },
      };
    case SET_EQUIPMENT:
      return {
        ...state,
        equipment: { ...state.equipment, ...payload.equipment },
      };
    case SET_SPELLS:
      return {
        ...state,
        class: { ...state.class, 
            spells: {...state.class.spells, ...payload.spells} 
        },
      };
    case SET_PAGE:
      return {
        ...state,
        page: {
          name: payload.page.name,
          index: Math.max(payload.page.index, state.page.index),
        },
      };
    case SET_UPDATE:
      return {
        ...state,
        [payload.attribute]: {
          ...state[payload.attribute],
          ...payload.updated,
        },
      };
    case SET_ARRAY_UPDATE:
      return {
        ...state,
        [payload.attribute]: payload.updated,
      };
    default:
      return state;
  }
};

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_CHARACTER_SUCCESS:
      console.log('REDUCER', payload);
      return {
        ...state,
        [payload.charID]: payload,
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
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_RACE:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_CLASS:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_BACKGROUND:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_DESCRIPTION:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_ABILITIES:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_EQUIPMENT:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_SPELLS:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_PAGE:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_UPDATE:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    case SET_ARRAY_UPDATE:
      return {
        ...state,
        [payload.charID]: character(state[payload.charID], action, payload),
      };
    default:
      return state;
  }
}
