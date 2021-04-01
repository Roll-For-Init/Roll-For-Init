import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../shared/Header';
//import classIcon from '../../../public/assets/imgs/icons/off-white/class/rogue.png'
import './styles.scss';
import {D20, StarOutline} from '../../utils/svgLibrary';
//swap race class icons with white

const skillScores = {
  athletics: 'str',
  acrobatics: 'dex',
  sleight_of_hand: 'dex',
  stealth: 'dex',
  arcana: 'int',
  history: 'int',
  investigation: 'int',
  nature: 'int', 
  religion: 'int',
  animal_handling: 'wis',
  insight: 'wis',
  medicine: 'wis', 
  perception: 'wis',
  survival: 'wis',
  deception: 'cha',
  intimidation: 'cha',
  performance: 'cha',
  persuasion: 'cha'
}

const TEMP_DATA = {
  name: 'Liir Thropp',
  level: 2,
  experience: {
    current: 647,
    threshhold: 960,
  },
  race: {
    name: 'Halfling',
    description: 'BLAH BLAH BLAH',
  },
  class: [
    {
      name: 'Rogue',
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
      score: 10,
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
      proficiency: false,
      modifier: -1,
      advantage: 0,
    },
    Dexterity: {
      proficiency: true,
      modifier: 5,
      advantage: 0,
    },
    Constitution: {
      proficiency: true,
      modifier: 1,
      advantage: 0,
    },
    Intelligence: {
      proficiency: true,
      modifier: -1,
      advantage: 0,
    },
    Wisdom: {
      proficiency: true,
      modifier: 0,
      advantage: 0,
    },
    Charisma: {
      proficiency: true,
      modifier: 2,
      advantage: 0,
    },
  },
  skills: {
    // should these skills have an associated ability, or are we getting that from the api?
    acrobatics: {
      proficiency: false,
      modifier: 5,
      advantage: 0,
    },
    animal_handling: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    arcana: {
      proficiency: false,
      modifier: -3,
      advantage: 0,
    },
    athletics: {
      proficiency: false,
      modifier: -1,
      advantage: 0,
    },
    deception: {
      proficiency: true,
      modifier: 4,
      advantage: 0,
    },
    history: {
      proficiency: false,
      modifier: -3,
      advantage: 0,
    },
    insight: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    intimidation: {
      proficiency: false,
      modifier: 4,
      advantage: 0,
    },
    investigation: {
      proficiency: true,
      modifier: -3,
      advantage: 0,
    },
    medicine: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
    nature: {
      proficiency: false,
      modifier: -3,
      advantage: 0,
    },
    perception: {
      proficiency: false,
      modifier: 2,
      advantage: 0,
    },
    performance: {
      proficiency: true,
      modifier: 2,
      advantage: 0,
    },
    persuasion: {
      proficiency: false,
      modifier: -4,
      advantage: 0,
    },
    religion: {
      proficiency: false,
      modifier: 3,
      advantage: 0,
    },
    sleight_of_hand: {
      proficiency: false,
      modifier: 5,
      advantage: 0,
    },
    stealth: {
      proficiency: false,
      modifier: 5,
      advantage: 0,
    },
    survival: {
      proficiency: false,
      modifier: 0,
      advantage: 0,
    },
  },
  conditions: ['Blinded', 'Prone']
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
      <div className="toolbar fixed-top">
        <div className="subheader py-1 px-3 pt-2">
          <h2 className="small-caps mr-5">Liir Thropp</h2>
          <span className="ml-2">
            <h5 className="text-uppercase">
              <img
                className="button-icon"
                src={require(`../../../public/assets/imgs/icons/white/class/${TEMP_DATA.class[0].name.toLowerCase()}.png`)}
              />
              Rogue
            </h5>
            <h5 className="text-uppercase">
              <img
                className="button-icon"
                src={require(`../../../public/assets/imgs/icons/white/race/${TEMP_DATA.race.name.toLowerCase()}.png`)}
              />
              Halfling
            </h5>
            <h5 className="text-uppercase mr-2 pb-2">Level <span style={{fontSize:'1.6rem'}}>&#8198;2</span></h5>
            <span className="m-0 align-top">
              <table style={{display: 'inline-table'}}>
                <tbody>
                  <tr>
                  <span className="card content-card description-card m-0 p-1 w-auto">
                  <h6 className="text-uppercase text-center m-0 px-4">647 XP</h6>
                  </span>
                  </tr>
                  <tr>
                  <h6 className="text-uppercase text-center text-white m-0 w-auto"><small className="text-uppercase text-white">Next Level: 900</small></h6>
                  </tr>
                </tbody>
              </table>
            </span>
            <D20 className='float-right' style={{marginRight:'10px'}} fill='#ffffff' width='45' height='45'/>
          </span>
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
      <div style={{paddingTop: '105px'}}>
      <div className="container-fluid px-5 py-4">
        <div className="row position-relative no-gutters mb-2" >
          <div className="w-100">
            <div className="float-start w-auto d-inline-block">
              <button className="text-uppercase btn btn-primary">
                Inventory
              </button>
              <button className="text-uppercase btn btn-primary">
                Spellbook
              </button>
              <button className="text-uppercase btn btn-primary">
                Description
              </button>
              <button className="text-uppercase btn btn-primary">Features</button>
            </div>
            <div className="float-right w-auto d-inline-block">
              <button className="text-uppercase btn btn-secondary mx-2">
                Short Rest
              </button>
              <button className="text-uppercase btn btn-secondary mx-2">
                Long Rest
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-5 px-0 maincol">
            <div className="row">
              <div className="col-sm-7 pl-0 pr-2">
                  <AbilitiesCard ability_scores={ability_scores} />
                  <SavingThrowsCard saving_throws={saving_throws} />
                  <ProficienciesCard misc_proficiencies={misc_proficiencies} />
              </div>
              <div className="col-sm-5 px-2">
                      <SkillsCard skills={skills} />
                      <SensesCard />
              </div>
            </div>
          </div>
          <div className="col-xl-7 px-0">
            <div className="row">
              <div className="col-sm-8 px-2">
                      <StatsCard />
                      <HitPointsCard />
              </div>
              <div className="col-sm-4 px-2 pr-0 pl-2">
                <ExtraStatsCard />
              </div>
            </div>
            <div className="pinned row px-2">
              <div className="col-12 px-0">
                <SpellsAndPinned />

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
    </div>
  );
};

