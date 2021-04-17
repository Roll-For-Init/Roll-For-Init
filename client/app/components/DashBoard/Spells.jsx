import React, { useState, useEffect, useReducer } from 'react';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import { setUpdate, setArrayUpdate} from '../../redux/actions/characters';
import Dropdown from '../shared/Dropdown';
import { Star } from '../../utils/svgLibrary';
import { useDispatch } from 'react-redux';
import {SpellBoxes} from "./index";

// const character = useSelector(state => state.characters[charID]);

export const SpellBook = ({charID, spellcasting, modifier, proficiency, prepared}) => {

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };

  const dispatch = useDispatch();
  const [filterAll, setFilterAll] = useState(true);
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
// useEffect(() => {
//     if(currentPrepared >= maxPrepared) {
//         let unselected = document.getElementsByName("prepared");
//         for (let i = 0; i < unselected.length; i++) {
//           if (unselected[i].className.includes('btn-outline-success')) {
//             unselected[i].className += " disabled";
//           }
//         }
//     }
// }, [])

  const levels = [{name:"Cantrip", index: 0}, {name:"Level 1", index: 1}, {name: "Level 2", index: 2}, {name: "Level 3", index: 3}, {name: "Level 4", index: 4}, {name:"Level 5", index: 5}, {name:"Level 6", index:6}, {name:"Level 7", index:7}, {name:"Level 8", index: 8}, {name:"Level 9", index:9}].filter(l => spellcasting.cards[l.index]?.length);
  
  const togglePinned = (level, index) => {
    spellcasting.cards[level][index].pinned = spellcasting.cards[level][index].pinned ? !spellcasting.cards[level][index].pinned : true;
    dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));
  }
  const togglePrepared= (level, index) => {
    let prepared = spellcasting.cards[level][index].prepared;
    // if (!prepared && currentPrepared + 1 >= maxPrepared) {
    //   console.log("CASE 1");
    //   // let unselected = document.getElementsByName("prepared");
    //   // for (let i = 0; i < unselected.length; i++) {
    //   //   if (unselected[i].className.includes('btn-outline-success')) {
    //   //     unselected[i].className += " disabled"
    //   //   }
    //   // }
    //   spellcasting.cards[level][index].prepared = true;
    //   dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));
    // }
    // else if(prepared) {
    //   console.log("CASE 2")
    //   // let unselected = document.getElementsByName("prepared");
    //   // if (currentPrepared === maxPrepared) {
    //   //   for (let i = 0; i < unselected.length; i++) {
    //   //     if (unselected[i].className.includes('disabled')) {
    //   //       unselected[i].className = unselected[i].className.replace(
    //   //         ' disabled',
    //   //         ''
    //   //       );
    //   //     }
    //   //   }
    //   // }
    //   spellcasting.cards[level][index].prepared = false;
    //   dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
    // }
    // else if(currentPrepared + 1 < maxPrepared && currentPrepared -1 < maxPrepared){
    //   console.log("CASE 3");
    //   spellcasting.cards[level][index].prepared = !prepared;
    //   dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
    // }
    // else {
    //   console.log("NONE");
    // }
    spellcasting.cards[level][index].prepared = !prepared;
    dispatch(setUpdate(charID, 'spells', {cards: spellcasting.cards}));    
    setCurrentPrepared(prepared ? currentPrepared - 1 : currentPrepared + 1);
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
                <SpellCard key={`card-${index}`} spell={card} level={i} index={index} prepared={prepared} togglePinned={togglePinned} togglePrepared={togglePrepared} currentPrepared={currentPrepared} maxPrepared={maxPrepared} />
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
          <div className="translucent-card ml-0 p-2">
            <div className="same-line mb-0">
              <p className="filter-text">{`Filter by: `}</p>
              <button
                key={`all-${filterAll}`}
                className={`btn btn-lg btn-secondary filter-button ${filterAll &&
                  'active'}`}
                onClick={() => setFilterAll(true)}
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
              {prepared &&
                <button
                  className={`btn btn-lg btn-secondary filter-button ${filterPrepared &&
                    'active'}`}
                    onClick={() => {setFilterPrepared(!filterPrepared); setFilterAll(false)}}
                    >
                  Prepared
                </button>
              }
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterSlot &&
                  'active'}`}
                  onClick={() => {setFilterSlot(!filterSlot); setFilterAll(false)}}
              >
                Slot Available
              </button>
              {levels.length > 1 &&
                <Dropdown
                        hideLabel={true}
                        title="Level"
                        permTitle={true}
                        items={levels}
                        selectLimit={9}
                        multiSelect={true}
                        selection={levelFilter}
                        setSelection={setLevelFilter}
                        headerClassName={`dd-wrapper btn btn-lg btn-secondary filter-button ${levelFilter.length>0 && 'active'}`}
                />
              }
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="translucent-card mt-0 w-100">
           {cards().length ? <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
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

export const SpellCard = ({ spell, level, index, prepared, togglePinned, togglePrepared, currentPrepared, maxPrepared }) => {
    return (
      <div className="card content-card spell-card mb-3">
        <div className="row">
          <div className="col px-0">
            <h5>
              {!spell.pinned ?
                <button className="wrapper-button" onClick={() => {togglePinned(level, index)}}><Star className="star-outline"/></button>
                :
                <button className="wrapper-button" onClick={() => {togglePinned(level, index)}}><Star className="star-filled"/></button>
              }
              {spell.name}
            </h5>
          </div>
          {prepared && level > 0 && togglePrepared &&
            <div className="col-auto pr-0">
              <button
                onClick={() => togglePrepared(level, index)}
                className={`btn ${
                  spell.prepared ? `btn-clicked` : `btn-outline-success`
                } d-inline`}
                name="prepared"
                disabled={!spell.prepared && currentPrepared >= maxPrepared}
              >
                {spell.prepared ? 'Prepared' : 'Prepare'}
              </button>
            </div>
          }
        </div>
        {prepared && level > 0 && !togglePrepared &&
          <i className="text-lowercase">{spell.prepared ? "Prepared" : "Unprepared"}</i>
        }
        <hr className="solid" />
        <div className="spell-desc">
          <p>
            {spell.level === 0 ? 'cantrip' : `level ${spell.level}`}
            {spell.ritual && <em> (ritual)</em>}
            <span className="float-right">
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
        <p className="spell-desc">
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
        </p>
      </div>
    );
  };

export default SpellBook;
