import React, { useState, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../shared/Dropdown';
import { setRace, setPage } from '../../redux/actions';
import CharacterService from '../../redux/services/character.service';
import { PropTypes } from 'prop-types';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { Popover, ArrowContainer } from 'react-tiny-popover';

const Loading = () => {
  return 'LOADING';
};

const Race = ({ charID }) => {
  const dispatch = useDispatch();
  const [races, setRaces] = useState(null);
  const [viewRace, setViewRace] = useState(false);
  const [currentRace, setCurrentRace] = useState(null);

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    if (character?.race?.index) {
      setViewRace(true);
    }
    CharacterService.getIndexedList('races').then(list => setRaces(list));
  }, []);

  //pass in an object of the fields to edit i.e. {index: INDEX} or {choiceA: CHOICE}
  //access with character.race.choiceA
  const selectRace = race => {
    setCurrentRace(race);
    if (race.subrace) {
      let racewsubrace = { ...race, ...{ subrace: race.subrace.index } };
      dispatch(setRace(charID, racewsubrace));
    } else {
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
                              <div
                                className="card icon-card-label"
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
                                <div className="card icon-card">
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
                  );
                else if (race)
                  return (
                    <div className="icon-card-container" key={idx}>
                      <div
                        className="card icon-card-label"
                        onClick={() =>
                          selectRace({
                            index: race.name,
                            url: race.url,
                          })
                        }
                      >
                        <div className="card icon-card">
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
          clearRace={() => setViewRace(false)}
          dispatch={dispatch}
          currRace={currentRace}
        />
      )}
    </div>
  );
};

