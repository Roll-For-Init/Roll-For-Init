export const LOADING_ON = "LOADING_ON";
export const LOADING_OFF = "LOADING_OFF";

export const GET_RACE_INFO = "GET_RACE_INFO";
export const THROW_ERROR = "THROW_ERROR";

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
