import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAbilities } from '../../redux/actions';
import CharacterService from '../../redux/services/character.service';

export const Abilities = ({ charID, setPage }) => {
  const dispatch = useDispatch();
  const [abilityCards, setAbilityCards] = useState(null);
  const [totalPointsUsed, setTotalPointsUsed] = useState(27);
  const [diceTotals, setDiceTotals] = useState(null);

  const charInfo = useSelector(state => state.characters[charID]);

  useEffect(() => {
    if (charInfo.race) {
      setAbilityCards(
        charInfo.race.ability_bonuses.map(ability => {
          return {
            name: ability.ability_score.full_name,
            points: 10,
            bonus: ability.bonus || 0,
            modifier: 0,
            finalScore: 10 + (ability.bonus || 0),
          };
        })
      );
      dispatch(setAbilities(charID, charInfo.race.ability_bonuses));
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
    }
    setTotalPointsUsed(tempTotal);
  }, [abilityCards]);

  const onNext = () => {
    // setSelectedAbilities({ index: race.name, url: race.url });
    setPage({ index: 3, name: 'background' });
    window.scrollTo(0, 0);
  };

  const onDiceRoll = () => {
    let allTotals = [];
    for (let i = 0; i < abilityCards.length; i++) {
      let total = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      total.sort().splice(0, 1);
      let temp = 0;
      total.map(t => (temp += t));
      allTotals.push(temp);
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
        <div className="container-fluid w-75 mx-auto">
          <DiceRoll onDiceRoll={onDiceRoll} diceTotals={diceTotals} />
          <div className="row">
            {abilityCards &&
              abilityCards.map((ability, idx) => {
                return (
                  <div className="col" key={idx}>
                    <PointBuyCard
                      title={ability.name}
                      points={ability.points}
                      bonus={ability.bonus}
                      finalScore={ability.finalScore}
                      modifier={ability.modifier}
                      abilityCards={abilityCards}
                      setAbilityCards={setAbilityCards}
                      totalPointsUsed={totalPointsUsed}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <PointsRemainingCard totalPointsUsed={totalPointsUsed} />
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
      <div className="w-auto d-inline-block card content-card floating-card">
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
          <button
            className="btn-primary btn-lg px-5 btn-floating"
            onClick={onDiceRoll}
          >
            Roll Scores
          </button>
        </div>
      </div>
      {diceTotals && (
        <div className="row">
          <div className="card translucent-card w-75">
            <div className="container-fluid">
              <div className="row row-cols-3">
                {diceTotals.map(total => {
                  return (
                    <div className="col px-1">
                      <div className="d-inline-block card content-card floating-card w-100 mx-0 px-0">
                        <h4>{total}</h4>
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
  points,
  bonus,
  finalScore,
  modifier,
  abilityCards,
  setAbilityCards,
  totalPointsUsed,
}) => {
  const [choices, setChoices] = useState(points);
  const onDecrease = () => {
    setAbilityCards(
      abilityCards.map(ability => {
        if (ability.name === title && ability.points > 8) {
          return {
            name: title,
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
          totalPointsUsed > 0 &&
          ability.points < 15
        ) {
          return {
            name: title,
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
        if (ability.name === title && totalPointsUsed > 0) {
          return {
            name: title,
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

  return (
    <div className="card point-card">
      <div className="card content-card card-title">
        <h4>{title}</h4>
      </div>
      <div>
        <h1 className="points-header">
          <button
            className="my-0 mx-3 shadow-none point-button"
            onClick={() => onDecrease()}
          >
            -
          </button>
          <select value={points} onChange={handleChange}>
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
              choice => (
                <option value={choice} key={choice}>
                  {choice}
                </option>
              )
            )}
          </select>
          <button
            className="my-0 mx-3 shadow-none point-button"
            onClick={() => onIncrease()}
          >
            +
          </button>
        </h1>
      </div>
      {bonus && (
        <div className="card content-card description-card text-center">
          <p className="text-capitalize">Racial Bonus: +{bonus}</p>
        </div>
      )}
      <div className="card content-card description-card text-center">
        <p className="text-capitalize">Final Score: </p>
        <h4 className="text-capitalize">
          {finalScore} {modifier >= 0 && '+'}
          {modifier}
        </h4>
      </div>
    </div>
  );
};

const PointsRemainingCard = ({ totalPointsUsed }) => {
  return (
    <div className="card translucent-card w-50">
      <div>
        <div className="card content-card card-title mx-0 px-0 w-75">
          <h4>Points Remaining</h4>
        </div>
        <div className="card content-card card-title mx-0 px-0 w-25">
          <h4>{totalPointsUsed}/27</h4>
        </div>
      </div>
      <div>
        <div className="w-50 d-inline-block card content-card floating-card float-start m-0 p-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col table">Score</div>
              <div className="vertical-divider"></div>
              <div className="col table">Cost</div>
            </div>
            <div className="row">
              <div className="col table">8</div>
              <div className="vertical-divider"></div>
              <div className="col table">0</div>
            </div>
            <div className="row">
              <div className="col table">9</div>
              <div className="vertical-divider"></div>
              <div className="col table">1</div>
            </div>
            <div className="row">
              <div className="col table">10</div>
              <div className="vertical-divider"></div>
              <div className="col table">2</div>
            </div>
            <div className="row">
              <div className="col table">11</div>
              <div className="vertical-divider"></div>
              <div className="col table">3</div>
            </div>
          </div>
        </div>
        <div className="w-50 d-inline-block card content-card floating-card float-end m-0 p-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col table">Score</div>
              <div className="vertical-divider"></div>
              <div className="col table">Cost</div>
            </div>
            <div className="row">
              <div className="col table">12</div>
              <div className="vertical-divider"></div>
              <div className="col table">4</div>
            </div>
            <div className="row">
              <div className="col table">13</div>
              <div className="vertical-divider"></div>
              <div className="col table">5</div>
            </div>
            <div className="row">
              <div className="col table">14</div>
              <div className="vertical-divider"></div>
              <div className="col table">7</div>
            </div>
            <div className="row">
              <div className="col table">15</div>
              <div className="vertical-divider"></div>
              <div className="col table">9</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abilities;
