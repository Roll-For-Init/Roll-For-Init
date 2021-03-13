import React, { useState, useEffect, useReducer } from 'react';
// import { getAbilityInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
// import { setAbilities } from '../../redux/actions';

export const Abilities = ({ charID, setPage }) => {
  const onNext = () => {
    setPage({ index: 3, name: 'background' });
    window.scrollTo(0, 0);
  };

  return (
    <div className="background">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Abilities</h2>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
    </div>
  );
};

export default Abilities;