const BasicInfoCard = ({ speed, size }) => {
  const [isSpeedPopoverOpen, setSpeedPopoverOpen] = useState(false);
  const [isSizePopoverOpen, setSizePopoverOpen] = useState(false);

  return (
    <div className="w-auto d-inline-block card content-card floating-card mb-0">
      <div className="same-line">
        <span>Speed: {speed}</span>
        <Popover
          isOpen={isSpeedPopoverOpen}
          positions={['right', 'top', 'bottom']}
          padding={15}
          //containerParent=?
          boundaryInset={10}
          onClickOutside={() => setSpeedPopoverOpen(false)}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={'#f6efe4'}
              arrowSize={10}
              className="popover-arrow-container"
              arrowClassName="popover-arrow"
            >
              <div
                className="card content-card description-card popover-card"
                style={{ maxWidth: '250px' }}
                //onClick={() => setIsPopoverOpen(!isSpeedPopoverOpen)}
              >
                <p>How far you can move in one round of combat, in feet.</p>
              </div>
            </ArrowContainer>
          )}
        >
          <i
            className="bi bi-info-circle info-icon mr-0"
            onClick={() => setSpeedPopoverOpen(!isSpeedPopoverOpen)}
          ></i>
        </Popover>
      </div>
      <div className="same-line mb-0">
        <span>Size: {size}</span>
        {console.log(size)}
        {size.toLowerCase() === 'small' && (
          <Popover
            isOpen={isSizePopoverOpen}
            positions={['right', 'top', 'bottom']}
            padding={15}
            //containerParent=?
            boundaryInset={10}
            onClickOutside={() => setSizePopoverOpen(false)}
            content={({ position, childRect, popoverRect }) => (
              <ArrowContainer
                position={position}
                childRect={childRect}
                popoverRect={popoverRect}
                arrowColor={'#f6efe4'}
                arrowSize={10}
                className="popover-arrow-container"
                arrowClassName="popover-arrow"
              >
                <div
                  className="card content-card description-card popover-card"
                  style={{ maxWidth: '250px' }}
                  //onClick={() => setIsPopoverOpen(!isSizePopoverOpen)}
                >
                  <p>
                    Your carrying capacity is halved, and you have disadvantage
                    with heavy weapons.
                  </p>
                </div>
              </ArrowContainer>
            )}
          >
            <i
              className="bi bi-info-circle info-icon mr-0"
              onClick={() => setSizePopoverOpen(!isSizePopoverOpen)}
            ></i>
          </Popover>
        )}
      </div>
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
const RaceDetails = ({ charID, clearRace, dispatch, currRace }) => {
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
    dispatch(setPage(charID, { index: 1, name: 'class' }));
    window.scrollTo(0, 0);
  };

  const [isProfPopoverOpen, setProfPopoverOpen] = useState(false);
  const [isLanguagePopoverOpen, setLanguagePopoverOpen] = useState(false);

  const skill = ['animal handling', 'acrobatics'];

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
              <>
                <div className="dd-container" key={index}>
                  <Dropdown
                    ddLabel={`${option.header}`}
                    title={`Choose ${option.choose}`}
                    items={option.options.filter(
                      item =>
                        !skill.includes(item.name.toString().toLowerCase())
                    )}
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
                    popover={Array.isArray(option.desc)}
                    popoverText={option.desc?.map(desc => (
                      <p key={desc}>{desc}</p>
                    ))}
                    classname="dd-choice"
                    stateKey={`${option.header
                      .toLowerCase()
                      .replace(' ', '-')}-${option.type}-${index}`}
                  />
                </div>
                {Array.isArray(option.desc) &&
                  userChoices[
                    `${option.header.toLowerCase().replace(' ', '-')}-${
                      option.type
                    }-${index}`
                  ] && (
                    <div className="card content-card description-card mb-0">
                      {userChoices[
                        `${option.header.toLowerCase().replace(' ', '-')}-${
                          option.type
                        }-${index}`
                      ].map(
                        choice =>
                          Array.isArray(choice.desc) && <p>{choice.desc}</p>
                      )}
                    </div>
                  )}
              </>
            );
          })}
        </div>
      )}
      {raceInfo.profCount > 0 && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <div className="same-line mb-0">
              <Popover
                isOpen={isProfPopoverOpen}
                positions={['left', 'top', 'bottom']}
                padding={15}
                //containerParent=?
                boundaryInset={10}
                onClickOutside={() => setProfPopoverOpen(false)}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor={'#f6efe4'}
                    arrowSize={10}
                    className="popover-arrow-container"
                    arrowClassName="popover-arrow"
                  >
                    <div
                      className="card content-card description-card popover-card"
                      style={{ maxWidth: '250px' }}
                      //onClick={() => setIsPopoverOpen(!isSpeedPopoverOpen)}
                    >
                      <p>
                        You can add your proficiency bonus, which increases with
                        every level, to a roll you have proficiency in. You are
                        far more likely to succeed in the areas listed below
                      </p>
                    </div>
                  </ArrowContainer>
                )}
              >
                <i
                  className="bi bi-info-circle info-icon ml-0"
                  onClick={() => setProfPopoverOpen(!isProfPopoverOpen)}
                ></i>
              </Popover>
              <h4>Starting Proficiencies</h4>
            </div>
          </div>
          <div className="card content-card description-card mb-0">
            {//console.log(Object.values(raceInfo.proficiencies))
            Object.keys(raceInfo.proficiencies).map(key => {
              return (
                raceInfo.proficiencies[key].length > 0 && (
                  <div className="same-line mb-0">
                    {key.toString().toLowerCase() === 'languages' && (
                      <Popover
                        isOpen={isLanguagePopoverOpen}
                        positions={['left', 'top', 'bottom']}
                        padding={15}
                        //containerParent=?
                        boundaryInset={10}
                        onClickOutside={() => setLanguagePopoverOpen(false)}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={'#f6efe4'}
                            arrowSize={10}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              className="card content-card description-card popover-card"
                              style={{ maxWidth: '250px' }}
                              //onClick={() => setIsPopoverOpen(!isSpeedPopoverOpen)}
                            >
                              <p>
                                Languages do not have to be rolled for; a
                                proficiency means that you can read, write, and
                                speak these languages.
                              </p>
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <i
                          className="bi bi-info-circle info-icon ml-0"
                          onClick={() =>
                            setLanguagePopoverOpen(!isLanguagePopoverOpen)
                          }
                        ></i>
                      </Popover>
                    )}
                    <p className="text-capitalize" style={{ width: '100%' }}>
                      <strong className="small-caps">{key}</strong> -{' '}
                      {raceInfo.proficiencies[key].map((prof, index) => {
                        if (raceInfo.proficiencies[key].length === index + 1)
                          return `${prof}`;
                        else return `${prof}, `;
                      })}
                    </p>
                  </div>
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