const AbilitiesCard = ({ ability_scores }) => {
  console.log(ability_scores);

  return (
    <div className="abilities card translucent-card">
      <h5 className="card-title">Abilities</h5>
      <div className="container-fluid">
        <div className="row">
          {Object.entries(ability_scores).map(ability => {
            return (
              <div className="ability-grid col-4">
                <div>
                  <div
                  className="card content-card description-card ability-bonus mb-0"
                  key={ability[0]}
                  >
                    <h6 className="text-uppercase text-center mb-0">
                      {ability[0]}
                    </h6>
                    <h2 className="text-center mb-0 align-bottom">
                      {ability[1].modifier >= 0 && '+'}
                      {ability[1].modifier}
                    </h2>
                </div>
                <div
                  className="card content-card description-card mt-0 text-center w-75 ability-score"
                  key={ability[0]}
                >
                  {ability[1].score}
                </div>
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
      <div className="card content-card description-card" style={{width:'fit-content'}}>
        <table className="table table-borderless table-sm">
          <tbody>
            {Object.entries(saving_throws).map(saving_throw => {
              return (
                <tr key={saving_throw[0]}>
                  {saving_throw[1].proficiency ? <td>&#9679;</td> : <td>&#9675;</td>} {/**Star if expertise */}
                  <td>
                    {saving_throw[1].modifier >= 0 && '+'}
                    {saving_throw[1].modifier}{' '}
                  </td>
                  <td>{saving_throw[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SkillsCard = ({ skills }) => {
  return (
    <div className="skills">
      <h4 className="translucent-card proficiency-title text-uppercase">
        Proficiency bonus: +2
      </h4>
      <div className="card translucent-card px-5">
        <h5 className="card-title">Skills</h5>
        <div className="card content-card description-card">
        <table className="table table-borderless table-sm">
          <tbody>
            {Object.entries(skills).map(skill => {
              return (
                <tr key={skill[0]}>
                  {skill[1].proficiency ? <td>&#9679;</td> : <td>&#9675;</td>} {/**Star if expertise */}
                  <td>
                    {skill[1].modifier >= 0 && '+'}
                    {skill[1].modifier}{' '}
                  </td>
                  <td className='text-capitalize'>{skill[0].replaceAll('_',' ')}</td>
                  <td><small>{skillScores[skill[0]].toUpperCase()}</small></td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
            <p className="text-capitalize" key={misc_proficiency[0]}>
                <span className="small-caps">{misc_proficiency[0]}</span> –{' '}
                {misc_proficiency[1].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item.name}
                    {idx < misc_proficiency[1].length - 1 && ', '}
                  </React.Fragment>
                ))}
            </p>
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
    <div className="stats-card">
    <div className="card translucent-card">
      <div className="row">
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card">
            <h6 className="text-uppercase m-0 text-center">Initiative</h6>
            <h2 className="text-uppercase text-center m-0">+4</h2>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card">
            <h6 className="text-uppercase m-0 text-center">Inspiration</h6>
            <StarOutline style={{margin:'auto', display:'block', marginTop:'3px'}} width='65'/>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card px-4">
            <h6 className="text-uppercase m-0 text-center">AC</h6>
            <h2 className="text-uppercase text-center m-0">15</h2>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card">
            <h6 className="text-uppercase m-0 text-center">Speed</h6>
            <h2 className="text-uppercase text-center m-0">30</h2>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const HitPointsCard = () => {
  return (
    <div className="hit-points card translucent-card long-card">
      <div className="row px-3">
        <div className="col-sm-7 px-2 py-1">
        <h6 className="text-uppercase m-0 mb-1 text-white text-center align-top">Hit Points</h6>
        <div className="row p-0 m-0">
          <div className="col-sm-8 px-1 py-0">
            <div className="card content-card description-card my-0 mr-2 ml-0">
              <h3 className="text-uppercase text-center m-0">4/10</h3>
            </div>
            <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Current/Max</small></h6>
          </div>
          <div className="col-sm-4 px-1 py-0">
            <div className="card content-card description-card my-0 mr-2 ml-0">
              <h3 className="text-uppercase text-center m-0">0</h3>
            </div>
            <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Temp</small></h6>
          </div>
        </div>
        <div className="row px-3 m-0 mt-2">
          <div className="col-sm px-1 py-0">
            <button className="btn btn-alert text-uppercase text-center align-middle">Damage</button>
          </div>
          <div className="col-sm px-1 py-0">
            <button className="btn btn-success text-uppercase text-center align-middle">Heal</button>
          </div>
        </div>
        </div>
        <div className="col-sm-5 px-2 pl-5 py-1">
        <h6 className="text-uppercase m-0 mb-1 text-white text-center align-top">Hit Dice</h6>

          <div className="card content-card description-card my-0 mr-0">
            <h3 className="text-uppercase text-center m-0">2d8</h3>
          </div>
          <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Max: 2d8</small></h6>
        </div>
      </div>
    </div>
  );
};

const ExtraStatsCard = () => {
  return (
    <div className="card translucent-card short-card extra-stats">
      <div className="card content-card description-card px-1">
        <h6 className="text-uppercase text-center m-0">Conditions</h6>
        {TEMP_DATA.conditions.map((condition, index) => {
          return (<button className="btn-outline-primary" key={`condition-${index}`}>{condition}</button>)
        })}
        <button className="btn-outline-success"><span className="green">+</span> Add condition</button>
      </div>
      <div className="card content-card description-card">
        <h6 className="text-uppercase text-center m-0">Defenses</h6>
        <ul>
          <li><span>Resistant to fire damage</span></li>
        </ul>
      </div>
    </div>
  );
};

const SpellsAndPinned = () => {
  return (
  <div className="card translucent-card w-100 mx-0">
    <div className="row px-5">
      <div>
        <div className="card content-card description-card p-1">
        <h6 className="text-uppercase text-center m-0">Spellcasting</h6>
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
          <td>
            <h5 className="text-uppercase text-center m-0">+4<super><small>(Wis)</small></super></h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">15</h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">+6</h5>
          </td>
          </tr>
          <tr>
          <td><h6 className="text-uppercase text-center m-0">Ability</h6></td>
          <td><h6 className="text-uppercase text-center m-0">Save DC</h6></td>
          <td><h6 className="text-uppercase text-center m-0">Atk Bonus</h6></td>
          </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div className="ml-auto">
        <div className="card content-card description-card pb-0">
        <h6 className="text-uppercase text-center m-0">Spell Slots</h6>
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
          <td>
            <h5 className="text-uppercase text-center m-0"><span>&#9679;&#9679;&#9675;&#9675;</span></h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">&#9675;&#9675;&#9675;</h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">&#9675;&#9675;</h5>
          </td>
          </tr>
          <tr>
          <td><h4 className="text-uppercase text-center m-0">1</h4></td>
          <td><h4 className="text-uppercase text-center m-0">2</h4></td>
          <td><h4 className="text-uppercase text-center m-0">3</h4></td>
          </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>
    <div className="row">

    </div>
  </div>
  )
}

export default DashBoard;
