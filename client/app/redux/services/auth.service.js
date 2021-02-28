const axios = require('axios').default;

const API_URL = "/api/users/";

const options = {
  headers: {
    'Content-Type': 'application/json',
  }
}

const register = (username, email, password) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  const loginData = {
    email: email,
    password: password,
  };
  return axios.post(API_URL + "login", loginData, options);
};

const logout = () => {
  return axios.post(API_URL + "logout").then(() => {
    localStorage.removeItem("user");
  });
};

export default {
  register,
  login,
  logout,
};