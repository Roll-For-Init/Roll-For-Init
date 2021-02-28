import {
  CREATE_CHARACTER_SUCCESS,
  CREATE_CHARACTER_FAIL,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAIL,
} from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CHARACTER_SUCCESS:
      return {
        ...state,
        character: payload,
      };
    case CREATE_CHARACTER_FAIL:
      return {
        ...state,
      };
    case UPDATE_CHARACTER_SUCCESS:
      return {
        ...state,
        character: payload,
      };
    case UPDATE_CHARACTER_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
