import React, { useState, useEffect } from 'react';
import Dropdown from '../shared/Dropdown';

const SelectPage = ({ page }) => {
  switch (page.index) {
    case 'Standard Array':
      return <StandardArray />;
    case 'Point Buy':
      return <PointBuy />;
    case 'Roll Dice':
      return <RollDice />;
    case 'Custom':
      return <Custom />;
    default:
      return <StandardArray />;
  }
};

export const Abilities = () => {
  const [selection1, setSelection1] = useState([
    { index: 'Standard Array', name: 'Standard Array' },
  ]);

  return (
    <div className="abilities position-relative">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Abilities</h2>
      </div>
      <div>
        <Dropdown
          title="Standard Array"
          items={[
            { index: 'Standard Array', name: 'Standard Array' },
            { index: 'Point Buy', name: 'Point Buy' },
            { index: 'Roll Dice', name: 'Roll Dice' },
            { index: 'Custom', name: 'Custom' },
          ]}
          width="100%"
          classname="abilities-dropdown"
          selection={selection1}
          setSelection={setSelection1}
        />
      </div>
      <div className="mt-4">
        <SelectPage page={selection1[0]} />
      </div>
    </div>
  );
};

const BasicInfoCard = () => {
  return (
    <div className="w-auto d-inline-block card content-card floating-card">
      Drag and drop the scores to assign them to your abilities. Based on your
      class (something here), we recommend putting your highest score in
      Charisma(CHA), then Dexterity (DEX) and Constitution (CON).
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

const StandardArrayCard = ({ title, points, bonus, finalScore, modifier }) => {
  return (
    <div className="card point-card">
      <div className="card content-card card-title">
        <h4>{title}</h4>
      </div>
      <div>
        <h1>{points}</h1>
      </div>
      <div className="card content-card description-card">
        {bonus && <p className="text-capitalize">Racial Bonus: +{bonus}</p>}
        <p className="text-capitalize">Final Score: {finalScore}</p>
        <p className="text-capitalize">Ability Modifier: {modifier}</p>
      </div>
    </div>
  );
};

const PointBuy = () => {
  return (
    <div>
      <div className="container-fluid">
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
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card content-card card-title">
                <h4>Points Remaining: 0 out of 27</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card point-card">
              <div className="card content-card description-card">
                <p>
                  Use the up and down arrows to adjust your ability scores.
                  Scores can range from 8 to 15, and the cost of each value is
                  listed in the table below.
                </p>
                <p>
                  Based on your class (something here), we recommend putting
                  your highest score in Charisma(CHA), then Dexterity (DEX) and
                  Constitution (CON).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StandardArray = () => {
  return (
    <div>
      <div>
        <BasicInfoCard />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <StandardArrayCard
              title="Strength"
              points={10}
              bonus={1}
              finalScore={11}
              modifier={0}
            />
          </div>
          <div className="col">
            <StandardArrayCard
              title="Dexterity"
              points={10}
              finalScore={10}
              modifier={0}
            />
          </div>
          <div className="col">
            <StandardArrayCard
              title="Constitution"
              points={10}
              finalScore={10}
              modifier={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RollDice = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">DICE</div>
      </div>
    </div>
  );
};

const Custom = () => {
  return <div>Customize this page!</div>;
};

export default Abilities;
