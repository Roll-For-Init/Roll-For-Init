import React, {useEffect, useState, useReducer}  from 'react';
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux';
import Header from '../shared/Header';
//import classIcon from '../../../public/assets/imgs/icons/off-white/class/rogue.png'
import { setUpdate, setArrayUpdate} from '../../redux/actions/characters';
import './styles.scss';
import FloatingLabel from 'floating-label-react';
import Modal from 'react-bootstrap4-modal';
import EditableLabel from 'react-editable-label';

import {D20, StarOutline, StarFilled, CircleSlot} from '../../utils/svgLibrary';

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

const fullAbScore = {
  cha: 'Charisma',
  int: 'Intelligence',
  str: 'Strength',
  wis: 'Wisdom',
  dex: 'Dexterity',
  con: 'Constitution',
};

const preparedSpells = ['wizard', 'cleric', 'druid'];

export const DashBoard = () => {
  const user = useSelector(state => state.user);
  console.log(user);
  
  const charID = JSON.parse(localStorage.getItem('state')).app.current_character;
  const character = useSelector(state => state.characters[charID]);
  console.log(character);
  const [showShortRest, setShowShortRest] = useState(false);
  const [showLongRest, setShowLongRest] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(`${character.experience.current/character.experience.threshold*100}%`)
  

  return (
    character.level ?
    (<div id="dashboard" className="dashboard">
      <Header />
      {showShortRest && <ShortRest showModal={showShortRest} setShowModal={setShowShortRest} hitDice={character.hit_dice} con={character.ability_scores.con.modifier} charClass={character.class[0].name} spellSlots={character.spells.slots} charID={charID} health={character.health}/>}
      {showExp && <ChangeExp exp={character.experience} showModal={showExp} setShowModal={setShowExp} charID={charID} setPercentage={setCurrentPercentage}/>}
      {showLongRest && <LongRest showModal={showLongRest} setShowModal={setShowLongRest} hitDice={character.hit_dice} charClass={character.class[0].name} spellSlots={character.spells.slots} charID={charID} health={character.health}/>}

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
            <span className="m-0 ml-2 align-top">
              <table style={{display: 'inline-table'}}>
                <tbody>
                  <tr>
                  <td className="card content-card description-card m-0 p-0 w-auto status-bar" style={{minWidth: '90px'}}>
                  <h6 className="unfilled on-top text-uppercase text-center p-1 m-0">{character.experience.current} XP</h6>
                  <div className={`filled blue ${currentPercentage==='100%' ? `full` : ``}`} style={{width: currentPercentage}}/>
                  </td>
                  <td><button onClick={() => setShowExp(true)} className="text-uppercase btn btn-primary exp-add mr-0 ml-1" style={{boxShadow: 'none'}}>
                    +/-
                  </button>
                  </td>
                  </tr>
                  <tr>
                  <td colSpan="2" className="text-center"><h6 className="text-uppercase text-white m-0 mr-1 w-auto"><small className="text-uppercase text-white">Next Level: {character.experience.threshold}</small></h6></td>
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
      <div style={{paddingTop: '125px'}}>
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
              <button onClick={() => setShowShortRest(true)} className="text-uppercase btn btn-secondary mx-2">
                Short Rest
              </button>
              <button onClick={() => setShowLongRest(true)} className="text-uppercase btn btn-secondary mx-2">
                Long Rest
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-5 px-0 maincol">
            <div className="row">
              <div className="col-sm-6 pl-0 pr-2">
                  <AbilitiesCard ability_scores={character.ability_scores} />
                  <SavingThrowsCard saving_throws={character.saving_throws} />
                  <ProficienciesCard misc_proficiencies={character.misc_proficiencies} />
              </div>
              <div className="col-sm-6 px-2">
                      <SkillsCard skills={character.skills} proficiency={character.proficiency_bonus}/>
                      <SensesCard perception={character.skills.perception.modifier} insight={character.skills.insight.modifier} investigation={character.skills.investigation.modifier}/>
              </div>
            </div>
          </div>
          <div className="col-xl-7 px-0">
            <div className="row">
              <div className="col-sm-8 px-2">
                      <StatsCard initiative={character.initiative_bonus} ac={character.ac} speed={character.walking_speed} charID={charID}/>
                      <HitPointsCard key={`${character.health.current}-health`} health={character.health} hit_dice={character.hit_dice} charID={charID}/>
              </div>
              <div className="col-sm-4 px-2 pr-0 pl-2">
                <ExtraStatsCard charID={charID} conditions={character.conditions} defenses={character.defenses}/>
              </div>
            </div>
            <div className="pinned row px-2">
              <div className="col-12 px-0">
                <SpellsAndPinned spells={character.spells} modifier={character.spells ? (character.ability_scores[character.spells.casting_ability].modifier) : null} proficiency={character.proficiency_bonus} charID={charID}/>

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

const ChangeExp = ({exp, showModal, setShowModal, charID, setPercentage}) => {
  const [value, setValue] = useState(null);
  const [nextLevel, setNextLevel] = useState(exp.current === exp.threshold ? true : false);
  const dispatch = useDispatch();
  const gainExp = () => {
    let newCurrent = exp.current + Number.parseInt(value);
    if(newCurrent >= exp.threshold) {
      newCurrent = exp.threshold;
      console.log('in here');
      setNextLevel(true);
    }
    setPercentage(`${newCurrent/exp.threshold*100}%`)
    dispatch(setUpdate(charID, 'experience', {current: newCurrent}))
  }
  const resetExp = () => {
    let newCurrent = 0;
    setPercentage(`0%`);
    setNextLevel(false);
    dispatch(setUpdate(charID, 'experience', {current: newCurrent}))
  }

  return (
    <Portal>
    <Modal id='exp-modal' visible={showModal} className="modal modal-dialog-centered" dialogClassName="modal-dialog-centered" onClickBackdrop={()=>setShowModal(false)}
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
            <h5>How much EXP?</h5>
          </div>
          <div className="card content-card name-card">
            <FloatingLabel
              id='EXP'
              name='EXP'
              placeholder='EXP'
              type="number"
              min="0"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </div>
          {!nextLevel ? <button
            className="text-uppercase btn-primary modal-button"
            onClick={() => {gainExp();}}
            data-dismiss="modal"
          >
            Gain Experience
          </button>
          :
          <div className="card content-card description-card">
            <h5>You've reached the next level. This application doesn't currently support characters past level 1, so please check back in the future for updates!</h5>
          </div>
          }
          <button
            className="text-uppercase btn-alert modal-button"
            onClick={() => {resetExp(); setShowModal(false)}}
            data-dismiss="modal"
          >
            Reset to Level Start
          </button>
    </Modal>
    </Portal>
  )
  
}
const LongRest = ({showModal, setShowModal, hitDice, charClass, spellSlots, charID, health}) => {
  const [spellsRecovered, setSpellsRecovered] = useState(0);
  const [healthRecovered, setHealthRecovered] = useState(0);
  const [diceRecovered, setDiceRecovered] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(spellSlots);
    if(spellSlots) {
      let newSlots = spellSlots;
      let recovered = 0;
      for(let i = 1; i <= newSlots.length; i++) {
        let slot = newSlots[i];
        if(slot.max <= 0) break;
        recovered = recovered + (slot.max-slot.current);
        slot.current = slot.max;
      }
      setSpellsRecovered(recovered);
      dispatch(setUpdate(charID, 'spells', {slots: newSlots}))
    }
    if(hitDice.current < hitDice.max) {
      let newHitDice = hitDice;
      let newHitNum = newHitDice[0].current + Math.ceil(newHitDice[0].max/2)
      if(newHitNum > newHitDice[0].max) newHitNum = newHitDice[0].max;
      newHitDice[0].current = newHitNum;
      dispatch(setArrayUpdate(charID, 'hit_dice', newHitDice))
      setDiceRecovered(newHitNum);  
    }
    if(health.current < health.max) {
      let recovered = health.max - health.current
      let newState = {current: health.current+recovered};
      setHealthRecovered(recovered);
      dispatch(setUpdate(charID, 'health', newState))  
    }
  }, [])

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
            <h5>A Long Rest is a period of extended downtime, at least 8 hours long, during which a character sleeps or performs light activity: 
              reading, talking, eating, or standing watch for no more than 2 hours. </h5>
          </div>
          {spellSlots && spellsRecovered > 0 && (
            <div className="modal-sect pb-0">
              {preparedSpells.includes(charClass.toLowerCase()) ? 
                <h5>You have recovered {spellsRecovered} spell slots and can now prepare a new set of spells.</h5>
                :
                <h5>You have recovered {spellsRecovered} spell slots.</h5>}
            </div>
          )}
          {healthRecovered > 0 && (
            <div className="modal-sect pb-0"><h5>You have recovered {healthRecovered} health.</h5></div>
          )}
          {diceRecovered > 0 && (
            <div className="modal-sect pb-0"><h5>You have recovered {diceRecovered} hit dice.</h5></div>
          )}
    </Modal>
    </Portal>
  )
}

