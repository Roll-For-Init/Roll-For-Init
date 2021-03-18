import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
// import { setEquipment } from '../../redux/actions';

export const Spells = ({ charID, setPage }) => {
  // const onNext = () => {
  //   setPage({ index: 5, name: 'spells' });
  //   window.scrollTo(0, 0);
  // };
  const character = useSelector(state => state.characters[charID]);
  const [spells, setSpells] = useState(null);
  const [spellLimit, setSpellLimit] = useState(0);
  const [cantripLimit, setCantripLimit] = useState(0);
  useEffect(() => {
    CharacterService.getSpells(character.class.index.toLowerCase(), [0,1]).then((cards) => {
      console.log("SPELLS", cards);
      setSpells(cards);
      setSpellLimit(character.class.spellcasting.spells_known);
      setCantripLimit(character.class.spellcasting.cantrips_known);
    })
  }, []);

  return (
    <div className="background">
      {spells!=null && (
        <>
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Spells</h2>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Cantrip Choose 2</h4>
        </div>
      </div>
      
      {/* <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button> */}
      </>
      )}

    </div>
  );
};

export default Spells;