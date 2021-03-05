const axios = require('axios').default;

const API_URL = '/api/';

const getPublicContent = () => {
  return axios.get(API_URL);
};

const getUserBoard = () => {
  return axios.get(API_URL + 'users/?');
};

export default {
  getPublicContent,
  getUserBoard,
};
