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
    return axios.get(`${API_URL}races`).then((races) => {
        return races.data.results;
    });
};

//Leave out index to get all race objects
const getRaceInfo = (race) => {
    return apiCaller.propogateRacePointer(race.url);
    /*
  if (index) {
    const racePointer = list.find(
      racePointer => racePointer.index === index
    );
    return apiCaller.propogateRacePointer(racePointer);
  } else {
    let raceInfoList = [];
    for (let racePointer of racePointerList) {
      raceInfoList.push(apiCaller.propogateRacePointer(racePointer));
    }
    return raceInfoList;
  }*/
};
const getRaceDetails = (race) => {
    return apiCaller.getRaceMiscDescriptions(race);
}

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
  getRaceDetails
};
