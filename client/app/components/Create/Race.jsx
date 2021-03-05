import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../shared/Dropdown';
import { setRace } from '../../redux/actions';

import CharacterService from '../../redux/services/character.service';
import { PropTypes } from 'prop-types';

const RaceButton = ({ race, setRace, idx }) => {
  const hasSubraces = race.subraces !== undefined;

  const handleClick = () => {
    if (!hasSubraces) {
      setRace();
    }
  };

  return (
    <div className="w-100 h-auto">
      <button
        className={
          hasSubraces
            ? 'btn btn-lg m-0 mb-3 options dropdown-toggle'
            : 'btn btn-lg m-0 mb-3 options'
        }
        type="button"
        id={`dropdownMenuButton1${idx}`}
        data-toggle={hasSubraces ? 'dropdown' : ''}
        onClick={() => handleClick()}
        aria-expanded="true"
      >
        {race.name}
      </button>
      <div
        className="dropdown-menu m-0 p-0"
        aria-labelledby={`dropdownMenuButton1${idx}`}
      >
        {hasSubraces &&
          race.subraces.map((subrace, idx) => (
            <button
              key={idx}
              className="w-100 m-0 border-0 shadow-none text-center text-uppercase options-dropdown"
              onClick={() => handleClick()}
            >
              {subrace.name}
            </button>
          ))}
      </div>
    </div>
  );
};

const Loading = () => {
  return 'LOADING';
};

const Race = ({ charID, setPage }) => {
  const dispatch = useDispatch();
  const [races, setRaces] = useState(CharacterService.getRaceList());

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    console.log('Character', character);
  }, [character]);

  //pass in an object of the fields to edit i.e. {index: INDEX} or {choiceA: CHOICE}
  //access with character.race.choiceA
  const setSelectedRace = race => {
    dispatch(setRace(charID, race));
  };

  return (
    <div className="race position-relative">
      {character.race === null ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Race</h2>
          </div>
          <div className="dropdown btn-group-vertical w-100 mt-3">
            {races &&
              races.map((race, idx) => {
                if (race)
                  return (
                    <RaceButton
                      race={race}
                      setRace={() => setSelectedRace({ index: race.index })}
                      key={idx}
                      idx={idx}
                    />
                  );
              })}
          </div>
        </>
      ) : (
        <RaceDetails
          charID={charID}
          setPage={setPage}
          clearRace={() => setSelectedRace({ index: null })}
        />
      )}
    </div>
  );
};

const BasicInfoCard = ({ speed, size }) => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      Speed: {speed}
      <br />
      Size: {size}
    </div>
  );
};
BasicInfoCard.propTypes = {
  speed: PropTypes.number.isRequired,
  size: PropTypes.string.isRequired,
};

const AbilityBonusCard = ({ bonus, ability_score }) => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      +{bonus}{' '}
      {ability_score.full_name ? ability_score.full_name : ability_score.name}
    </div>
  );
};
const abilityBonusProps = {
  bonus: PropTypes.number.isRequired,
  ability_score: PropTypes.shape({
    index: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    name: PropTypes.string,
  }),
};
AbilityBonusCard.propTypes = { ...abilityBonusProps };

const AbilityBonuses = ({ ability_bonuses }) => {
  return (
    <React.Fragment>
      {ability_bonuses.map((ability, index) => {
        return (
          <AbilityBonusCard
            ability_score={ability.ability_score}
            bonus={ability.bonus}
            key={index}
          />
        );
      })}
    </React.Fragment>
  );
};
AbilityBonuses.propTypes = {
  ability_bonuses: PropTypes.arrayOf(
    PropTypes.shape({
      ...abilityBonusProps,
    })
  ),
};

const RaceDetails = ({ charID, setPage, clearRace }) => {
  const { race } = useSelector(state => state.characters[charID]);

  const [raceInfo, setRaceInfo] = useState(undefined);

  useEffect(() => {
    CharacterService.getRaceInfo(race.index).then(
      race => {
        setRaceInfo(race.main); //TODO: or subrace
        console.log(race);
      },
      error => {
        console.log(error.toString());
      }
    );
  }, []);

  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  const onNext = () => {
    setPage({ index: 1, name: 'class' });
    window.scrollTo(0, 0);
  };

  return raceInfo ? (
    <>
      <div className="d-none d-md-flex title-back-wrapper">
        <button
          onClick={clearRace}
          className="m-0 mr-3 btn btn-secondary btn-back"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <h2 className="title-card p-4">Race</h2>
        <div className="btn-back-spacer ml-3"></div>
      </div>
      <div className="d-md-none">
        <button onClick={clearRace} className="btn btn-secondary btn-back-sm">
          <i className="bi bi-chevron-left"></i>
          <span>Back</span>
        </button>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>{raceInfo.name}</h4>
        </div>
        <div>
          <AbilityBonuses ability_bonuses={raceInfo.ability_bonuses} />
        </div>
      </div>
      <div className="card translucent-card">
        <h4 className="card content-card card-title">Race Options</h4>
        <div>
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: 'hello', name: 'Hello' }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}
          />
          <Dropdown
            title="Choose 1 Extra Language"
            items={[{ index: 'hello', name: 'Hello' }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}
          />
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>Starting Proficiencies</h4>
        </div>
        <div className="card content-card description-card">
          <p className="text-capitalize">
            <strong className="small-caps">Weapons</strong> – longswords,
            shortswords, shortbows, longbows
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Skills</strong> – perception
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Languages</strong> – Common, Elvish
          </p>
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default Race;

// let apiData;
// useEffect(() => {
//   const fetchData = async () => {
//     apiData = await classCaller();
//     console.log(apiData);
//     /*apiData.main for the top level race, .sub for the subrace. pull qualities from .main and .sub together to form the interface.
//     all properties are the same as in the api, but you can access .desc for those that were pointers before, such as in traits and options.
//     there are also two properties in .main and .sub, .options and .proficiencies, that group all options and proficiencies together.
//     proficiencies are sorted into .weapons, .armor, .languages, .skills, .tools, and .throws.
//     options is an array where each object in it has a .choose (with how many you should choose, an integer), .header (the type, ie "extra language")
//       and .options subarray with .name and .desc in each.
//     ANY .DESC DESCRIPTION IS AN ARRAY. proceeed accordingly.
//   */
//   };
//   fetchData();
// }, []);

// useEffect(() => {
//   CharacterService.getRaceInfo().then(
//     response => {
//       setRaces(response.data.results);
//       console.log(response.data.results);
//     },
//     error => {
//       const err =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(err);
//     }
//   );
// }, []);
