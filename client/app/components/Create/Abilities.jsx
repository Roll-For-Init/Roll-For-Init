import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAbilities } from '../../redux/actions';
// import CharacterService from '../../redux/services/character.service';
import { Popover, ArrowContainer } from 'react-tiny-popover';

export const Abilities = ({ charID, setPage }) => {
  const dispatch = useDispatch();
  const [abilityCards, setAbilityCards] = useState(null);
  const [pointsRemaining, setPointsRemaining] = useState(27);
  const [diceTotals, setDiceTotals] = useState(null);
  /**
   *  str dex con int wis cha
   */

  const charInfo = useSelector(state => state.characters[charID]);
  useEffect(() => {
    if (charInfo.race) {
      let temp = [
        {
          name: 'Strength',
          short_name: 'str',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
        {
          name: 'Dexterity',
          short_name: 'dex',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
        {
          name: 'Constitution',
          short_name: 'con',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
        {
          name: 'Intelligence',
          short_name: 'int',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
        {
          name: 'Wisdom',
          short_name: 'wis',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
        {
          name: 'Charisma',
          short_name: 'cha',
          points: 10,
          bonus: 0,
          modifier: 0,
          finalScore: 10,
        },
      ].map(item => {
        const ability = charInfo.race.ability_bonuses.find(
          abil => abil.ability_score.index === item.short_name
        );
        let ability2 = null;
        for (let key in charInfo.race.choices) {
          //assumes u can only choose an ability score ONCE
          if (key.includes('ability')) {
            //assumes u can only modify an ability ONCE
            ability2 = charInfo.race.choices[key].find(
              abil => abil.index === item.short_name
            );
          }
        }
        if (ability || ability2) {
          return {
            name: ability
              ? ability.ability_score.full_name
              : ability2.full_name,
            short_name: ability ? ability.ability_score.index : ability2.index,
            points: 10,
            bonus: ability
              ? ability.bonus + (ability2 ? ability2.bonus : 0)
              : ability2.bonus,
            modifier: 0,
            finalScore: ability
              ? 10 + ability.bonus + (ability2 ? ability2.bonus : 0)
              : 10 + ability2.bonus,
          };
        } else {
          return item;
        }
      });
      setAbilityCards(temp);
    }
  }, [charInfo.race]);

  useEffect(() => {
    let tempTotal = 27;
    if (abilityCards) {
      abilityCards.map(ability => {
        if (ability.points === 9) {
          tempTotal--;
        } else if (ability.points === 10) {
          tempTotal -= 2;
        } else if (ability.points === 11) {
          tempTotal -= 3;
        } else if (ability.points === 12) {
          tempTotal -= 4;
        } else if (ability.points >= 13) {
          tempTotal -= 5;
          for (let i = 14; i <= ability.points; i++) {
            tempTotal -= 2;
          }
        }
      });
      if (
        abilityCards.some(ab => {
          return ab.points < 8 || ab.points > 15;
        })
      ) {
        tempTotal = Infinity;
      }
    }
    setPointsRemaining(tempTotal);
  }, [abilityCards]);

  const onNext = () => {
    // setSelectedAbilities({ index: race.name, url: race.url });
    console.log('ONNEXT', abilityCards);
    dispatch(setAbilities(charID, abilityCards));
    console.log("ABILITIES", abilityCards);
    setPage({ index: 3, name: 'background' });
    window.scrollTo(0, 0);
  };

  const onDiceRoll = () => {
    let allTotals = [];
    for (let i = 0; i < abilityCards.length; i++) {
      let dice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      var total = 0;
      dice.map(t => (total += t));
      let min = Math.min(...dice);
      total -= min;
      allTotals.push({
        dice: dice,
        total: total,
        droppedIndex: dice.indexOf(min),
      });
    }
    setDiceTotals(allTotals);
  };

  return (
    <div className="abilities position-relative">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Abilities</h2>
      </div>
      <div className="mt-4">
        <BasicInfoCard
          content={[
            'Abilities can be generated in two ways: ',
            'Point Buy: Use points to generate your scores. Raw scores can range from 8 to 15 (before racial bonuses), and the cost of each score is shown in the table below. A standard array using this method would be 8-10-12-13-14-15, but you can spend points however you like.\n',
            'Rolled: Click the button below to generate a set of 6 scores using the rolled method and assign those scores to your abilities. Alternatively, roll dice yourself according to your abilities. Alternatively, roll dice yourself according to the following rules and input the scores yourself. Roll 4d6 and add the highest 3 numbers to generate each score. Do this 6 times and assign the values to your abilites.',
          ]}
        />
        <div className="container-fluid mx-auto">
          <DiceRoll onDiceRoll={onDiceRoll} diceTotals={diceTotals} />
          <div className="row">
            {abilityCards &&
              abilityCards.map((ability, idx) => {
                return (
                  <div className="col" key={idx}>
                    <PointBuyCard
                      title={ability.name}
                      short_name={ability.short_name}
                      points={ability.points}
                      bonus={ability.bonus}
                      finalScore={ability.finalScore}
                      modifier={ability.modifier}
                      abilityCards={abilityCards}
                      setAbilityCards={setAbilityCards}
                      pointsRemaining={pointsRemaining}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <PointsRemainingCard pointsRemaining={pointsRemaining} />
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
    </div>
  );
};

const BasicInfoCard = ({ content }) => {
  return (
    <div className="card translucent-card">
      <div className="w-auto d-inline-block card content-card description-card mt-0 mb-0">
        {content.map((cont, idx) => (
          <p key={idx} className="m-0 text-left">
            {cont}
          </p>
        ))}
      </div>
    </div>
  );
};

const DiceRoll = ({ onDiceRoll, diceTotals }) => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <button className="btn-primary btn-lg mt-0 px-5" onClick={onDiceRoll}>
            Roll Scores
          </button>
        </div>
      </div>
      {diceTotals && (
        <div className="row">
          <div className="card translucent-card dice-roll-card">
            <div className="container-fluid">
              <div className="row row-cols-3">
                {diceTotals.map((dice, idx) => {
                  return (
                    <div className="col px-1" key={idx}>
                      <div className="d-inline-block card content-card floating-card indie-dice-card w-100 mx-0 px-0">
                        <div className="dice">
                          {dice.dice.map((d, idx) => {
                            return (
                              <div
                                // className={
                                //   idx === dice.droppedIndex ? 'dropped' : ''
                                // }
                                key={idx}
                              >
                                {/* {d} */}
                                <i
                                  className={`${
                                    idx === dice.droppedIndex ? 'dropped' : ''
                                  } df-solid-small-dot-d6-${d}`}
                                ></i>
                              </div>
                            );
                          })}
                        </div>
                        <h4> = {dice.total}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PointBuyCard = ({
  title,
  short_name,
  points,
  bonus,
  finalScore,
  modifier,
  abilityCards,
  setAbilityCards,
  pointsRemaining,
}) => {
  const [choices, setChoices] = useState(points);
  const onDecrease = () => {
    setAbilityCards(
      abilityCards.map(ability => {
        if (ability.name === title && ability.points > 3) {
          return {
            name: title,
            short_name,
            points: points - 1,
            bonus,
            modifier: Math.floor((ability.points - 11) / 2),
            finalScore: finalScore - 1,
          };
        } else {
          return ability;
        }
      })
    );
  };

  const onIncrease = () => {
    setAbilityCards(
      abilityCards.map(ability => {
        if (
          ability.name === title &&
          // totalPointsUsed > 0 &&
          ability.points < 20
        ) {
          return {
            name: title,
            short_name,
            points: points + 1,
            bonus,
            modifier: Math.floor((ability.points - 9) / 2),
            finalScore: finalScore + 1,
          };
        } else {
          return ability;
        }
      })
    );
  };

  useEffect(() => {
    setAbilityCards(
      abilityCards.map(ability => {
        if (ability.name === title && pointsRemaining > 0) {
          return {
            name: title,
            short_name,
            points: choices,
            bonus,
            modifier: Math.floor((choices - 10) / 2),
            finalScore: choices + bonus,
          };
        } else {
          return ability;
        }
      })
    );
  }, [choices]);

  const handleChange = event => {
    setChoices(parseInt(event.target.value));
  };

  const [isAbilityPopoverOpen, setAbilityPopoverOpen] = useState(false);

  const abilitiesToSkills = {
    strength: ['athletics'],
    dexterity: ['acrobatics', 'sleight of hand', 'stealth'],
    intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
    wisdom: [
      'animal handling',
      'insight',
      'medicine',
      'perception',
      'survival',
    ],
    charisma: ['deception', 'intimidation', 'performance', 'persuasion'],
  };

  const abilitiesToSkills2 = {
    strength: 'Athletics',
    dexterity: 'Acrobatics, Sleight of Hand, and Stealth',
    intelligence: 'Arcana, History, Investigation, Nature, and Religion',
    wisdom: 'Animal Handling, Insight, Medicine, Perception, and Survival',
    charisma: 'Deception, Intimidation, Performance, and Persuasion',
  };

  //const getSkillsFromAbility = ability => abilitiesToSkills[ability].join(', ');
  const getSkillSFromAbility = ability => abilitiesToSkills2[ability];

  return (
    <div className="card point-card">
      <div className="card content-card card-title">
        <div className="same-line">
          <Popover
            isOpen={isAbilityPopoverOpen}
            positions={['left', 'top', 'bottom']}
            padding={15}
            //containerParent=?
            boundaryInset={10}
            onClickOutside={() => setAbilityPopoverOpen(false)}
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
                    {title.toString().toLowerCase() === 'constitution'
                      ? `Your ${title} measures your endurance and is used to help keep you live.`
                      : `Your ${title} determines your skill level at ${getSkillSFromAbility(
                          title.toString().toLowerCase()
                        )}. `}
                    {title.toString().toLowerCase() === 'strength' &&
                      'Strength, along with Dexterity, is used for weapon attacks.'}
                    {title.toString().toLowerCase() === 'dexterity' &&
                      'Dexterity, along with Strength, is used for weapon attacks.'}
                  </p>
                </div>
              </ArrowContainer>
            )}
          >
            <i
              className="bi bi-info-circle info-icon ml-0"
              onClick={() => setAbilityPopoverOpen(!isAbilityPopoverOpen)}
            ></i>
          </Popover>
          <h4>{title}</h4>
        </div>
      </div>
      <div>
        <h1 className="points-header">
          <button
            className="btn btn-secondary point-button"
            onClick={() => onDecrease()}
          >
            -
          </button>
          {points}
          {/* <select value={points} onChange={handleChange} className="btn-secondary">
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
              choice => (
                <option value={choice} key={choice}>
                  {choice}
                </option>
              )
            )}
          </select> */}
          <button
            className="btn btn-secondary point-button"
            onClick={() => onIncrease()}
          >
            +
          </button>
        </h1>
      </div>
      {bonus > 0 && (
        <div className="p-1 card content-card description-card text-center">
          <p className="text-capitalize">Racial Bonus: +{bonus}</p>
        </div>
      )}
      <div className="card content-card description-card fancy-card text-center mb-0">
        <p className="text-capitalize">Final Score: </p>
        <h4 className="mb-0 text-capitalize">
          {finalScore} ({modifier >= 0 && '+'}
          {modifier})
        </h4>
      </div>
    </div>
  );
};

const PointsRemainingCard = ({ pointsRemaining }) => {
  return (
    <div className="card translucent-card w-fit-content">
      {pointsRemaining === Infinity ? (
        <div className="d-flex">
          <div className="card content-card warning-card">
            <i className="bi bi-exclamation-triangle-fill text-warning icon"></i>
            <h4 className="text">
              You have scores above 15 or below 8, which is not allowed using
              point buy.
            </h4>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <div className="card content-card card-title mr-3">
              <h4>Points Remaining</h4>
            </div>
            <div className="card content-card card-title points-remaining-card mb-2">
              {pointsRemaining < 0 && (
                <i className="bi bi-exclamation-triangle-fill text-warning icon"></i>
              )}
              <h4>{pointsRemaining}/27</h4>
            </div>
          </div>
          <div className="table">
            <div className="card content-card m-0 mr-3 p-0">
              <div className="container-fluid py-1">
                <div className="row">
                  <div className="col table-data">Score</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">Cost</div>
                </div>
                <div className="row">
                  <div className="col table-data">8</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">0</div>
                </div>
                <div className="row">
                  <div className="col table-data">9</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">1</div>
                </div>
                <div className="row">
                  <div className="col table-data">10</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">2</div>
                </div>
                <div className="row">
                  <div className="col table-data">11</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">3</div>
                </div>
              </div>
            </div>
            <div className="card content-card m-0 p-0">
              <div className="container-fluid py-1">
                <div className="row">
                  <div className="col table-data">Score</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">Cost</div>
                </div>
                <div className="row">
                  <div className="col table-data">12</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">4</div>
                </div>
                <div className="row">
                  <div className="col table-data">13</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">5</div>
                </div>
                <div className="row">
                  <div className="col table-data">14</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">7</div>
                </div>
                <div className="row">
                  <div className="col table-data">15</div>
                  <div className="vertical-divider"></div>
                  <div className="col table-data">9</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abilities;
