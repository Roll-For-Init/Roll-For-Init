import React, { useState, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../shared/Dropdown';
import { setRace } from '../../redux/actions';
import CharacterService from '../../redux/services/character.service';
import { PropTypes } from 'prop-types';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { Popover, ArrowContainer } from 'react-tiny-popover';

// const RaceButton = ({ race, setRace, idx }) => {
//   const hasSubraces = race.subraces.length > 0;

//   const handleClick = () => {
//     if (!hasSubraces) {
//       setRace();
//     }
//   };

//   const handleSubClick = subrace => {
//     setRace(subrace);
//   };

//   return (
//     <div className="w-100 h-auto">
//       <button
//         className={
//           hasSubraces
//             ? 'btn btn-secondary btn-lg m-0 mb-3 options dropdown-toggle'
//             : 'btn btn-secondary btn-lg m-0 mb-3 options'
//         }
//         type="button"
//         id={`dropdownMenuButton1${idx}`}
//         data-toggle={hasSubraces ? 'dropdown' : ''}
//         onClick={() => handleClick()}
//         aria-expanded="true"
//       >
//         {race.name}
//       </button>
//       <div
//         className="dropdown-menu m-0 p-0"
//         aria-labelledby={`dropdownMenuButton1${idx}`}
//       >
//         {hasSubraces &&
//           race.subraces.map((subrace, idx) => (
//             <button
//               key={idx}
//               className="w-100 m-0 border-0 shadow-none text-center text-uppercase options-dropdown"
//               onClick={() => handleSubClick(subrace)}
//             >
//               {subrace.name}
//             </button>
//           ))}
//       </div>
//     </div>
//   );
// };

const Loading = () => {
  return 'LOADING';
};

const Race = ({ charID, setPage }) => {
  const dispatch = useDispatch();
  const [races, setRaces] = useState(null);
  const [viewRace, setViewRace] = useState(false);
  const [currentRace, setCurrentRace] = useState(null)

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    CharacterService.getIndexedList('races').then(list => setRaces(list));
  }, []);

  //pass in an object of the fields to edit i.e. {index: INDEX} or {choiceA: CHOICE}
  //access with character.race.choiceA
  const selectRace = race => {
    setCurrentRace(race)
    if(race.subrace) {
      let racewsubrace = {...race, ...{subrace: race.subrace.index}};
      dispatch(setRace(charID, racewsubrace));
    }
    else {
      dispatch(setRace(charID, race));
    }
    setViewRace(true);
  };

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  }

  const raceIconsOffWhite = importAll(
    require.context(
      '../../../public/assets/imgs/icons/off-white/race',
      false,
      /\.(png)$/
    )
  );

  // function sortRaces(races) {
  //   races = races || [];

  //   const sortedRaces = races
  //     .map(race => (race.subraces.length > 0 ? race.subraces[0] : race))
  //     .sort((a, b) => a.name.localeCompare(b.name));
  //   console.log(sortedRaces);

  //   return sortedRaces;
  // }
  function sortRaces(races) {
    races = races || [];

    const sortedRaces = races.sort((a, b) =>
      a.subraces.length > 0
        ? b.subraces.length > 0
          ? a.subraces[0].name.localeCompare(b.subraces[0].name)
          : a.subraces[0].name.localeCompare(b.name)
        : b.subraces.length > 0
        ? a.name.localeCompare(b.subraces[0].name)
        : a.name.localeCompare(b.name)
    );

    return sortedRaces;
  }

  return (
    <div className="race position-relative">
      {!viewRace ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Race</h2>
          </div>
          <div className="icon-grid">
            {races &&
              sortRaces(races).map((race, idx) => {
                if (race && race.subraces.length > 0)
                  return (
                    <>
                      {race.subraces.map((subrace, idx) => (
                        <>
                          {subrace && (
                            <div className="icon-card-container" key={idx}>
                              <div className="card icon-card-label">
                                <div
                                  className="card icon-card"
                                  onClick={() =>
                                    selectRace({
                                      index: race.name,
                                      url: race.url,
                                      subrace: {
                                        index: subrace.name,
                                        url: subrace.url,
                                      },
                                    })
                                  }
                                >
                                  <img
                                    className="card-icon"
                                    src={raceIconsOffWhite[`${race.index}.png`]}
                                  />
                                </div>
                                <p>{subrace.name}</p>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                    </>
                    // <RaceButton
                    //   race={race}
                    //   setRace={subrace =>
                    //     subrace
                    //       ? selectRace({
                    //           index: race.name,
                    //           url: race.url,
                    //           subrace: {
                    //             index: subrace.name,
                    //             url: subrace.url,
                    //           },
                    //         })
                    //       : selectRace({
                    //           index: race.name,
                    //           url: race.url,
                    //         })
                    //   }
                    //   key={idx}
                    //   idx={idx}
                    // />
                  );
                else if (race)
                  return (
                    <div className="icon-card-container" key={idx}>
                      <div className="card icon-card-label">
                        <div
                          className="card icon-card"
                          onClick={() =>
                            selectRace({
                              index: race.name,
                              url: race.url,
                            })
                          }
                        >
                          <img
                            className="card-icon"
                            src={raceIconsOffWhite[`${race.index}.png`]}
                          />
                        </div>
                        <p>{race.name}</p>
                      </div>
                    </div>
                  );
              })}
          </div>
        </>
      ) : (
        <RaceDetails
          charID={charID}
          setPage={setPage}
          clearRace={() => setViewRace(false)}
          dispatch={dispatch}
          currRace={currentRace}
        />
      )}
    </div>
  );
};

const BasicInfoCard = ({ speed, size }) => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card mb-0">
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
    <div className="w-auto d-inline-block card content-card floating-card mb-0">
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
const RaceDetails = ({ charID, setPage, clearRace, dispatch, currRace }) => {
  const reducer = (state, newProp) => {
    let key = Object.keys(newProp)[0];
    if (key.includes('ability')) {
      let bonus = parseInt(key.charAt(1));
      for (let item of newProp[key]) {
        item.bonus = bonus;
      }
    }
    let newState = { ...state, ...newProp };
    dispatch(setRace(charID, { choices: newState }));
    return newState;
  };

  const [userChoices, setUserChoices] = useReducer(reducer, {});

  const [raceInfo, setRaceInfo] = useState(undefined);

  useEffect(() => {
    CharacterService.getRaceInfo(currRace)
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
        let allTraits = race.sub
          ? race.main.traits.concat(race.sub.racial_traits)
          : race.main.traits;
        let theDescription = {
          summary: [race.main.alignment, race.sub?.desc],
          age: race.main.age,
          size: race.main.size_description,
        };

        dispatch(
          setRace(charID, {
            ability_bonuses: abilityBonuses,
            proficiencies: race.proficiencies,
            traits: allTraits,
            subrace: race.sub?.name,
            description: theDescription,
            size: race.main.size,
            speed: race.main.speed,
          })
        );
      });
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
          {raceInfo.options.map((option, index) => {
            return (
              <div className="dd-container" key={index}>
                <div className="same-line mb-0">
                  <Dropdown
                    ddLabel={`${option.header}`}
                    title={`Choose ${option.choose}`}
                    items={option.options}
                    width="100%"
                    selectLimit={option.choose}
                    multiSelect={option.choose > 1}
                    selection={
                      userChoices[
                        `${option.header.toLowerCase().replace(' ', '-')}-${
                          option.type
                        }-${index}`
                      ]
                    }
                    setSelection={setUserChoices}
                    classname="dd-choice"
                    stateKey={`${option.header
                      .toLowerCase()
                      .replace(' ', '-')}-${option.type}-${index}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {raceInfo.profCount > 0 && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>Starting Proficiencies</h4>
          </div>
          <div className="card content-card description-card mb-0">
            {//console.log(Object.values(raceInfo.proficiencies))
            Object.keys(raceInfo.proficiencies).map(key => {
              return (
                raceInfo.proficiencies[key].length > 0 && (
                  <p className="text-capitalize">
                    <strong className="small-caps">{key}</strong> -{' '}
                    {raceInfo.proficiencies[key].map((prof, index) => {
                      if (raceInfo.proficiencies[key].length === index + 1)
                        return `${prof}`;
                      else return `${prof}, `;
                    })}
                  </p>
                )
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
          {raceInfo.main.traits.map((trait, idx, arr) => {
            return (
              <div
                className={`card content-card description-card ${idx ===
                  arr.length - 1 && 'mb-0'}`}
                key={trait.name}
              >
                <h5 className="card-subtitle small-caps">{trait.name}</h5>
                <p>
                  <ReactReadMoreReadLess
                    charLimit={250}
                    readMoreText="Show more"
                    readLessText="Show less"
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {trait.desc.join('\n')}
                  </ReactReadMoreReadLess>
                </p>
                {trait.table && (
                  <table>
                    <tr>
                      {trait.table.header.map(item => {
                        return <th key={item}>{item}</th>;
                      })}
                    </tr>
                    {trait.table.rows.map(row => {
                      return (
                        <tr key={row}>
                          {row.map(item => {
                            return <td key={item}>{item}</td>;
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
          {raceInfo.sub.racial_traits.map((trait, idx, arr) => {
            return (
              <div
                className={`card content-card description-card ${idx ===
                  arr.length - 1 && 'mb-0'}`}
                key={trait.name}
              >
                <h5 className="card-subtitle small-caps">{trait.name}</h5>
                <p>
                  <ReactReadMoreReadLess
                    charLimit={250}
                    readMoreText="Show more"
                    readLessText="Show less"
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {trait.desc.join('\n')}
                  </ReactReadMoreReadLess>
                </p>
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
