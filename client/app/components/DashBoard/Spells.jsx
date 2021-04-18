import React, { useState, useEffect, useReducer } from 'react';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import { setUpdate, setArrayUpdate} from '../../redux/actions/characters';
import Dropdown from '../shared/Dropdown';
import { Star } from '../../utils/svgLibrary';
import { useDispatch } from 'react-redux';
import {SpellBoxes} from "./index";
import { cssNumber, nodeName } from 'jquery';

// const character = useSelector(state => state.characters[charID]);

const SpellBook = ({charID, spellcasting, modifier, proficiency, prepared}) => {

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };

  const dispatch = useDispatch();
  const [ filterAll, setFilterAll] = useState(true);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterPrepared, setFilterPrepared] = useState(false);
  const [filterSlot, setFilterSlot] = useState(false);
  const [currentPrepared, setCurrentPrepared] = useState(() => {
    let tally = 0;
    for(let i=0; i < spellcasting.cards.length; i++) {
        let level = spellcasting.cards[i];
        if(level.length <= 0) continue;
        for(let card of level) {
            if(card.prepared) tally+=1;
        }
    }  
    return tally;
  })
  
  const maxPrepared = modifier + 1 >= 0 ? modifier + 1 : 1; //TODO: FOR LEVEL 1 ONLY. 1 WOULD BE REPLACED WITH LEVEL.

  const reducer = (state, newProp) => {
    let newState = newProp;
    if(newState.length > 0) setFilterAll(false);
    else if(!(filterFavorites || filterPrepared || filterSlot)) {setFilterAll(true);
    }
    return newState;
  };

  const [levelFilter, setLevelFilter] = useReducer(reducer, []);

  useEffect(() => {
    if(!(filterFavorites || filterPrepared || filterSlot || levelFilter.length>0)) setFilterAll(true);
  }, [filterFavorites, filterPrepared, filterSlot])
  useEffect(() => {
      console.log(filterAll);
    if(filterAll) {
        setFilterFavorites(false);
        setFilterPrepared(false);
        setFilterSlot(false)
        setLevelFilter([]);
    }
}, [filterAll])
useEffect(() => {
    if(currentPrepared >= maxPrepared) {
        let unselected = document.getElementsByName("prepared");
        for (let i = 0; i < unselected.length; i++) {
          if (unselected[i].className.includes('btn-outline-success')) {
            unselected[i].className = unselected[i].className.replace(
              'btn-outline-success',
              'btn-inactive'
            );
          }
        }
    }
}, [])

  const levels = [{name:"cantrip", index: 0}, {name:"level 1", index: 1}, {name: "level 2", index: 2}, {name: "level 3", index: 3}, {name: "level 4", index: 4}, {name:"level 5", index: 5}, {name:"level 6", index:6}, {name:"level 7", index:7}, {name:"level 8", index: 8}, {name:"level 9", index:9}];
  
  const togglePinned = (level, index) => {
    spellcasting.cards[level][index].pinned = spellcasting.cards[level][index].pinned ? !spellcasting.cards[level][index].pinned : true;
    dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));
  }
  const togglePrepared= (level, index) => {
    let prepared = spellcasting.cards[level][index].prepared;
    console.log(currentPrepared);
    if((!prepared && currentPrepared +1 >= maxPrepared)) {
        let unselected = document.getElementsByName("prepared");
        for (let i = 0; i < unselected.length; i++) {
          if (unselected[i].className.includes('btn-outline-success')) {
            unselected[i].className = unselected[i].className.replace(
              'btn-outline-success',
              'btn-inactive'
            );
          }
        }
       if(currentPrepared == 0) {
            spellcasting.cards[level][index].prepared = true;
            dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
        }
    }
    else if((prepared && currentPrepared -1 < maxPrepared)) {
        let unselected = document.getElementsByName("prepared");
        for (let i = 0; i < unselected.length; i++) {
          if (unselected[i].className.includes('btn-inactive')) {
            unselected[i].className = unselected[i].className.replace(
              'btn-inactive',
              'btn-outline-success'
            );
          }
        }
        spellcasting.cards[level][index].prepared = false;
        dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
    }
    else if(currentPrepared +1 < maxPrepared && currentPrepared -1 < maxPrepared){
        spellcasting.cards[level][index].prepared = !prepared;
        dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
    }
  }


  const unwrapSpellLevel = (level, favorite) => {
    let newLevel = [];
    if(favorite) {
        for(let card of level) {
            if(card.pinned) newLevel.push(card);
        }
    }
    else {
        for(let card of level) {
            if(card.prepared) newLevel.push(card);
        }
    }
    return newLevel;
  }
  const mergeLevels = (newCards) => {
    let finalCards = []
    for(let i = 0; i < newCards.length; i++) {
        let level = newCards[i];
        if(level.length <= 0) continue;
        let newLevel = level.map((card, index) => {
            return(
                <SpellCard key={`card-${index}`} spell={card} level={i} index={index} prepared={prepared} togglePinned={togglePinned} togglePrepared={togglePrepared}/>
            )    
        })
        finalCards.push(...newLevel);
    }
    return finalCards
  }
  const cards = () => {
    let newCards = spellcasting.cards;
    let currentPrep = 0;
    if(filterAll) {
        let updateCards = [[],[],[],[],[],[],[],[],[]];
        for(let i=0; i < newCards.length; i++) {
            if(newCards[i].length <= 0) continue;
            updateCards[i].push(...newCards[i]);
        }
        newCards = updateCards;
    }
    else if(!(levelFilter.length > 0 || filterSlot || filterFavorites || filterPrepared)) {
        return [];
    }
    else {
        if(levelFilter.length > 0) {
            let updateCards = [[],[],[],[],[],[],[],[],[]];
            for(let levelSelection of levelFilter) {
                levelSelection = levelSelection.index;
                if(newCards[levelSelection].length <=0) continue;
                updateCards[levelSelection].push(...newCards[levelSelection])
            }
            newCards = updateCards;
        }
        if(filterSlot) {
            let levels = [];
            for(let i = 0; i < spellcasting.slots.length; i++) {
                let slot = spellcasting.slots[i];
                if(slot.max <= 0) break;
                if(slot.current > 0) levels.push(i);
            }
            let updateCards = [[],[],[],[],[],[],[],[],[]];
            for(let level of levels) {
                if(newCards[level].length <=0) continue;
                updateCards[level].push(...newCards[level])
            }
            newCards = updateCards;
        }
        if(filterFavorites) {
            let updateCards = [[],[],[],[],[],[],[],[],[]];
            for(let i=0; i < newCards.length; i++) {
                if(newCards[i].length <= 0) continue;
                let favorite = true;
                let newLevel = unwrapSpellLevel(newCards[i], favorite);
                updateCards[i].push(...newLevel);
            }    
            newCards = updateCards;
        }
        if(filterPrepared) {
            let updateCards = [[],[],[],[],[],[],[],[],[]];
            for(let i=0; i < newCards.length; i++) {
                if(newCards[i].length <= 0) continue;
                let noFavorite = false;
                let newLevel = unwrapSpellLevel(newCards[i], noFavorite);
                updateCards[i].push(...newLevel);
            }    
            newCards = updateCards;
        }
    }
    return mergeLevels(newCards, currentPrep);
  }

  return (
      <div className='spells-container'>
    <div className="row mt-4"><div className="mx-auto"><div className="row extra-padding"><SpellBoxes spells={spellcasting} modifier={modifier} proficiency={proficiency} charID={charID}/></div></div></div>
    <div className="row">
        <div className="same-line mb-0 w-100">
          <div className="translucent-card ml-0">
            <div className="same-line mb-0">
              <p className="filter-text">{`Filter by: `}</p>
              <button
                key={`all-${filterAll}`}
                className={`btn btn-lg btn-secondary filter-button ${filterAll &&
                  'active'}`}
                onClick={() => setFilterAll(!filterAll)}
              >
                All
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterFavorites &&
                  'active'}`}
                onClick={() => {setFilterFavorites(!filterFavorites); setFilterAll(false)}}
              >
                Favorites
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterPrepared &&
                  'active'}`}
                  onClick={() => {setFilterPrepared(!filterPrepared); setFilterAll(false)}}
                  >
                Prepared
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterSlot &&
                  'active'}`}
                  onClick={() => {setFilterSlot(!filterSlot); setFilterAll(false)}}
             >
                Slot Available
              </button>
                <Dropdown
                        hideLabel={true}
                        title="Level"
                        permTitle={true}
                        items={levels}
                        selectLimit={9}
                        multiSelect={true}
                        selection={levelFilter}
                        setSelection={setLevelFilter}
                        classname={`dd-wrapper btn btn-lg btn-secondary filter-button ${levelFilter.length>0 && 'active'}`}
                />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="translucent-card mt-0 w-100">
           {cards().length ? <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid pl-0 py-3 pr-3"
                columnClassName="my-masonry-grid_column">
                { cards() }
            </Masonry>
            :
            <h4>No spells found</h4>}
        </div>
      </div>
    </div>
  );

};

const SpellCard = ({ spell, level, index, prepared, togglePinned, togglePrepared }) => {
    return (
      <div className="card content-card spell-card mb-3">
        <div id={spell.index} className="container-fluid px-0">
          <div className="row">
            {!spell.pinned ?
            <button className='wrapper-button mr-2' onClick={() => {togglePinned(level, index)}}><Star className="star-outline" width="20px"/></button>
            :
            <button className='wrapper-button mr-2' onClick={() => {togglePinned(level, index)}}><Star className="star-filled" width="20px"/></button>
            }
            <div className="spell-title col-sm">{spell.name}</div>
            {prepared && level > 0 && <button
              onClick={() => togglePrepared(level, index)}
              className={`btn ${
                spell.prepared ? `btn-clicked` : `btn-outline-success`
              } d-inline col-sm`}
              name="prepared"
            >
              {spell.prepared ? 'Prepared' : 'Prepare'}
            </button>}
          </div>
        </div>
        <hr className="solid" />
        <div className="spell-desc">
          <p>
            {spell.level === 0 ? 'cantrip' : `level ${spell.level}`}
            {spell.ritual && <em> (ritual)</em>}
            <span>
              <em>{spell.school.name.toLowerCase()}</em>
            </span>
          </p>
          <p>
            Casting Time: <em>{spell.casting_time}</em>
          </p>
          <p>
            Range: <em>{spell.range}</em>
          </p>
          <p>
            Components:{' '}
            <em>{`${spell.components.join(', ')} ${
              spell.material ? `(${spell.material})` : ``
            }`}</em>
          </p>
          <p>
            Duration:{' '}
            <em>
              {spell.concentration
                ? `Concentration, ${spell.duration}`
                : spell.duration}
            </em>
          </p>
        </div>
        <hr className="solid" />
        <div className="spell-desc">
          {spell.desc !== undefined && (
            <ReactReadMoreReadLess
              charLimit={250}
              readMoreText="Show more"
              readLessText="Show less"
              readMoreClassName="read-more-less--more"
              readLessClassName="read-more-less--less"
            >
              {spell.desc.join('\n')}
            </ReactReadMoreReadLess>
          )}
        </div>
      </div>
    );
  };

export default SpellBook;
