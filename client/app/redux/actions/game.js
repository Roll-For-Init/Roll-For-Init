import {
  CREATE_GAME_SUCCESS,
  CREATE_GAME_FAIL,
  UPDATE_GAME_SUCCESS,
  UPDATE_GAME_FAIL,
  DELETE_GAME_SUCCESS,
  DELETE_GAME_FAIL,
  SET_ALERT,
} from './types';

import GameService from '../services/game.service';

export const create = () => dispatch => {
  return GameService.createGame().then(
    res => {
      dispatch({
        type: CREATE_GAME_SUCCESS,
        payload: { game: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: CREATE_GAME_FAIL,
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
  return GameService.updateGame().then(
    res => {
      dispatch({
        type: UPDATE_GAME_SUCCESS,
        payload: { game: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: UPDATE_GAME_FAIL,
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
  return GameService.deleteGame(game).then(
    res => {
      dispatch({
        type: DELETE_GAME_SUCCESS,
        payload: { game: res.data },
      });
      return Promise.resolve();
    },
    err => {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: DELETE_GAME_FAIL,
      });
      dispatch({
        type: SET_ALERT,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
