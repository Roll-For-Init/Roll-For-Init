import { SET_ALERT, CLEAR_ALERT } from './types';

export const setAlert = alert => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: alert,
  });
};

export const clearAlert = () => dispatch => {
  dispatch({
    type: CLEAR_ALERT,
  });
};
