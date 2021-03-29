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

const getIndexedList = (type) => {
    return axios.get(`${API_URL}${type}`).then((items) => {
        return items.data.results;
    });
};

const getSubList = (url) => {
    return axios.get(`${API_URL}${url}`).then((items) => {
        return items.data;
    })
}

//Leave out index to get all race objects
const getRaceInfo = (race) => {
    return apiCaller.propogateRacePointer(race);
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

const getClassInfo = (theClass) => {
    return apiCaller.classCaller(theClass);
};

const getClassDetails = (theClass) => {
    return apiCaller.getClassDescriptions(theClass);
}
const getBackgroundInfo = background => {
  return apiCaller.backgroundCaller(`${API_URL}backgrounds/${background.index}`);
};

const getAbilityScoreInfo = abilityScore => {
  const query = abilityScore ? abilityScore : '';
  return axios.get(API_URL + 'ability-scores/' + query);
};

const getEquipmentDetails = equipment => {
  return apiCaller.equipmentDetails(equipment);
}
const getSpells = (theClass, levels) => {
    let url = `${API_URL}classes/${theClass.index.toLowerCase()}/levels/`;
    let subclassSpells = theClass.subclass && theClass.subclass_spells ? theClass.subclass.subclass_spells : [];
    return apiCaller.getSpellCards(levels, url, subclassSpells);
}

export default {
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getIndexedList,
  getSubList,
  getRaceInfo,
  getClassInfo,
  getBackgroundInfo,
  getAbilityScoreInfo,
  getRaceDetails,
  getClassDetails,
  getEquipmentDetails,
  getSpells
};
