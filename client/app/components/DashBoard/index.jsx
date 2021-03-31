import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../shared/Header';

import './styles.scss';

const TEMP_DATA = {
  name: 'Liir Thropp',
  level: 2,
  experience: {
    current: 647,
    threshhold: 960,
  },
  race: {
    name: 'Rogue',
    description: 'BLAH BLAH BLAH',
  },
  class: [
    {
      name: 'Halfling',
      levels: 2,
    },
  ],
  misc_proficiencies: {
    armor: [{ name: 'Light Armor' }],
    weapons: [
      { name: 'Crossbows' },
      { name: 'Hand' },
      { name: 'Longswords' },
      { name: 'Rapiers' },
      { name: 'Shortswords' },
      { name: 'Simple Weapons' },
    ],
    tools: [{ name: "Thieve's Tools" }],
    languages: [{ name: 'Common' }, { name: 'Halfling' }],
  },
  ability_scores: {
    str: {
      score: 9,
      modifier: 2,
      advantage: -1,
    },
    dex: {
      score: 16,
      modifier: 4,
      advantage: 3,
    },
    con: {
      score: 1,
      modifier: 1,
      advantage: 1,
    },
    int: {
      score: 5,
      modifier: -1,
      advantage: -3,
    },
    wis: {
      score: 11,
      modifier: 3,
      advantage: 0,
    },
    cha: {
      score: 14,
      modifier: 3,
      advantage: 2,
    },
  },
  saving_throws: {
    Strength: {
      proficiency: 0,
      modifier: 0,
      advantage: -1,
    },
    Dexterity: {
      proficiency: 1,
      modifier: 0,
      advantage: 5,
    },
    Constitution: {
      proficiency: 1,
      modifier: 0,
      advantage: 1,
    },
    Intelligence: {
      proficiency: 1,
      modifier: 0,
      advantage: -1,
    },
    Wisdom: {
      proficiency: 1,
      modifier: 0,
      advantage: 0,
    },
    Charisma: {
      proficiency: 1,
      modifier: 0,
      advantage: 2,
    },
  },
  skills: {
    // should these skills have an associated ability, or are we getting that from the api?
    acrobatics: {
      proficiency: false,
      modifier: 0,
      advantage: 5,
    },
    animal_handling: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    arcana: {
      proficiency: false,
      modifier: 0,
      advantage: -3,
    },
    athletics: {
      proficiency: false,
      modifier: 0,
      advantage: -1,
    },
    deception: {
      proficiency: true,
      modifier: 0,
      advantage: 4,
    },
    history: {
      proficiency: false,
      modifier: 0,
      advantage: -3,
    },
    insight: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    intimidation: {
      proficiency: false,
      modifier: 0,
      advantage: 4,
    },
    investigation: {
      proficiency: true,
      modifier: 0,
      advantage: -3,
    },
    medicine: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    nature: {
      proficiency: false,
      modifier: 0,
      advantage: -3,
    },
    perception: {
      proficiency: false,
      modifier: 0,
      advantage: 2,
    },
    performance: {
      proficiency: true,
      modifier: 0,
      advantage: 2,
    },
    persuasion: {
      proficiency: false,
      modifier: 0,
      advantage: -4,
    },
    religion: {
      proficiency: false,
      modifier: 0,
      advantage: 3,
    },
    sleight_of_hand: {
      proficiency: false,
      modifier: 0,
      advantage: 5,
    },
    stealth: {
      proficiency: false,
      modifier: 0,
      advantage: 5,
    },
    survival: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
  },
};

