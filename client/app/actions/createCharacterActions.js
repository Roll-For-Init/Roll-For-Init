export const LOADING_ON = "LOADING_ON";
export const LOADING_OFF = "LOADING_OFF";

export const GET_RACE_INFO = "GET_RACE_INFO";
export const GET_CLASS_INFO = "GET_CLASS_INFO";
export const GET_BACKGROUND_INFO = "GET_BACKGROUND_INFO";
export const THROW_ERROR = "THROW_ERROR";
export const CLEAR_SELECTED_INFO = "CLEAR_SELECTED_INFO";

export const clearSelectedInfo = () => dispatch => {
  dispatch({ type: LOADING_ON });
  dispatch({ type: CLEAR_SELECTED_INFO });
  dispatch({ type: LOADING_OFF });
};

export const getRaceInfo = raceName => (dispatch, getState) => {
  dispatch({ type: LOADING_ON });

  // axios
  //   .post("/login", data)
  //   .then(() => {

  dispatch({ type: GET_RACE_INFO, payload: raceName });
  // })
  // .catch(error => {
  //   dispatch({
  //     type: AUTH_SIGNUP_END,
  //     payload: {
  //       error: axios_error(error)
  //     }
  //   });
  // });
  dispatch({ type: LOADING_OFF });
};

export const getClassInfo = className => (dispatch, getState) => {
  dispatch({ type: LOADING_ON });

  // axios
  //   .post("/login", data)
  //   .then(() => {

  dispatch({ type: GET_CLASS_INFO, payload: className });
  // })
  // .catch(error => {
  //   dispatch({
  //     type: AUTH_SIGNUP_END,
  //     payload: {
  //       error: axios_error(error)
  //     }
  //   });
  // });
  dispatch({ type: LOADING_OFF });
};

export const getBackgroundInfo = backgroundName => (dispatch, getState) => {
  dispatch({ type: LOADING_ON });

  // axios
  //   .post("/login", data)
  //   .then(() => {

  dispatch({ type: GET_BACKGROUND_INFO, payload: backgroundName });
  // })
  // .catch(error => {
  //   dispatch({
  //     type: AUTH_SIGNUP_END,
  //     payload: {
  //       error: axios_error(error)
  //     }
  //   });
  // });
  dispatch({ type: LOADING_OFF });
};
