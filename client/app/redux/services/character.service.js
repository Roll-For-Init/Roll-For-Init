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

const getRaceInfo = raceName => {
  const query = raceName ? raceName : '';
  return axios.get(API_URL + 'races/' + query);
};

const getClassInfo = className => {
  const query = className ? className : '';
  return axios.get(API_URL + 'classes/' + query);
};

const getBackgroundInfo = backgroundName => {
  const query = backgroundName ? backgroundName : '';
  return axios.get(API_URL + 'backgrounds/' + query);
};

const getAbilityScoreInfo = abilityScore => {
  const query = abilityScore ? abilityScore : '';
  return axios.get(API_URL + 'ability-scores/' + query);
};

export default {
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getRaceInfo,
  getClassInfo,
  getBackgroundInfo,
  getAbilityScoreInfo,
};
