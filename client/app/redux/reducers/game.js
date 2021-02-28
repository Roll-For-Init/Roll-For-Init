import {
  CREATE_GAME_SUCCESS,
  CREATE_GAME_FAIL,
  UPDATE_GAME_SUCCESS,
  UPDATE_GAME_FAIL,
} from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
      };
    case CREATE_GAME_FAIL:
      return {
        ...state,
      };
    case UPDATE_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
      };
    case UPDATE_GAME_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