const ShortRest = ({showModal, setShowModal, hitDice, con, charClass, spellSlots, charID, health}) => {
  const [spellsRecovered, setSpellsRecovered] = useState(0);
  const [healthRecovered, setHealthRecovered] = useState(0);
  const [numHitDice, setNumHitDice] = useState(hitDice[0].current);

  const dispatch = useDispatch();

  const rollDie = () => {
    let recovered = Math.floor(Math.random()*(hitDice[0].type)+1);
    let newHitDice = hitDice;
    newHitDice[0].current -= 1;
    dispatch(setArrayUpdate(charID, 'hit_dice', newHitDice))
    setNumHitDice(numHitDice-1);
    setHealthRecovered(recovered+con);
    let newHealth = health.current + recovered + con;
    if(newHealth > health.max) newHealth = health.max;
    let newState = {current: newHealth};
    dispatch(setUpdate(charID, 'health', newState))
  }

  useEffect(() => { /*TEMP : coded for level 1 only */
    if(charClass.toLowerCase() === "warlock") {
      let recovered = 0;
      let newSlots = spellSlots;
      for(let i = 1; i <= newSlots.length; i++) {
        let slot = newSlots[i];
        if(slot.max <= 0) break;
        console.log(i, slot.max-slot.current);
        recovered = recovered + (slot.max-slot.current);
        slot.current = slot.max;
      }
      setSpellsRecovered(recovered)
      dispatch(setUpdate(charID, 'spells', {slots: newSlots}))
    }
    if(charClass.toLowerCase() === "wizard") {
      setSpellsRecovered(1);
      let newSlots = spellSlots;
      newSlots[1].current = newSlots[1].current + 1;
      dispatch(setUpdate(charID, 'spells', {slots: newSlots}))
    }
  }, [])

  

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
            <h5>A	short	rest	is	a	period	of	downtime,	at	least	1	hour long,	during	which	a	character	does	nothing	more 
              strenuous	than	eating,	drinking,	reading, and tending to wounds.</h5>
          </div>
          {spellSlots && spellsRecovered > 0 && (
            <div className="modal-sect pb-0"><h5>You have recovered {spellsRecovered} spell slots.</h5></div>
          )}
          {healthRecovered > 0 && (
            <div className="modal-sect pb-0"><h5>You have recovered {healthRecovered} health.</h5></div>
          )}
          {numHitDice > 0 ? <button
            className="text-uppercase btn-primary modal-button"
            onClick={() => {rollDie()}}
            data-dismiss="modal"
          >
            Roll Hit Die
          </button> : (
            <div className="modal-sect pb-0"><h5>You have no more hit dice. Take a long rest to recover them as well as your health and spell slots.</h5></div>
          )}
    </Modal>
    </Portal>
  )
}

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
                  <td>{fullAbScore[saving_throw[0]]}</td>
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
      <div className="card translucent-card">
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

