import React, { useState, useEffect } from 'react';
import Dropdown from '../shared/Dropdown';

export const Abilities = () => {
  const [selection1, setSelection1] = useState([
    { index: 'Standard Array', name: 'Standard Array' },
  ]);

  const onNext = () => {
    setPage({ index: 3, name: 'background' });
    window.scrollTo(0, 0);
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
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <button className="btn-primary btn-lg px-5 btn-floating">
                  Roll Scores
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <PointBuyCard
                  title="Strength"
                  points={10}
                  bonus={1}
                  finalScore={11}
                  modifier={0}
                />
              </div>
              <div className="col">
                <PointBuyCard
                  title="Dexterity"
                  points={10}
                  finalScore={10}
                  modifier={0}
                />
              </div>
              <div className="col">
                <PointBuyCard
                  title="Constitution"
                  points={10}
                  finalScore={10}
                  modifier={0}
                />
              </div>
            </div>
          </div>
        </div>
        <PointsRemainingCard />
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

const BasicInfoCard = ({ title, content }) => {
  return (
    <div className="card translucent-card">
      {title && (
        <div className="card content-card card-title">
          <h4>{title}</h4>
        </div>
      )}
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

const PointBuyCard = ({ title, points, bonus, finalScore, modifier }) => {
  return (
    <div className="card point-card">
      <div className="card content-card card-title">
        <h4>{title}</h4>
      </div>
      <div>
        <h1>
          <button className="my-0 mx-3">-</button>
          {points}
          <button className="my-0 mx-3">+</button>
        </h1>
      </div>
      <div className="card content-card description-card">
        {bonus && <p className="text-capitalize">Racial Bonus: +{bonus}</p>}
        <p className="text-capitalize">Final Score: {finalScore}</p>
        <p className="text-capitalize">Ability Modifier: {modifier}</p>
      </div>
    </div>
  );
};

const PointsRemainingCard = ({
  title,
  points,
  bonus,
  finalScore,
  modifier,
}) => {
  return (
    <div className="card translucent-card">
      <div>
        <div className="card content-card card-title mx-1 w-50">
          <h4>Points Remaining</h4>
        </div>
        <div className="card content-card card-title mx-1 w-25">
          <h4>15/27</h4>
        </div>
      </div>
      <div className="w-75 mx-auto d-inline-block card content-card floating-card"></div>
    </div>
  );
};

export default Abilities;
