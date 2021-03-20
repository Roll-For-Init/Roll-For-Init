import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setSpells } from '../../redux/actions/characters';
import { PropTypes } from 'prop-types';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { Link } from 'react-router-dom';


/**
 * FOR DEACTIVATING SELECT BUTTONS: you will have to target all spell card children that are NOT selected,
 * disable their onclick, and change their class from btn-outline-success to btn-inactive
 */

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

const SpellCard = ({ spell, selected, toggleSelected, level }) => {
  return (
    <div className="card content-card spell-card">
      <div id={spell.index} className="container-fluid px-0">
        <div className="row">
          <div className="spell-title col-sm">{spell.name}</div>
          <button
            onClick={toggleSelected}
            className={`btn ${
              selected ? `btn-clicked` : `btn-outline-success`
            } d-inline col-sm`}
            name={level}
          >
            {selected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
      <hr className="solid" />
      <div className="spell-desc">
        <p>
          {spell.level === 0
            ? 'cantrip'
            : `level ${spell.level}`}
          {spell.ritual && (<em> (ritual)</em>)}
          <span>
            <em>{spell.school.name.toLowerCase()}</em>
          </span>
        </p>
        <p>
          Casting Time: <em>{spell.casting_time}</em>
        </p>
        <p>
          Range: <em>{spell.range}</em>
        </p>
        <p>
          Components: <em>{`${spell.components.join(', ')} ${spell.material ? `(${spell.material})` : ``}`}</em>
        </p>
        <p>
          Duration:{' '}
          <em>
            {spell.concentration
              ? `Concentration, ${spell.duration}`
              : spell.duration}
          </em>
        </p>
      </div>
      <hr className="solid" />
      <div className="spell-desc">
        {spell.desc !== undefined && (
          <ReactReadMoreReadLess
            charLimit={250}
            readMoreText="Show more"
            readLessText="Show less"
            readMoreClassName="read-more-less--more"
            readLessClassName="read-more-less--less"
          >
            {spell.desc.join('\n')}
          </ReactReadMoreReadLess>
        )}
      </div>
    </div>
  );
};
SpellCard.propTypes = {
  spell: spellPropType,
  selected: PropTypes.boolean,
  toggleSelected: PropTypes.func,
};

const SpellList = ({ spells, known, level, limit, toggleSelected }) => {
  const isSelected = spell => {
    if (!known) return false;
    return known.includes(spell.index);
  };

  return (
    <div className="card translucent-card">
      <div className="card content-card card-title">
        <h6>
          {level == 0 ? 'Cantrips' : level == 1 ? 'Level 1 Spells' : 'Spells'} -
          Choose {limit}
        </h6>
      </div>
      {spells !== undefined && (
        <div className="spell-custom-container">
          <div className="container">
            <div className="card-columns">
              {spells.map((spell, idx) => {
                return (
                  <SpellCard
                    selected={isSelected(spell)}
                    spell={spell}
                    key={idx}
                    level={level}
                    toggleSelected={() => toggleSelected(spell.index)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
SpellList.propTypes = {
  spells: PropTypes.arrayOf(spellPropType),
  level: PropTypes.number,
  toggleSelected: PropTypes.func,
  limit: PropTypes.number,
  known: PropTypes.arrayOf(PropTypes.string).isRequired,
};
// import { setEquipment } from '../../redux/actions';
import { Link } from 'react-router-dom';

export const Spells = ({ charID, setPage }) => {
  const character = useSelector(state => state.characters[charID]);
  const [spells, setSpells] = useState(null);
  const [spellLimit, setSpellLimit] = useState(0);
  const [cantripLimit, setCantripLimit] = useState(0);
  useEffect(() => {
    CharacterService.getSpells(character.class, [0,1]).then((cards) => {
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
      <Link to="/dashboard"><button type="button" className="text-uppercase btn-primary btn-lg px-5 btn-floating">
            Submit Character
      </button></Link>      
      </>
      )}

    </div>
  );
};

export default Spells;
