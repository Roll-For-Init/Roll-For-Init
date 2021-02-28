const initialState = { isAppLoading: true };

import { LOADING_ON, LOADING_OFF } from '../actions/types';

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOADING_ON:
      return {
        ...state,
        isAppLoading: true,
      };
    case LOADING_OFF:
      return {
        ...state,
        isAppLoading: false,
      };
    default:
      return state;
  }
}
