import React, {useEffect, useState, useReducer}  from 'react';
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux';
import Header from '../shared/Header';
//import classIcon from '../../../public/assets/imgs/icons/off-white/class/rogue.png'
import { setUpdate, setArrayUpdate} from '../../redux/actions/characters';
import './styles.scss';
import FloatingLabel from 'floating-label-react';
import Modal from 'react-bootstrap4-modal';

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

const charConditions = ['Blinded','Charmed','Deafened','Exhaustion','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];


export const DashBoard = () => {
  const user = useSelector(state => state.user);
  console.log(user);
  
  const charID = JSON.parse(localStorage.getItem('state')).app.current_character;
  const character = useSelector(state => state.characters[charID]);
  console.log(character);

  return (
    character.level ?
    (<div id="dashboard" className="dashboard">
      <Header />
      <div className="toolbar fixed-top">
        <div className="subheader py-1 px-3 pt-2">
          <h2 className="small-caps mr-5">{character.name}</h2>
          <span className="ml-2">
            <h5 className="text-uppercase">
              <img
                className="button-icon"
                src={require(`../../../public/assets/imgs/icons/white/class/${character.class[0].name.toLowerCase()}.png`)}
              />
              {character.class[0].name}
            </h5>
            <h5 className="text-uppercase">
              <img
                className="button-icon"
                src={require(`../../../public/assets/imgs/icons/white/race/${character.race.name.toLowerCase().replaceAll('-','_')}.png`)}
              />
              {character.race.subrace ? character.race.subrace : character.race.name}
            </h5>
            <h5 className="text-uppercase mr-2 pb-2">Level <span style={{fontSize:'1.6rem'}}>&#8198;{character.level}</span></h5>
            <span className="m-0 align-top">
              <table style={{display: 'inline-table'}}>
                <tbody>
                  <tr>
                  <span className="card content-card description-card m-0 p-1 w-auto">
                  <h6 className="text-uppercase text-center m-0 px-4">{character.experience.current} XP</h6>
                  </span>
                  </tr>
                  <tr>
                  <h6 className="text-uppercase text-center text-white m-0 w-auto"><small className="text-uppercase text-white">Next Level: {character.experience.threshold}</small></h6>
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
                  <AbilitiesCard ability_scores={character.ability_scores} />
                  <SavingThrowsCard saving_throws={character.saving_throws} />
                  <ProficienciesCard misc_proficiencies={character.misc_proficiencies} />
              </div>
              <div className="col-sm-5 px-2">
                      <SkillsCard skills={character.skills} proficiency={character.proficiency_bonus}/>
                      <SensesCard perception={character.skills.perception.modifier} insight={character.skills.insight.modifier} investigation={character.skills.investigation.modifier}/>
              </div>
            </div>
          </div>
          <div className="col-xl-7 px-0">
            <div className="row">
              <div className="col-sm-8 px-2">
                      <StatsCard initiative={character.initiative_bonus} ac={character.ac} speed={character.walking_speed}/>
                      <HitPointsCard health={character.health} hit_dice={character.hit_dice} charID={charID}/>
              </div>
              <div className="col-sm-4 px-2 pr-0 pl-2">
                <ExtraStatsCard charID={charID} conditions={character.conditions} defenses={character.defenses}/>
              </div>
            </div>
            <div className="pinned row px-2">
              <div className="col-12 px-0">
                <SpellsAndPinned spells={character.spells} modifier={character.spells ? (character.ability_scores[character.spells.casting_ability].modifier) : null} proficiency={character.proficiency_bonus}/>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
    </div>)
    :
    <>Loading...</>
  );
};

const AbilitiesCard = ({ ability_scores }) => {

  return (
    <div className="abilities card translucent-card">
      <h5 className="card-title">Abilities</h5>
      <div className="container-fluid">
        <div className="row">
          {Object.entries(ability_scores).map((ability, index) => {
            return (
              <div key={`ability-${index}`} className="ability-grid col-4">
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

const SkillsCard = ({ skills, proficiency }) => {
  return (
    <div className="skills">
      <h4 className="translucent-card proficiency-title text-uppercase">
        Proficiency bonus: +{proficiency}
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
            misc_proficiency[1].length > 0 ? <p className="text-capitalize" key={misc_proficiency[0]}>
                <span className="small-caps">{misc_proficiency[0]}</span> –{' '}
                {misc_proficiency[1].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item}
                    {idx < misc_proficiency[1].length - 1 && ', '}
                  </React.Fragment>
                ))}
            </p>
            :
            null
          );
        })}
      </div>
    </div>
  );
};

const SensesCard = ({perception, insight, investigation}) => {
  return (
    <div className="card translucent-card">
      <h5 className="card-title">Senses</h5>
      <div className="card content-card description-card">
        <div>Passive Perception (WIS): {10+perception}</div>
        <div>Passive Insight (WIS): {10+insight}</div>
        <div>Passive Investigation (INT): {10+investigation}</div>
      </div>
    </div>
  );
};

