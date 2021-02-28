const axios = require('axios').default;

const API_URL = '/api/';

const createGame = gameData => {
  return axios.post(API_URL + 'games/create', gameData);
};

const updateGame = gameData => {
  const id = gameData.id;
  return axios.put(API_URL + 'games/' + id + '/', gameData);
};

const deleteGame = gameData => {
  const id = gameData.id;
  return axios.delete(API_URL + 'games/' + id + '/', gameData);
};

export default {
  createGame,
  updateGame,
  deleteGame,
};
