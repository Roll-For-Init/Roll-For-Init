import React, { useState, useEffect, useReducer } from 'react';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes } from 'prop-types';

const SpellBookDetails = ({
  cantripsKnown,
  cantripLimit,
  spellsKnown,
  spellLimit,
}) => {
  return (
    <div className="card translucent-card">
      <div className="card content-card card-title">
        <h4>Spell Book Details</h4>
      </div>
      <div>
        <h6>
          Cantrips Known: {cantripsKnown || 0}/{cantripLimit}
        </h6>
      </div>
      <div>
        <h6>
          Spells Known: {spellsKnown || 0}/{spellLimit}
        </h6>
      </div>
    </div>
  );
};
SpellBookDetails.propTypes = {
  cantripsKnown: PropTypes.number,
  cantripLimit: PropTypes.number,
  spellsKnown: PropTypes.number,
  spellLimit: PropTypes.number,
};

const spellSchoolPropType = PropTypes.shape({
  name: PropTypes.string,
});
const spellPropType = PropTypes.shape({
  name: PropTypes.string,
  index: PropTypes.string,
  desc: PropTypes.arrayOf(PropTypes.string),
  higher_level: PropTypes.arrayOf(PropTypes.string),
  range: PropTypes.string,
  components: PropTypes.arrayOf(PropTypes.string),
  material: PropTypes.string,
  ritual: PropTypes.boolean,
  duration: PropTypes.string,
  concentration: PropTypes.boolean,
  casting_time: PropTypes.string,
  level: PropTypes.number,
  attack_type: PropTypes.string,
  school: spellSchoolPropType,
});

const SpellCard = ({ spell }) => {
  return (
    <div className="w-auto card content-card description-card text-black">
      <div className="d-inline text-black">{spell.name}</div>
      <button className="menu-button d-inline">Select</button>
      <hr className="solid" />
      <div className="">
        {spell.level === 0 ? 'cantrip' : `level ${spell.level}`}
      </div>
      {spell.ritual === true && <h6>(ritual)</h6>}
      <div>{spell.school.name.toLowerCase()}</div>
      <div className="">
        <h6>Casting Time: {spell.casting_time}</h6>
      </div>
      <div className="">
        <h6>Range: {spell.range}</h6>
      </div>
      <div className="">
        <h6>Components: {spell.components.join()}</h6>
      </div>
      <div className="">
        <h6>Duration: </h6>
        <h6>{spell.duration}</h6>
      </div>
      <hr className="solid" />
      <div className="">
        {spell.desc !== undefined && (
          <p>
            {spell.desc.map(string => {
              return string;
            })}
          </p>
        )}
      </div>
    </div>
  );
};
SpellCard.propTypes = {
  spell: spellPropType,
};

const SpellList = ({ spells }) => {
  const spellList = [].concat.apply([], Object.values(spells));
  return (
    <div className="card translucent-card">
      {spellList !== undefined &&
        spellList.map((spell, idx) => {
          console.log('Spell ' + idx + ': ' + spell);
          return <SpellCard spell={spell} key={idx} />;
        })}
    </div>
  );
};
SpellList.propTypes = {
  spells: PropTypes.arrayOf(spellPropType),
};

export const Spells = ({ charID, setPage }) => {
  const onNext = () => {
    setPage({ index: 5, name: 'spells' });
    window.scrollTo(0, 0);
  };
  const character = useSelector(state => state.characters[charID]);
  const [spells, setSpells] = useState(null);
  const [knownSpells, setKnownSpells] = useState(null);
  // const [spellLimit, setSpellLimit] = useState(0);
  // const [cantripLimit, setCantripLimit] = useState(0);

  const learnSpell = index => {
    setKnownSpells(...knownSpells, index);
  };

  const unlearnSpell = index => {
    setKnownSpells(knownSpells.filter(spell => spell.index != index));
  };

  useEffect(() => {
    if (character.class === undefined) return;
    CharacterService.getSpells(character.class.index.toLowerCase(), [
      0,
      1,
    ]).then(cards => {
      console.log('SPELLS', cards);
      setSpells(cards);
      // setSpellLimit(character.class.spellcasting.spells_known);
      // setCantripLimit(character.class.spellcasting.cantrips_known);
    });
    console.log(character);
  }, [character]);

  return (
    <div className="background">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Spells</h2>
      </div>
      {spells != null && spells != undefined && (
        <>
          <SpellList
            spells={spells}
            learnSpell={learnSpell}
            unlearnSpell={unlearnSpell}
          />
        </>
      )}
    </div>
  );
};
Spells.propTypes = {
  charID: PropTypes.string,
  setPage: PropTypes.function,
};

export default Spells;
