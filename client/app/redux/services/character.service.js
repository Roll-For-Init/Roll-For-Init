const axios = require('axios').default;

import { racePointerList } from './constants';
import apiCaller from '../../components/apiCaller';

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

const getRaceList = () => {
  return racePointerList;
};

//Leave out index to get all race objects
const getRaceInfo = index => {
  if (index) {
    const racePointer = racePointerList.find(
      racePointer => racePointer.index === index
    );
    return apiCaller.propogateRacePointer(racePointer);
  } else {
    let raceInfoList = [];
    for (let racePointer of racePointerList) {
      raceInfoList.push(apiCaller.propogateRacePointer(racePointer));
    }
    return raceInfoList;
  }
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
  getRaceList,
  getRaceInfo,
  getClassInfo,
  getBackgroundInfo,
  getAbilityScoreInfo,
};
