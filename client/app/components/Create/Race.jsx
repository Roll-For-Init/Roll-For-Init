import React, { useState, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../shared/Dropdown';
import { setRace, setPage } from '../../redux/actions';
import CharacterService from '../../redux/services/character.service';
import { PropTypes } from 'prop-types';

const RaceButton = ({ race, setRace, idx }) => {
  const hasSubraces = race.subraces.length > 0;

  const handleClick = () => {
    if (!hasSubraces) {
      setRace();
    }
  };

  const handleSubClick = subrace => {
    setRace(subrace);
  };

  return (
    <div className="w-100 h-auto">
      <button
        className={
          hasSubraces
            ? 'btn btn-secondary btn-lg m-0 mb-3 options dropdown-toggle'
            : 'btn btn-secondary btn-lg m-0 mb-3 options'
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
              onClick={() => handleSubClick(subrace)}
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

const Race = ({ charID }) => {
  const dispatch = useDispatch();
  const [races, setRaces] = useState(null);
  const [viewRace, setViewRace] = useState(false);

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    if (character?.race?.index) {
      setViewRace(true);
    }
    CharacterService.getIndexedList('races').then(list => setRaces(list));
  }, []);

  //pass in an object of the fields to edit i.e. {index: INDEX} or {choiceA: CHOICE}
  //access with character.race.choiceA
  const setSelectedRace = race => {
    dispatch(setRace(charID, race));
    setViewRace(true);
  };

  return (
    <div className="race position-relative">
      {!viewRace ? (
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
                      setRace={subrace =>
                        subrace
                          ? setSelectedRace({
                              index: race.name,
                              url: race.url,
                              subrace: {
                                index: subrace.name,
                                url: subrace.url,
                              },
                            })
                          : setSelectedRace({ index: race.name, url: race.url })
                      }
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
          clearRace={() => setViewRace(false)}
          dispatch={dispatch}
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

const AbilityBonusCard = ({ ability_bonuses }) => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      {ability_bonuses.map((ability, index) => {
        if (index + 1 == ability_bonuses.length)
          return `+${ability.bonus} ${ability.ability_score.full_name}`;
        else
          return (
            <>
              +{ability.bonus} {ability.ability_score.full_name}
              <br />
            </>
          );
      })}
    </div>
  );
};

/*
const abilityBonusProps = {
  bonus: PropTypes.number.isRequired,
  ability_score: PropTypes.shape({
    index: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    name: PropTypes.string,
  }),
};
AbilityBonusCard.propTypes = { ...abilityBonusProps };
*/
const AbilityBonuses = ({ ability_bonuses }) => {
  return (
    <React.Fragment>
      <AbilityBonusCard ability_bonuses={ability_bonuses} />
    </React.Fragment>
  );
};
/*
AbilityBonuses.propTypes = {
  ability_bonuses: PropTypes.arrayOf(
    PropTypes.shape({
      ...abilityBonusProps,
    })
  ),
};
*/
const RaceDetails = ({ charID, clearRace, dispatch }) => {
  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    dispatch(setRace(charID, { choices: newState }));
    return newState;
  };

  const [userChoices, setUserChoices] = useReducer(reducer, {});
  const { race } = useSelector(state => state.characters[charID]);

  const [raceInfo, setRaceInfo] = useState(undefined);

  useEffect(() => {
    CharacterService.getRaceInfo(race)
      .then(
        race => {
          console.log(race);
          setRaceInfo(race);
          return race;
        }
        /*error => {
        console.log(error.toString());
      }*/
      )
      .then(race => {
        CharacterService.getRaceDetails(race).then(race => {
          setRaceInfo(race);
        }); //FUTURE ISSUE: if user navigates away from page too early, they may not have everything they need?
        let abilityBonuses = race.sub
          ? race.main.ability_bonuses.concat(race.sub.ability_bonuses)
          : race.main.ability_bonuses;
        dispatch(setRace(charID, { ability_bonuses: abilityBonuses }));
        dispatch(setRace(charID, { proficiencies: race.proficiencies }));
        let allTraits = race.sub
          ? race.main.traits.concat(race.sub.racial_traits)
          : race.main.traits;
        dispatch(setRace(charID, { traits: allTraits }));
        let description = {
          summary: [race.main.alignment, race.sub?.desc],
          age: race.main.age,
          size: race.main.size_description,
        };
        dispatch(setRace(charID, { description: description }));
      });
  }, []);

  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  const onNext = () => {
    dispatch(setPage(charID, { index: 1, name: 'class' }));
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
          <h4>{raceInfo.sub ? raceInfo.sub.name : raceInfo.main.name}</h4>
        </div>
        <div>
          <AbilityBonuses
            ability_bonuses={
              raceInfo.sub
                ? raceInfo.main.ability_bonuses.concat(
                    raceInfo.sub.ability_bonuses
                  )
                : raceInfo.main.ability_bonuses
            }
          />
          <BasicInfoCard
            speed={raceInfo.main.speed}
            size={raceInfo.main.size}
          />
        </div>
      </div>
      {raceInfo.options.length > 0 && (
        <div className="card translucent-card">
          <h4 className="card content-card card-title">Race Options</h4>
          <div>
            {raceInfo.options.map((option, index) => {
              return (
                <Dropdown
                  ddLabel={option.header}
                  title={`Choose ${option.choose}`}
                  items={option.options}
                  width="100%"
                  selectLimit={option.choose}
                  multiselect={option.choose > 1}
                  selection={
                    userChoices[
                      `${option.header
                        .toLowerCase()
                        .replace(' ', '-')}-${index}`
                    ]
                  }
                  setSelection={setUserChoices}
                  classname="choice"
                  stateKey={`${option.header
                    .toLowerCase()
                    .replace(' ', '-')}-${index}`}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      )}
      {raceInfo.profCount > 0 && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>Starting Proficiencies</h4>
          </div>
          <div className="card content-card description-card">
            {//console.log(Object.values(raceInfo.proficiencies))
            Object.keys(raceInfo.proficiencies).map(key => {
              return (
                <p className="text-capitalize">
                  <strong className="small-caps">{key}</strong> -{' '}
                  {raceInfo.proficiencies[key].map((prof, index) => {
                    if (raceInfo.proficiencies[key].length === index + 1)
                      return `${prof}`;
                    else return `${prof}, `;
                  })}
                </p>
              );
            })}
          </div>
        </div>
      )}
      {raceInfo.main.traits.length > 0 && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>{`${raceInfo.main.name} Traits`}</h4>
          </div>
          {raceInfo.main.traits.map(trait => {
            return (
              <div className="card content-card description-card">
                <h3 className="card-subtitle small-caps">{trait.name}</h3>
                <p>{trait.desc}</p>
                {trait.table && (
                  <table>
                    <tr>
                      {trait.table.header.map(item => {
                        return <th>{item}</th>;
                      })}
                    </tr>
                    {trait.table.rows.map(row => {
                      return (
                        <tr>
                          {row.map(item => {
                            return <td>{item}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
      {raceInfo.sub && raceInfo.sub.racial_traits.length > 0 && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>{`${raceInfo.sub.name} Traits`}</h4>
          </div>
          {raceInfo.sub.racial_traits.map(trait => {
            return (
              <div className="card content-card description-card">
                <h3 className="card-subtitle small-caps">{trait.name}</h3>
                <p>{trait.desc}</p>
              </div>
            );
          })}
        </div>
      )}
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
