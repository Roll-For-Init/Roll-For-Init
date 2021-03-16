import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
// import { setEquipment } from '../../redux/actions';

export const Equipment = ({ charID, setPage }) => {
  const character = useSelector(state => state.characters[charID]);
  const [equipment, setEquipment] = useState(character.class.equipment.concat(character.background.equipment));
  const [equipmentOptions, setEquipmentOptions] = useState(character.class.equipment_options.concat(character.background.equipment_options));
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);

  const onNext = () => {
    setPage({ index: 6, name: 'spells' });
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const promises = [];
    promises.push(CharacterService.getEquipmentDetails(equipment).then((equipmentWDetails) => {
      setEquipment(equipmentWDetails)
      console.log("equipment", equipmentWDetails)
    }));
    promises.push(CharacterService.getEquipmentDetails(equipmentOptions).then((equipmentWDetails) => {
      setEquipmentOptions(equipmentWDetails)
      console.log("options", equipmentWDetails)
    }));
    Promise.all(promises).then(() => {
      setEquipmentLoaded(true);
    })

  }, []);

  return (
    <div className="background">
      {equipmentLoaded && (
        <>
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Equipment</h2>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Starting Equipment</h4>
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Choose 1</h4>
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Choose 1</h4>
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Choose 1</h4>
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Choose 1</h4>
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
      </>
      )}
    </div>
  );
};

export default Equipment;
