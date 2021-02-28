import { SET_ALERT, CLEAR_ALERT } from '../actions/types';

const initialState = null;

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      if (state === null) {
        return payload;
      } else {
        return { ...payload, ...state };
      }
    case CLEAR_ALERT:
      return null;

    default:
      return state;
  }
}
