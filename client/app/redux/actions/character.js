import {
  CREATE_CHARACTER_SUCCESS,
  CREATE_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
  DELETE_CHARACTER_SUCCESS,
  DELETE_CHARACTER_FAIL,
  SET_ALERT,
} from './types';

import CharacterService from '../services/character.service';

export const create = () => dispatch => {
  return CharacterService.createCharacter().then(
    res => {
      dispatch({
        type: CREATE_CHARACTER_SUCCESS,
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
        type: CREATE_CHARACTER_FAIL,
      });
      dispatch({
        type: SET_ALERT,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const update = () => dispatch => {
  return CharacterService.updateCharacter().then(
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

export const _delete = () => dispatch => {
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
