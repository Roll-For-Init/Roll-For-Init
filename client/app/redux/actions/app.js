import {
  LOADING_ON,
  LOADING_OFF,
  CACHE_URL,
  SET_CURRENT_CHARACTER,
} from '../actions/types';

export const finishLoading = cause => dispatch => {
  dispatch({ type: LOADING_OFF, payload: cause });
  return;
};

export const startLoading = cause => dispatch => {
  dispatch({ type: LOADING_ON, payload: cause });
  return;
};

export const setCurrentCharacter = charID => dispatch => {
  dispatch({
    type: SET_CURRENT_CHARACTER,
    payload: { charID: charID },
  });
  return;
};

export const isCached = url => (dispatch, getState) => {
  const cache = getState().app.urls?.[url];
  return cache;
};

export const cacheURL = (url, data) => dispatch => {
  dispatch({ type: CACHE_URL, payload: { [url]: data } });
  return;
};