export const DashBoard = () => {
  const {
    name,
    level,
    experience,
    race,
    misc_proficiencies,
    ability_scores,
    saving_throws,
    skills,
  } = TEMP_DATA;
  const user = useSelector(state => state.user);
  console.log(user);

  const character = useSelector(state => state.characters);
  console.log(character);

  return (
    <div className="dashboard">
      <div className="toolbar">
        <div className="header">
          <header className="navbar">
            <nav>
              <Link to="/">
                <img
                  src={require('/client/public/assets/imgs/navbar-logo.png')}
                  alt="Roll for Init"
                />
              </Link>
            </nav>
          </header>
        </div>
        <div className="subheader">
          <h2 className="small-caps">Liir Thropp</h2>
          <h5 className="text-uppercase">Rogue</h5>
          <h5 className="text-uppercase">Halfling</h5>
          <h5 className="text-uppercase">Level 2</h5>
        </div>
      </div>
      {/* <div>
        {Object.keys(character).map(key => {
          return (
            <p>
              {character[key].race?.index + ' ' + character[key].class?.index}
            </p>
          );
        })} */}
      <div className="container-fluid px-5">
        <div className="row">
          <div className="w-100">
            <div className="float-start w-auto d-inline-block">
              <button className="text-uppercase m-0 mx-2 py-0">
                Inventory
              </button>
              <button className="text-uppercase m-0 mx-2 py-0">
                Spellbook
              </button>
              <button className="text-uppercase m-0 mx-2 py-0">
                Description
              </button>
              <button className="text-uppercase m-0 mx-2 py-0">Features</button>
            </div>
            <div className="float-right w-auto d-inline-block">
              <button className="text-uppercase m-0 mx-2 py-0">
                Short Rest
              </button>
              <button className="text-uppercase m-0 mx-2 py-0">
                Long Rest
              </button>
            </div>
          </div>
        </div>
        {/* first column */}
        <div className="row">
          <div className="col-auto px-0">
            <div className="container-fluid px-0">
              <div className="row">
                <div className="col-auto px-4">
                  <AbilitiesCard ability_scores={ability_scores} />
                </div>
              </div>
              <div className="row">
                <div className="col-auto">
                  <SavingThrowsCard saving_throws={saving_throws} />
                </div>
              </div>
              <div className="row">
                <div className="col-auto">
                  <ProficienciesCard misc_proficiencies={misc_proficiencies} />
                </div>
              </div>
            </div>
          </div>
          {/* second column */}
          <div className="col-auto px-0">
            <div className="container-fluid px-0">
              <div className="row">
                <div className="col-auto">
                  <SkillsCard skills={skills} />
                </div>
              </div>
              <div className="row">
                <div className="col-auto">
                  <SensesCard />
                </div>
              </div>
            </div>
          </div>
          {/* third column */}
          <div className="col-auto px-0">
            <div className="container-fluid px-0">
              <div className="row">
                <div className="col-auto">
                  <StatsCard />
                </div>
              </div>
              <div className="row">
                <div className="col-auto">
                  <HitPointsCard />
                </div>
              </div>
            </div>
          </div>
          {/* fourth column */}
          <div className="col-auto px-0">
            <ExtraStatsCard />
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

const AbilitiesCard = ({ ability_scores }) => {
  console.log(ability_scores);

  return (
    <div className="card translucent-card px-0 mx-0">
      <h5 className="card-title">Abilities</h5>
      <div className="container-fluid p-0">
        <div className="row ml-3">
          {Object.entries(ability_scores).map(ability => {
            return (
              <div
                className="col-3 p-0 m-2 card content-card description-card"
                key={ability[0]}
              >
                <div>
                  <h6 className="text-uppercase text-center mt-2 mb-0">
                    {ability[0]}
                  </h6>
                  <h2 className="text-center">
                    {ability[1].advantage >= 0 && '+'}
                    {ability[1].advantage}
                  </h2>
                </div>
                <div
                  className="card content-card description-card"
                  key={ability[0]}
                >
                  {ability[1].score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SavingThrowsCard = ({ saving_throws }) => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Saving Throws</h5>
      <div className="card content-card description-card">
        {Object.entries(saving_throws).map(saving_throw => {
          return (
            <div key={saving_throw[0]}>
              <input
                type="radio"
                checked={saving_throw[1].proficiency > 0}
                readOnly
              />
              <label>
                <div className="list-item skills-points">
                  {saving_throw[1].advantage >= 0 && '+'}
                  {saving_throw[1].advantage}{' '}
                </div>
                <div className="list-item">{saving_throw[0]}</div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsCard = ({ skills }) => {
  return (
    <div>
      <h4 className="translucent-card proficiency-title text-uppercase">
        Proficiency bonus: +2
      </h4>
      <div className="card translucent-card">
        <h5 className="card-title">Skills</h5>
        <div className="card content-card description-card">
          {Object.entries(skills).map(skill => {
            return (
              <div key={skill[0]}>
                <input type="radio" checked={skill[1].proficiency} readOnly />
                <label>
                  <div className="list-item skills-points">
                    {skill[1].advantage >= 0 && '+'}
                    {skill[1].advantage}{' '}
                  </div>
                  <div className="list-item text-capitalize skills-name">
                    {skill[0]}
                  </div>
                  <div className="list-item">WIS</div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProficienciesCard = ({ misc_proficiencies }) => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Proficiencies</h5>
      <div className="card content-card description-card">
        {Object.entries(misc_proficiencies).map(misc_proficiency => {
          return (
            <div key={misc_proficiency[0]}>
              <div className="small-caps w-auto list-item">
                {misc_proficiency[0]}
              </div>
              —{' '}
              {misc_proficiency[1].map((items, idx) => (
                <div key={idx} className="list-item px-1">
                  {items.name}
                  {idx < misc_proficiency[1].length - 1 && ', '}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SensesCard = () => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Senses</h5>
      <div className="card content-card description-card">
        <div>Passive Perception (WIS): 12</div>
        <div>Passive Insight (WIS): 10</div>
        <div>Passive Investigation (INT): 7</div>
      </div>
    </div>
  );
};

const StatsCard = () => {
  return (
    <div className="card translucent-card long-card">
      <div className="d-table-row">
        <div className="card content-card description-card my-0 mx-2">
          <h6 className="text-uppercase m-0">Initiative</h6>
          <h3 className="text-uppercase text-center m-0">+4</h3>
        </div>
        <div className="card content-card description-card my-0 mx-2">
          <h6 className="text-uppercase m-0">Inspiration</h6>
          <h3 className="text-uppercase text-center m-0">(star)</h3>
        </div>
        <div className="card content-card description-card my-0 px-4 mx-2">
          <h6 className="text-uppercase m-0">AC</h6>
          <h3 className="text-uppercase text-center m-0">15</h3>
        </div>
        <div className="card content-card description-card my-0 mx-2">
          <h6 className="text-uppercase m-0">Speed</h6>
          <h3 className="text-uppercase text-center m-0">30</h3>
        </div>
      </div>
    </div>
  );
};

const HitPointsCard = () => {
  return (
    <div className="card translucent-card long-card">
      <div className="d-table-row">
        <div className="card description-card my-0 mx-2">
          <h6 className="text-uppercase m-0 text-white">Hit Points</h6>
          <h3 className="text-uppercase text-center m-0">+4</h3>
        </div>
        <div className="card description-card my-0 mx-2">
          <h6 className="text-uppercase m-0 text-white">Hit Dice</h6>
          <h3 className="text-uppercase text-center m-0">30</h3>
        </div>
      </div>
    </div>
  );
};

const ExtraStatsCard = () => {
  return (
    <div className="card translucent-card short-card">
      <div className="card content-card description-card">
        <h6 className="text-uppercase text-center m-0">Conditions</h6>
      </div>
      <div className="card content-card description-card">
        <h6 className="text-uppercase text-center m-0">Defenses</h6>
        <div>Resistant to fire damage</div>
      </div>
    </div>
  );
};

export default DashBoard;