const StatsCard = ({initiative, ac, speed}) => {
  return (
    <div className="stats-card">
    <div className="card translucent-card">
      <div className="row">
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card">
            <h6 className="text-uppercase m-0 text-center">Initiative</h6>
            <h2 className="text-uppercase text-center m-0">{initiative < 0 ? `-${initiative}` : `+${initiative}`}</h2>
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
            <h2 className="text-uppercase text-center m-0">{ac}</h2>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card">
            <h6 className="text-uppercase m-0 text-center">Speed</h6>
            <h2 className="text-uppercase text-center m-0">{speed}</h2>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
const Portal = ({children}) => {
  console.log(children)
  return ReactDOM.createPortal(children, document.getElementById('dashboard'));
};
/*TODO: why won't it work in component?*/
const ManualEntryModal = ({name, showModal, setShowModal, placeholder, thePrompt, buttonText, submitFunction, modifier}) => { 
  const [value, setValue] = useState(null);
  
  return (
    <Portal>
    <Modal id={name} visible={showModal} className="modal modal-dialog-centered" dialogClassName="modal-dialog-centered" onClickBackdrop={()=>setShowModal(false)}
    >
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          >
            <i className="bi bi-x"></i>
          </button>
          <div className="modal-sect pb-0">
            <h5>{thePrompt}</h5>
          </div>
          <div className="card content-card name-card">
            <FloatingLabel
              id={placeholder}
              name={placeholder}
              placeholder={placeholder}
              type="number"
              min="0"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </div>
          <button
            className="text-uppercase btn-primary modal-button"
            onClick={() => {submitFunction(value*Number.parseInt(modifier)); setShowModal(false)}}
            data-dismiss="modal"
          >
            {buttonText}
          </button>
    </Modal>
    </Portal>
  )
}

const HitPointsCard = ({health, hit_dice, charID}) => {
  const dispatch = useDispatch();

  const [showDmg, setShowDmg] = useState(false);
  const [showHealth, setShowHealth] = useState(false);

  const changeHealth = (amt) => {
    amt = Number.parseInt(amt)
    let newHealth = {current: (health.current + amt)};
    dispatch(setUpdate(charID, 'health', newHealth))
  }

  return (
    <>
    <div className="hit-points card translucent-card long-card">
      <div className="row px-3">
        <div className="col-sm-7 px-2 py-1">
        <h6 className="text-uppercase m-0 mb-1 text-white text-center align-top">Hit Points</h6>
        <div className="row p-0 m-0">
          <div className="col-sm-8 px-1 py-0">
            <div className="card content-card description-card my-0 mr-2 ml-0">
              <h3 className="text-uppercase text-center m-0">{health.current}/{health.max}</h3>
            </div>
            <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Current/Max</small></h6>
          </div>
          <div className="col-sm-4 px-1 py-0">
            <div className="card content-card description-card my-0 mr-2 ml-0">
              <h3 className="text-uppercase text-center m-0">{health.temp}</h3>
            </div>
            <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Temp</small></h6>
          </div>
        </div>
        <div className="row px-3 m-0 mt-2">
          <div className="col-sm px-1 py-0">
            <button className="btn btn-alert text-uppercase text-center align-middle" onClick={() => setShowDmg(true)}>Damage</button>
          </div>
          <div className="col-sm px-1 py-0">
            <button className="btn btn-success text-uppercase text-center align-middle" onClick={() => setShowHealth(true)}>Heal</button>
          </div>
        </div>
        </div>
        <div className="col-sm-5 px-2 pl-5 py-1">
        <h6 className="text-uppercase m-0 mb-1 text-white text-center align-top">Hit Dice</h6>

          <div className="card content-card description-card my-0 mr-0">
            <h3 className="text-uppercase text-center m-0">{hit_dice[0].current}d{hit_dice[0].type}</h3>
          </div>
          <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Max: {hit_dice[0].max}d{hit_dice[0].type}</small></h6>
        </div>
      </div>
    </div>
    {showDmg && <ManualEntryModal name={`DmgModal`} showModal={showDmg} setShowModal={setShowDmg} placeholder="Amt" thePrompt="How much damage?" buttonText="OW!" submitFunction={changeHealth} modifier="-1"/>}
    {showHealth && <ManualEntryModal name={`HealthModal`} showModal={showHealth} setShowModal={setShowHealth} placeholder="Amt" thePrompt="How much healing?" buttonText="Ah..." submitFunction={changeHealth} modifier="1"/>}
    </>
  );
};

const PromptedModal = ({name, thePrompt, buttonText, showModal, setShowModal, submitFunction, options}) => {
  
  return (
    <Portal>
    <Modal id={name} visible={showModal} className="modal modal-dialog-centered" dialogClassName="modal-dialog-centered" onClickBackdrop={()=>setShowModal(false)}
    >
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          >
            <i className="bi bi-x"></i>
          </button>
          <div className="modal-sect pb-0">
            <h5>{thePrompt}</h5>
          </div>
          <table className='table modal-table'>
              <tr>
                { 
              console.log(options.length)}
            {options.slice(0, Math.ceil(options.length/2)).map((option, index) => {
              return(
                <td key={`condition-${index}`}>
                <button
                  type="button"
                  className={'btn btn-primary m-1'
                  }
                  onClick={() => {submitFunction(option); setShowModal(false)}}
                >
                  {option}
              </button>
              </td>
              )
            })}
            </tr>
          <tr>
            {options.slice(Math.ceil(options.length/2), options.length).map((option, index) => {
              return(
                <td key={`condition-${index}`}
                >
                  <button
                    type="button"
                    className={'btn btn-primary m-1'
                    }
                    onClick={() => {submitFunction(option); setShowModal(false)}}
                  >
                    {option}
                </button>
              </td>
              )
            })}
          </tr>
        </table>

    </Modal>
    </Portal>
  )
}

const ExtraStatsCard = ({charID, conditions, defenses}) => {
  const dispatch = useDispatch();
  const reducer = (state, item) => {
    let push = item.push;
    item = item.item;
    console.log(state, item);
    let newState;
    if(push) {state.push(item);
      newState = state;
    }
    else newState = state.splice(state.indexOf(item), 1);
    dispatch(setArrayUpdate(charID, 'conditions', newState));
    console.log("NEW STATE", newState);
    return newState;
  };

  const [showAdd, setShowAdd] = useState(false);
  const [conditionList, setConditionList] = useReducer(reducer, conditions);

  const addCondition = (condition) => {
    setConditionList({item: condition, push: true});
  }
  const removeCondition = (condition) => {
    setConditionList({item: condition, push: false})
  }
  return (
    <>
    <div className="card translucent-card short-card extra-stats">
      <div className="card content-card description-card px-1">
        <h6 className="text-uppercase text-center m-0">Conditions</h6>
        {conditions.map((condition, index) => {
          return (<button className="btn-outline-primary" onClick={() => removeCondition(condition)} key={`condition-${index}`}>{condition}</button>)
        })}
        <button className="btn-outline-success" onClick={() => {setShowAdd(true)}}>{/*<input className='form-control'/>*/}<span className="green">+</span>Add condition</button>
      </div>
      <div className="card content-card description-card">
        <h6 className="text-uppercase text-center m-0">Defenses</h6>
        <ul>
          {defenses.resistances.map((defense, index) => {
            return (<li key={`defense-${index}`}><span>Resistant to {defense} damage</span></li>)
          })}
        </ul>
      </div>
    </div>
    {showAdd && <PromptedModal name={`ConditionModal`} thePrompt="Add Condition" buttonText="Add Condition" showModal={showAdd} setShowModal={setShowAdd} submitFunction={addCondition} options={charConditions}/>}
    </>
  );
};

const SpellsAndPinned = ({spells, modifier, proficiency}) => {
  return (
  <div className="card translucent-card w-100 mx-0">
    {spells != null && (<div className="row px-5">
      <div>
        <div className="card content-card description-card p-1">
        <h6 className="text-uppercase text-center m-0">Spellcasting</h6>
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
          <td>
            <h5 className="text-uppercase text-center m-0">{modifier >= 0 ? `+${modifier}` : `-${modifier}`}<super><small>({spells.casting_ability})</small></super></h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">{8+modifier+proficiency}</h5>
          </td>
          <td>
            <h5 className="text-uppercase text-center m-0">{modifier+proficiency >= 0 ? `+${modifier+proficiency}` : `-${modifier+proficiency}`}</h5>
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
                      {/*SPELL SLOTS TBD*/}
        <h6 className="text-uppercase text-center m-0">Spell Slots</h6>
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
          {spells.slots.map((slot) => {
            return (
              slot.max > 0 ? <td key={slot.max}>
              <h5 className="text-uppercase text-center m-0"><span>
                {[...Array(slot.current)].map(() => {
                  return (
                    <>&#9679;</>
                  )
                })}
                {[...Array(slot.max)].map(() => {
                  return (
                    <>&#9675;</>
                  )
                })}
              </span></h5>
              </td>
              : 
              null
            )      
          })}
          
          </tr>
          <tr>
          {spells.slots.map((slot, index) => {
            return (
              slot.max > 0 ? <td>
                <h4 className="text-uppercase text-center m-0">{index+1}</h4>
              </td>
              : 
              null
            )      
          })}
          </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>)}
    <div className="row">

    </div>
  </div>
  )
}

export default DashBoard;
