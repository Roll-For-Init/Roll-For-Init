const axios = require('axios').default;

const API_URL = '/api/';

const createCharacter = characterData => {
  return axios.post(API_URL + 'characters/create', characterData);
};

const updateCharacter = characterData => {
  const id = characterData.id;
  return axios.put(API_URL + 'characters/' + id + '/', characterData);
};

const deleteCharacter = characterData => {
  const id = characterData.id;
  return axios.delete(API_URL + 'characters/' + id + '/', characterData);
};

export default {
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
