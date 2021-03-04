import { LOADING_ON, LOADING_OFF } from '../actions/types';

export const finishLoading = cause => dispatch => {
  dispatch({ type: LOADING_OFF, payload: cause });
  return;
};

export const startLoading = cause => dispatch => {
  dispatch({ type: LOADING_ON, payload: cause });
  return;
};
