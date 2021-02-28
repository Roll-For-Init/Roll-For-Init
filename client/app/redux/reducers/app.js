import { LOADING_ON, LOADING_OFF } from '../actions/types';

const initialState = { isAppLoading: true };

export default function(state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
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
