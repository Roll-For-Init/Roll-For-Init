import React, { useState, useEffect } from 'react';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setSpells } from '../../redux/actions/characters';
import { PropTypes } from 'prop-types';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
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
          {spell.level === 0 ? 'cantrip' : `level ${spell.level}`}
          {spell.ritual && <em> (ritual)</em>}
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
          Components:{' '}
          <em>{`${spell.components.join(', ')} ${
            spell.material ? `(${spell.material})` : ``
          }`}</em>
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

  const breakpointColumnsObj = {
    default: 2,
    767: 1,
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
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
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
        </Masonry>
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

export const Spells = ({ charID, setPage }) => {
  const onNext = () => {
    setPage({ index: 5, name: 'spells' });
    window.scrollTo(0, 0);
  };

  const character = useSelector(state => state.characters[charID]);
  console.log(character);
  const [spellChoices, setSpellChoices] = useState(null);
  const dispatch = useDispatch();

  const limit = {
    0: character.class.spellcasting.cantrips_known,
    1: character.class.spellcasting.spells_known,
  };

  const getKnownSpells = level => {
    const knownSpells = character.spells
      ? character.spells[level]
        ? character.spells[level]
        : null
      : null;
    return knownSpells;
  };

  const toggleSelected = (level, index) => {
    var known = getKnownSpells(level);
    var payload = null;
    if (known?.length >= limit[level] - 1) {
      let unselected = document.getElementsByName(level);
      for (let i = 0; i < unselected.length; i++) {
        if (unselected[i].className.includes('btn-outline-success')) {
          unselected[i].className = unselected[i].className.replace(
            'btn-outline-success',
            'btn-inactive'
          );
        }
      }
    }
    if (!known) {
      payload = { [level]: [index] };
    } else if (known.includes(index)) {
      payload = { [level]: [...known.filter(spell => spell != index)] };
      dispatch(setSpells(payload));
      if (known.length === limit[level]) {
        let unselected = document.getElementsByName(level);
        for (let i = 0; i < unselected.length; i++) {
          if (unselected[i].className.includes('btn-inactive')) {
            unselected[i].className = unselected[i].className.replace(
              'btn-inactive',
              'btn-outline-success'
            );
          }
        }
      }
    } else if (known.length < limit[level]) {
      payload = { [level]: [...known, index] };
    } else {
      return;
    }
    dispatch(setSpells(charID, payload));
  };

  useEffect(() => {
    if (!character.class.index) return;
    CharacterService.getSpells(character.class, [0, 1]).then(cards => {
      setSpellChoices(cards);
    });
    console.log(character);
  }, []);

  return (
    <div className="background">
      {spellChoices != null && spellChoices != undefined ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Spells</h2>
          </div>
          <>
            {[0, 1].map(level => {
              const currentKey = Object.keys(spellChoices)[level];
              const list = spellChoices[currentKey];
              return (
                <SpellList
                  key={level}
                  level={level}
                  limit={limit[level]}
                  spells={list}
                  known={getKnownSpells(level)}
                  toggleSelected={index => toggleSelected(level, index)}
                />
              );
            })}
          </>
          <Link to="/dashboard">
            <button className="text-uppercase btn-primary btn-lg px-5 btn-floating">
              Finish
            </button>
          </Link>
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};
Spells.propTypes = {
  charID: PropTypes.string,
  setPage: PropTypes.func,
};

export default Spells;
