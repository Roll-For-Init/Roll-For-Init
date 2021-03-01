import axios from "axios";

export const LOADING_ON = "LOADING_ON";
export const LOADING_OFF = "LOADING_OFF";

export const SIGN_UP = "SIGN_UP";
export const THROW_ERROR = "THROW_ERROR";

export const signUp = newUserData => dispatch => {
  dispatch({ type: LOADING_ON });

  axios
    .post("/register", newUserData)
    .then(data => {
      console.log(data);
      dispatch({ type: SIGN_UP, payload: data });
    })
    .catch(error => {
      dispatch({
        type: THROW_ERROR,
        payload: error.message
      });
    });
  dispatch({ type: LOADING_OFF });
};
