import React, { useState, useEffect, useReducer } from 'react';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setSpells } from '../../redux/actions/characters';
import { PropTypes } from 'prop-types';

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

const SpellCard = ({ spell, selected, toggleSelected }) => {
  const select = () => {
    toggleSelected();
    console.log('SELECT');
  };

  return (
    <div className="w-auto card content-card description-card text-black">
      <div className="d-inline text-black">{spell.name}</div>
      <button className="menu-button d-inline" onClick={select}>
        {selected ? 'Selected' : 'Select'}
      </button>
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
  selected: PropTypes.boolean,
  toggleSelected: PropTypes.func,
};

const SpellList = ({ spells, known, level, limit, toggleSelected }) => {
  const isSelected = spell => {
    if (known === null) return false;
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
      {spells !== undefined &&
        spells.map((spell, idx) => {
          console.log('Spell ' + idx + ': ' + spell);
          return (
            <SpellCard
              selected={isSelected(spell)}
              spell={spell}
              key={idx}
              toggleSelected={() => toggleSelected(spell.index)}
            />
          );
        })}
    </div>
  );
};
SpellList.propTypes = {
  spells: PropTypes.arrayOf(spellPropType),
  level: PropTypes.number,
  toggleSelected: PropTypes.func,
  limit: PropTypes.number,
  known: PropTypes.arrayOf(PropTypes.string),
};

export const Spells = ({ charID, setPage }) => {
  const onNext = () => {
    setPage({ index: 5, name: 'spells' });
    window.scrollTo(0, 0);
  };

  const character = useSelector(state => state.characters[charID]);
  const [spellChoices, setSpellChoices] = useState(null);
  const dispatch = useDispatch();

  const limit = {
    0: character.class.spellcasting.cantrips_known,
    1: character.class.spellcasting.spells_known,
  };

  const getKnownSpells = level => {
    return character.spells !== null ? character.spells[level] : null;
  };

  const toggleSelected = (level, index) => {
    var known = getKnownSpells(level);
    if (!known) {
      dispatch(setSpells({ [level]: [index] }));
    } else if (known.includes(index)) {
      dispatch(setSpells({ [level]: [known.filter(spell => spell != index)] }));
    } else if (known.length() < limit[level]) {
      dispatch(setSpells({ [level]: [...known, index] }));
    }
  };

  useEffect(() => {
    if (character.class === undefined) return;
    CharacterService.getSpells(character.class.index.toLowerCase(), [
      0,
      1,
    ]).then(cards => {
      console.log('SPELLS', cards);
      setSpellChoices(cards);
    });
    console.log(character);
  }, [character]);

  return (
    <div className="background">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Spells</h2>
      </div>
      {spellChoices != null && spellChoices != undefined && (
        <>
          {[0, 1].map(level => {
            const currentKey = Object.keys(spellChoices)[level];
            const list = spellChoices[currentKey];
            console.log(currentKey, list);
            return (
              <SpellList
                key={level}
                level={level}
                limit={limit[level]}
                spells={list}
                known={
                  character.spells
                    ? character.spells[level]
                      ? character.spells[level]
                      : null
                    : null
                }
                toggleSelected={index => toggleSelected(level, index)}
              />
            );
          })}
        </>
      )}

      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        Finish
      </button>
    </div>
  );
};
Spells.propTypes = {
  charID: PropTypes.string,
  setPage: PropTypes.func,
};

export default Spells;
