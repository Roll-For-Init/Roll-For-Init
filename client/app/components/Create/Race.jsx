import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../shared/Dropdown';

import { setRace } from '../../redux/actions';

import CharacterService from '../../redux/services/character.service';

const RaceView = ({ race, setRace, idx }) => {
  const hasSubraces = race.subraces !== undefined;

  const handleClick = () => {
    if (!hasSubraces) {
      console.log(hasSubraces, 'hasSubraces');
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
  const [races, setRaces] = useState(undefined);

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    CharacterService.getRaceInfo().then(
      response => {
        setRaces(response.data.results);
        console.log(response.data.results);
      },
      error => {
        const err =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    console.log('2', JSON.stringify(character));
  }, [character]);

  const setSelectedRace = raceIndex => {
    dispatch(setRace(charID, raceIndex));
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
                    <RaceView
                      race={race}
                      setRace={() => setSelectedRace(race.index)}
                      key={idx}
                      idx={idx}
                    />
                  );
              })}
          </div>
        </>
      ) : (
        <SidePanel
          charID={charID}
          setPage={setPage}
          clearRace={() => setSelectedRace(null)}
        />
      )}
    </div>
  );
};

const BasicInfoCard = () => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      Speed: {speed}
      <br />
      Size: {size}
    </div>
  );
};

const AbilityBonusCard = ({ bonus, name, full_name, desc, skills }) => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      +{bonus} {full_name}
    </div>
  );
};

const AbilityBonuses = ({ ability_bonuses }) => {
  const [abilityScoreInfo, setAbilityScoreInfo] = useState(undefined);

  useEffect(() => {
    CharacterService.getAbilityScoreInfo().then(
      response => {
        setAbilityScoreInfo(response.data.results);
        console.log(response.data.results);
      },
      error => {
        const err =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(err);
      }
    );
  }, []);

  return abilityScoreInfo ? (
    <React.Fragment>
      {ability_bonuses.map((ability, index) => {
        return (
          <AbilityBonusCard
            full_name={'full_name'}
            bonus={ability.bonus}
            key={index}
          />
        );
      })}
    </React.Fragment>
  ) : (
    <Loading />
  );
};

const SidePanel = ({ charID, setPage, clearRace }) => {
  const { race } = useSelector(state => state.characters[charID]);

  const [raceInfo, setRaceInfo] = useState(undefined);

  useEffect(() => {
    CharacterService.getRaceInfo(race).then(
      response => {
        setRaceInfo(response.data);
        console.log(response.data);
      },
      error => {
        const err =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(err);
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