const StatsCard = ({initiative, ac, speed, charID}) => {
  const [inspiration, setInspiration] = useState(false);
  const dispatch = useDispatch();

  const toggleInspiration = () => {
    dispatch(setArrayUpdate(charID, 'inspiration', !inspiration))
    setInspiration(!inspiration);
  }

  return (
    <div className="stats-card">
    <div className="card translucent-card">
      <div className="row misc-stats">
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card text-center">
            <h6 className="text-uppercase m-0">Initiative</h6>
            <h2 className="text-uppercase m-0">{initiative < 0 ? `-${initiative}` : `+${initiative}`}</h2>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card text-center">
            <h6 className="text-uppercase m-0">Inspiration</h6>
            {!inspiration ?
              <button className='wrapper-button' onClick={toggleInspiration}><StarOutline /></button>
              :
              <button className='wrapper-button' onClick={toggleInspiration}><StarFilled /></button>
            }
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card text-center">
            <h6 className="text-uppercase m-0">AC</h6>
            <h2 className="text-uppercase text-center m-0">{ac}</h2>
          </div>
        </div>
        <div className="col-sm px-2 py-1">
          <div className="card content-card description-card text-center">
            <h6 className="text-uppercase m-0">Speed</h6>
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
  const [showSaves, setShowSaves] = useState(false);
  const [temp, setTemp] = useState(health.temp)
  const [currentPercentage, setCurrentPercentage] = useState(`${health.current/health.max * 100}%`);

  const updateTemp = (amt) => {
    amt = Number.parseInt(amt);
    console.log(amt);
    dispatch(setUpdate(charID, 'health', {temp: amt}));
    setTemp(amt)
  }
  const changeHealth = (amt) => {
    amt = Number.parseInt(amt)
    if(amt < 0 && health.temp > 0) {
      let newAmt = amt + health.temp;
      let newTemp = health.temp + amt;
      if(newTemp<0) newTemp = 0;
      dispatch(setUpdate(charID, 'health', {temp: newTemp}))
      if(newAmt < 0) {
        amt = newAmt
      }
      else {
        amt = 0;
      }
      setTemp(newTemp);
    }
    let newHealth = health.current+amt;
    console.log(newHealth);
    if(newHealth <= 0) setShowSaves(true);
    else if(newHealth >health.max) newHealth = health.max;
    let newState = {current: newHealth};

    setCurrentPercentage(`${newHealth/health.max * 100}%`);
    dispatch(setUpdate(charID, 'health', newState))
  }
  return (
    <>
    <div className="hit-points card translucent-card long-card">
      <div className="row">
        <div className="col-sm-7 px-3">
        {!showSaves ? 
          (<><h6 className="mb-1 card-title d-block">Hit Points</h6>
          <div className="row p-0 m-0">
            <div className="col-sm-8 px-1 py-0">
              <div className='status-bar card content-card description-card p-0 my-0 mr-2 ml-0'>
                  <h3 className="unfilled on-top text-center mb-0">{health.current}/{health.max}</h3>
                  <div className={`filled green ${currentPercentage==='100%' ? `full` : ``}`} style={{width: currentPercentage}}/>
              </div>
              <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Current/Max</small></h6>
            </div>
            <div className="col-sm-4 px-1 py-0">
            <EditableLabel 
                key={`temp-${temp}`}
                initialValue={health.temp}
                labelClass="card content-card description-card my-0 mr-2 ml-0 h3 text-center hover-effect"
                inputClass="card content-card description-card my-0 mr-2 ml-0 h3 text-center"
                save={(value) => {updateTemp(value)}}
                min='0'
                max='999'
                //onFocus={this._handleFocus}
                //onFocusOut={this._handleFocusOut}
    />                {/*<h3 className="text-uppercase text-center m-0">{health.temp}</h3>*/}
              <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Temp</small></h6>
            </div>
          </div></>)
          :
          (
            <><h6 className="mb-1 card-title d-block">Death Saves</h6>
          <div className="row p-0 m-0">
            <div className="col-sm-8 px-1 py-0">
              <div className="card content-card description-card my-0 mr-2 ml-0">
                <h3 className="text-uppercase text-center m-0">{health.current}/{health.max}</h3>
              </div>
              <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Current/Max</small></h6>
            </div>
            <div className="col-sm-4 px-1 py-0">
              <div className="card content-card description-card my-0 mr-2 ml-0 hover-effect">
              <EditableLabel 
                ref={tempRef}
                initialValue={health.temp}
                labelClass="card content-card description-card my-0 mr-2 ml-0 h3 text-center hover-effect"
                inputClass="card content-card description-card my-0 mr-2 ml-0 h3 text-center"
                save={(value) => {updateTemp(value)}}
                min='0'
                max='999'
                //onFocus={this._handleFocus}
                //onFocusOut={this._handleFocusOut}
    />                {/*<h3 className="text-uppercase text-center m-0">{health.temp}</h3>*/}
              </div>
              <h6 className="text-uppercase text-center text-white m-0 mt-1"><small>Temp</small></h6>
            </div>
          </div></>
          )
        }
        <div className="row m-0 mt-2">
          <div className="col-sm px-1 py-0">
            <button className="btn btn-alert text-uppercase text-center align-middle" onClick={() => setShowDmg(true)}>Damage</button>
          </div>
          <div className="col-sm px-1 py-0">
            <button className="btn btn-success text-uppercase text-center align-middle" onClick={() => setShowHealth(true)}>Heal</button>
          </div>
        </div>
        </div>
        <div className="col-sm-5 px-3">
        <h6 className="mb-1 card-title d-block">Hit Dice</h6>

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

const SpellsAndPinned = ({spells, modifier, proficiency, charID}) => {
  const dispatch = useDispatch();

  const spendSpell = (level) => {
    let newSlots = spells.slots;
    let newCurrent = spells.slots[level].current -1;
    newSlots[level].current = newCurrent;
    dispatch(setUpdate(charID, 'spells', {slots: newSlots}))
  }
  const unspendSpell = (level) => {
    let newSlots = spells.slots;
    let newCurrent = spells.slots[level].current +1;
    newSlots[level].current = newCurrent;
    dispatch(setUpdate(charID, 'spells', {slots: newSlots}))
  }

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
        <div className="card content-card description-card">
        <h6 className="text-uppercase text-center m-0">Spell Slots</h6>
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
          {spells.slots.map((slot, spellLevel) => {
            return (
              spellLevel > 0 && slot.max > 0 ? <td key={slot.max} className='pb-0 text-center'>
                {[...Array(slot.max - slot.current)].map((slot, index) => {
                  return (
                    <button onClick={() => unspendSpell(spellLevel)} key={`used-${index}`}className='wrapper-button-inline pb-0'><CircleSlot className='circle-filled mx-1' width='20px' height='20px'/></button>
                  )
                })}
                {[...Array(slot.current)].map((slot, index) => {
                  return (
                    <button onClick={() => spendSpell(spellLevel)} key={`unused-${index}`}className='wrapper-button-inline pb-0'><CircleSlot className='circle-outline mx-1' width='20px' height='20px'/></button>
                  )
                })}
              </td>
              : 
              null
            )      
          })}
          
          </tr>
          <tr>
          {spells.slots.map((slot, index) => {
            return (
              index > 0 && slot.max > 0 ? <td className="py-0">
                <h4 className="text-uppercase text-center m-0 line-height-small">{index}</h4>
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
