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
      proficiency: 1,
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
      proficiency: false,
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
      proficiency: false,
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
      proficiency: false,
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
      <Header />
      <div className="container">
        <h1 className="display-1 text-center text-light title">
          Dashboard
          <Link to="/logout">
            <button
              type="button"
              className="btn btn-outline-danger log-out-button"
            >
              Log Out
            </button>
          </Link>
        </h1>
        {Object.keys(character).map(key => {
          return (
            <p>
              {character[key].race?.index + ' ' + character[key].class?.index}
            </p>
          );
        })}
        <SavingThrowsCard saving_throws={saving_throws} />
        <SkillsCard skills={skills} />
        <ProficieniesCard misc_proficiencies={misc_proficiencies} />
      </div>
    </div>
  );
};

const SavingThrowsCard = ({ saving_throws }) => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Saving Throws</h5>
      <div className="card content-card description-card">
        <ul>
          {Object.entries(saving_throws).map(saving_throw => {
            return (
              <li key={saving_throw[0]}>
                <p>
                  {saving_throw[1].advantage >= 0 && '+'}
                  {saving_throw[1].advantage} {saving_throw[0]}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const SkillsCard = ({ skills }) => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Skills</h5>
      <div className="card content-card description-card">
        <ul>
          {Object.entries(skills).map(skill => {
            return (
              <li key={skill[0]}>
                <p>
                  {skill[1].advantage >= 0 && '+'}
                  {skill[1].advantage} {skill[0]}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const ProficieniesCard = ({ misc_proficiencies }) => {
  console.log(misc_proficiencies);
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Proficiencies</h5>
      <div className="card content-card description-card">
        {Object.entries(misc_proficiencies).map(misc_proficiency => {
          return (
            <p key={misc_proficiency[0]}>
              <div className="text-uppercase w-auto">{misc_proficiency[0]}</div>
              -{' '}
              {misc_proficiency[1].map((items, idx) => (
                <div key={idx}>
                  {items.name}
                  {idx !== 0 && idx < misc_proficiency[1].length && ', '}
                </div>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default DashBoard;
