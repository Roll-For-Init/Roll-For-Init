const axios = require('../../utils/axios');
const apiCaller = require('../../utils/apiCaller');
const { parseEquipment, fillModel } = require('../../utils/characterValidator');

const API_URL = '/api/';

const validateCharacter = async characterData => {
  let equipment = await parseEquipment(
    characterData.equipment,
    [
      ...(characterData.class.proficiencies.Weapons || []),
      ...(characterData.race.proficiencies.Weapons || []),
      ...(characterData.background.proficiencies.Weapons || []),
    ],
    [
      ...(characterData.class.proficiencies.Armor || []),
      ...(characterData.race.proficiencies.Armor || []),
      ...(characterData.background.proficiencies.Armor || []),
    ]
  );
  return await fillModel(equipment, characterData).then(validatedCharacter => {
    return validatedCharacter;
  });
};
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

const getIndexedList = type => {
  return axios.get(`${API_URL}${type}`).then(items => {
      console.log(items);
    return items.data.results;
  });
};

const getSubList = url => {
  return axios.get(`${API_URL}${url}`).then(items => {
    return items.data;
  });
};

const getRaceInfo = race => {
  return apiCaller.propogateRacePointer(race);
};
const getRaceDetails = race => {
  return apiCaller.getRaceMiscDescriptions(race);
};

const getClassInfo = theClass => {
  return apiCaller.classCaller(theClass);
};

const getClassDetails = theClass => {
  return apiCaller.getClassDescriptions(theClass);
};
const getBackgroundInfo = background => {
  return apiCaller.backgroundCaller(
    `${API_URL}backgrounds/${background.index}`
  );
};

const getAbilityScoreInfo = abilityScore => {
  const query = abilityScore ? abilityScore : '';
  return axios.get(API_URL + 'ability-scores/' + query);
};

const getEquipmentDetails = equipment => {
  return apiCaller.equipmentDetails(equipment);
};
const getSpells = (theClass, levels) => {
  let url = `${API_URL}classes/${theClass.index.toLowerCase()}/levels/`;
  let subclassSpells =
    theClass.subclass && theClass.subclass_spells
      ? theClass.subclass.subclass_spells
      : [];
  return apiCaller.getSpellCards(levels, url, subclassSpells);
};
const getLevel = (theClass, level) => {
  return axios.get(API_URL + 'classes/' + theClass + 'levels/' + level);
};

export default {
  validateCharacter,
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
  getSpells,
  getLevel,
};
