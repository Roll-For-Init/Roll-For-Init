import {
  SUBMIT_CHARACTER_SUCCESS,
  SUBMIT_CHARACTER_FAIL,
  CREATE_CHARACTER,
  CREATE_CHARACTER_SUCCESS,
  CREATE_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
  DELETE_CHARACTER_SUCCESS,
  DELETE_CHARACTER_FAIL,
  SET_ALERT,
  SET_RACE,
  SET_CLASS,
  SET_BACKGROUND,
  SET_DESCRIPTION,
  SET_ABILITIES,
  SET_SPELLS,
} from './types';

import { v4 as uuidv4 } from 'uuid';

import CharacterService from '../services/character.service';

export const submitCharacter = characterInfo => dispatch => {
  return CharacterService.createCharacter(characterInfo).then(
    res => {
      dispatch({
        type: SUBMIT_CHARACTER_SUCCESS,
        payload: { character: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: SUBMIT_CHARACTER_FAIL,
      });
      dispatch({
        type: SET_ALERT,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const updateCharacter = character => dispatch => {
  return CharacterService.updateCharacter(character).then(
    res => {
      dispatch({
        type: UPDATE_CHARACTER_SUCCESS,
        payload: { character: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: UPDATE_CHARACTER_FAIL,
      });
      dispatch({
        type: SET_ALERT,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const deleteCharacter = character => dispatch => {
  return CharacterService.deleteCharacter(character).then(
    res => {
      dispatch({
        type: DELETE_CHARACTER_SUCCESS,
        payload: { character: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: DELETE_CHARACTER_FAIL,
      });
      dispatch({
        type: SET_ALERT,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const startCharacter = () => dispatch => {
  const uuid = uuidv4();
  dispatch({
    type: CREATE_CHARACTER,
    payload: { charID: uuid },
  });
  return uuid;
};

export const setRace = (charID, race) => dispatch => {
  console.log('SET_RACE', charID, race);
  dispatch({ type: SET_RACE, payload: { charID, race } });
};

export const setClass = (charID, theClass) => dispatch => {
  console.log('SET_CLASS', charID, theClass);
  dispatch({ type: SET_CLASS, payload: { charID, theClass } });
};

export const setBackground = (charID, background) => dispatch => {
  console.log('SET_BACKGROUND', charID, background);
  dispatch({ type: SET_BACKGROUND, payload: { charID, background } });
};

export const setDescription = (charID, description) => dispatch => {
  console.log('SET_DESCRIPTION', charID, description);
  dispatch({ type: SET_DESCRIPTION, payload: { charID, description } });
};

export const setAbilities = (charID, abilities) => dispatch => {
  console.log('SET_ABILITIES', charID, abilities);
  dispatch({ type: SET_ABILITIES, payload: { charID, abilities } });
};

export const setSpells = (charID, spells) => dispatch => {
  console.log('SET_SPELLS', charID, spells);
  dispatch({ type: SET_SPELLS, payload: { charID, spells } });
};
