import { LOADING_ON, LOADING_OFF, LOGIN_SUCCESS } from '../actions/types';

export const finishLoading = () => (dispatch, getState) => {
  const { isLoggedIn } = getState().auth;

  dispatch({ type: LOADING_OFF });
  return;
};

export const restartLoading = () => dispatch => {
  return;
};
