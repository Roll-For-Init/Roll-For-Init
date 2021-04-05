import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import FloatingLabel from 'floating-label-react';
import { useHistory } from 'react-router-dom';
import { setEquipment, submitCharacter } from '../../redux/actions';
import { Link } from 'react-router-dom';

const EquipmentItem = ({
  equipment,
  selectionEq,
  setSelectionEq,
  dropdown = false,
  className,
  stateKey,
}) => {
  const mapObj = { ', monk': '', monk: '' };
  // const [selection, setSelection] = useState(null)
  function replaceAll(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

    return str.replace(re, function(matched) {
      return mapObj[matched.toLowerCase()];
    });
  }

  return (
    <>
      <div className="equipment-card-title same-line">
        {dropdown ? (
          <h5>{equipment.header}</h5>
        ) : (
          <>
            {equipment.quantity > 1 ? (
              <h5>{`${equipment.name} (${equipment.quantity})`}</h5>
            ) : (
              <h5>{equipment.name}</h5>
            )}
          </>
        )}
      </div>

      {dropdown ? (
        <>
          <Dropdown
            ddLabel=""
            hideLabel
            title={`Choose ${equipment.choose}`}
            items={[...equipment.from]}
            width="100%"
            multiSelect={equipment.choose > 1}
            selectLimit={equipment.choose}
            selection={selectionEq}
            setSelection={setSelectionEq}
            stateKey={stateKey}
            classname="eq-card"
          />
        </>
      ) : (
        <>
          <hr />
          <div className="equipment-card-body">
            {equipment.desc.category && (
              <i className="equipment-item-info">{equipment.desc.category}</i>
            )}
            {equipment.desc.damage && (
              <p className="equipment-item">
                Damage:&nbsp;
                <i className="equipment-item-info">{equipment.desc.damage}</i>
              </p>
            )}
            {equipment.desc.cost && (
              <>
                {equipment.desc.weight ? (
                  <p className="same-line">
                    <span className="equipment-item">
                      Cost:&nbsp;
                      <i className="equipment-item-info">
                        {equipment.desc.cost}
                      </i>
                    </span>
                    <span className="equipment-item">
                      Weight:&nbsp;
                      <i className="equipment-item-info">
                        {equipment.desc.weight}
                      </i>
                    </span>
                  </p>
                ) : (
                  <p className="equipment-item">
                    Cost:&nbsp;
                    <i className="equipment-item-info">{equipment.desc.cost}</i>
                  </p>
                )}
              </>
            )}
            {Array.isArray(equipment.desc.contents) && (
              <>
                Contents:&nbsp;
                {Object.keys(equipment.desc.contents)
                  .map(function(k) {
                    return equipment.desc.contents[k].item.name;
                  })
                  .join(', ')}
              </>
            )}
            {equipment.desc.special && (
              <>
                {Array.isArray(equipment.desc.special) ? (
                  <>
                    <hr />
                    <ReactReadMoreReadLess
                      charLimit={250}
                      readMoreText="Show more"
                      readLessText="Show less"
                      readMoreClassName="read-more-less--more"
                      readLessClassName="read-more-less--less"
                    >
                      {equipment.desc.special.join('\n')}
                    </ReactReadMoreReadLess>
                  </>
                ) : (
                  <>
                    {`${equipment.desc.special}`}
                    {className !== undefined &&
                    className.toLowerCase() !== 'monk'
                      ? replaceAll(equipment.desc.desc, mapObj)
                      : equipment.desc.desc && <br />}
                  </>
                )}
              </>
            )}
            {equipment.desc.desc && (
              <>
                {Array.isArray(equipment.desc.desc) ? (
                  <>
                    <hr />
                    <ReactReadMoreReadLess
                      charLimit={250}
                      readMoreText="Show more"
                      readLessText="Show less"
                      readMoreClassName="read-more-less--more"
                      readLessClassName="read-more-less--less"
                    >
                      {equipment.desc.desc.join('\n')}
                    </ReactReadMoreReadLess>
                  </>
                ) : (
                  <i className="equipment-item-info">
                    {className !== undefined &&
                    className.toLowerCase() !== 'monk'
                      ? replaceAll(equipment.desc.desc, mapObj)
                      : equipment.desc.desc}
                  </i>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

const EquipmentCard = ({
  equipmentItem,
  cardKey,
  clickable = false,
  selectedCard,
  setSelectedCard,
  className,
  charID,
}) => {
  const handleClick = () => {
    if (selectedCard?.cardKey === cardKey) setSelectedCard(null);
    else setSelectedCard({ cardKey: cardKey, equipment: equipmentItem });
  };
  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    if (selectedCard?.cardKey === cardKey) {
      setSelectedCard({ ...selectedCard, selection: newState });
    } //THIS WONT WORK IF YOU DO A DROPDOWN DESELECT AND RESELECT OR SMTH
    return newState;
  };

  //make selectedcard {index: , equipment: }

  const [selectionEq, setSelectionEq] = useReducer(reducer, {});

  return (
    <div
      className={`card content-card equipment-card ${selectedCard?.cardKey ===
        cardKey && `selected-card`}`}
    >
      {clickable && (
        <button
          onClick={() => handleClick()}
          className={`btn ${
            selectedCard?.cardKey === cardKey
              ? `btn-clicked`
              : `btn-outline-success`
          } btn-card`}
        >
          {selectedCard?.cardKey === cardKey ? 'Selected' : 'Select'}
        </button>
      )}
      {equipmentItem.type ? (
        <>
          {Array.isArray(equipmentItem.from) && (
            <>
              <EquipmentItem
                equipment={equipmentItem}
                selectionEq={
                  selectionEq[
                    `${equipmentItem.header.toLowerCase().replace(' ', '-')}`
                  ]
                }
                stateKey={`${equipmentItem.header
                  .toLowerCase()
                  .replace(' ', '-')}`}
                setSelectionEq={setSelectionEq}
                dropdown
              />
              {Object.keys(selectionEq).length !== 0 && (
                <>
                  {selectionEq[
                    `${equipmentItem.header.toLowerCase().replace(' ', '-')}`
                  ].map((dropdownItem, idx) => {
                    return (
                      <div key={idx} style={{ marginTop: '5px' }}>
                        <EquipmentItem equipment={dropdownItem} />
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {Array.isArray(equipmentItem) ? (
            <>
              {equipmentItem.map((multiEquipmentOption, idx, arr) => {
                return (
                  <div key={idx}>
                    {multiEquipmentOption.type ? (
                      <>
                        {Array.isArray(multiEquipmentOption.from) && (
                          <>
                            <EquipmentItem
                              equipment={multiEquipmentOption}
                              selectionEq={
                                selectionEq[
                                  `${multiEquipmentOption.header
                                    .toLowerCase()
                                    .replace(' ', '-')}-${idx}`
                                ]
                              }
                              stateKey={`${multiEquipmentOption.header
                                .toLowerCase()
                                .replace(' ', '-')}-${idx}`}
                              setSelectionEq={setSelectionEq}
                              dropdown
                            />
                            {Object.keys(selectionEq).length !== 0 && (
                              <>
                                {selectionEq[
                                  `${multiEquipmentOption.header
                                    .toLowerCase()
                                    .replace(' ', '-')}-${idx}`
                                ].map((dropdownItem, idx) => {
                                  return (
                                    <div key={idx} style={{ marginTop: '5px' }}>
                                      <EquipmentItem equipment={dropdownItem} />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <EquipmentItem
                          equipment={multiEquipmentOption}
                          className={className}
                        />
                        {idx !== arr.length - 1 && (
                          <div className="separator">
                            <i className="amp">&amp;</i>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <EquipmentItem
              equipment={equipmentItem}
              clickable
              className={className}
            />
          )}
        </>
      )}
    </div>
  );
};

const EquipmentList = ({
  equipmentOption,
  className,
  charID,
  theKey,
  setEquipmentSelection,
  dispatch
}) => {
  // either store the equipment list here, and then select from that list
  // based on the key of the selected card (+1 since the first index is just the header)
  // or do it in equipment card, where each card stores all of its own equipment
  // doing it in equipmentlist is probably better, but im not sure
  // either way, they would have to be concatenated in the main equipment component,
  // but it would probably be best to wait until the user goes to the next page, so
  // it doesn't have to be updated every time they change their selection?
  //const equipmentList = [].concat.apply([], Object.values(equipmentItems));
  //console.log(equipmentList);
  const [selectedCard, setSelectedCard] = useState(null);

  const breakpointColumnsObj = {
    default: 2,
    767: 1,
  };
  useEffect(() => {
    setEquipmentSelection({ [theKey]: selectedCard });
    dispatch(
      setEquipment(charID, {
        choices: {
          [theKey]: selectedCard
        }
      })
    );
    //console.log("EQUIPMENT ITEM", equipmentItem);
  }, [selectedCard]);

  return (
    <div className="card translucent-card" style={{ paddingBottom: '10px' }}>
      <div className="card content-card card-title">
        <h4>{`Choose ${equipmentOption.choose}`}</h4>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {Array.from(equipmentOption.from).map((equipmentItem, idx) => {
          return (
            <EquipmentCard
              equipmentItem={equipmentItem}
              key={idx}
              cardKey={idx}
              clickable
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              className={className}
              charID={charID}
            />
          );
        })}
      </Masonry>
    </div>
  );
};

export const Equipment = ({ charID, setPage }) => {
  const character = useSelector(state => state.characters[charID]);
  const className = character.class.index;

  //const [equipment, setEquipment] = useState(character.class.equipment.concat(character.background.equipment));
  const dispatch = useDispatch();
  const [equipmentList, setEquipmentList] = useState(
    character.class.equipment.concat(character.background.equipment)
  );
  const [equipmentOptions, setEquipmentOptions] = useState(
    character.class.equipment_options.concat(
      character.background.equipment_options
    )
  );
  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    return newState;
  };
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);

  const [addedEquipment, setAddedEquipment] = useState([]);
  const [equipmentSelection, setEquipmentSelection] = useReducer(reducer, {});

  const [name, setName] = useState('');

  const addEquipment = idx => {
    setAddedEquipment(...addedEquipment, idx);
  };

  const removeEquipment = idx => {
    setAddedEquipment(
      addedEquipment.filter(equipment => equipment.index != idx)
    );
  };

  const validateAndStore = () => {
      if (character.equipment == null) {
        //crimes i'm sorry couldn't get it working otherwise
        character.equipment = {
          choices: equipmentSelection,
          set: equipmentList,
        };
      }
      character.name = name;
      console.log(character);
      history.push('/dashboard');
      CharacterService.validateCharacter(character).then((character) => {
        dispatch(submitCharacter(character));
      })
  };

  const onNext = () => {
    console.log("EQUIPMENT", character.equipment)
    setPage({ index: 6, name: 'spells' });
    window.scrollTo(0, 0);
  };

  const history = useHistory();

  const onFinish = () => {
    validateAndStore();
    history.push('/dashboard');
  };

  useEffect(() => {
    const promises = [];
    promises.push(
      CharacterService.getEquipmentDetails(equipmentList).then(
        equipmentWDetails => {
          setEquipmentList(equipmentWDetails);
          console.log('INITIAL EQUIPMENT', equipmentWDetails);
          dispatch(
            setEquipment(charID, {
              set: equipmentList,
            })
          );
        }
      )
    );
    promises.push(
      CharacterService.getEquipmentDetails(equipmentOptions).then(
        equipmentWDetails => {
          setEquipmentOptions(equipmentWDetails);
          console.log('EQUIPMENT OPTIONS', equipmentWDetails);
        }
      )
    );
    Promise.all(promises).then(() => {
      setEquipmentLoaded(true);
    });
  }, []);

  const breakpointColumnsObj = {
    default: 2,
    767: 1,
  };

  return (
    <div className="background">
      {equipmentLoaded ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Equipment</h2>
          </div>
          <div
            className="card translucent-card"
            style={{ paddingBottom: '10px' }}
          >
            <div className="card content-card card-title">
              <h4>Starting Equipment</h4>
            </div>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {equipmentList.map((equipmentItem, idx) => {
                return (
                  <div className="card content-card equipment-card" key={idx}>
                    <EquipmentItem
                      equipment={equipmentItem}
                      className={className}
                    />
                  </div>
                );
              })}
            </Masonry>
          </div>
          {equipmentOptions.map((equipmentOption, idx) => {
            return (
              <EquipmentList
                equipmentOption={equipmentOption}
                charID={charID}
                theKey={idx}
                key={idx}
                setEquipmentSelection={setEquipmentSelection}
                equipmentSelection={equipmentSelection}
                className={className}
                dispatch={dispatch}
              />
            );
          })}
          {/* {document.getElementById('#nameModal').classList.contains('in') && ( */}
          <button
            className="text-uppercase btn-primary btn-lg px-5 btn-floating"
            data-toggle={!character.class?.spellcasting && 'modal'}
            data-target={!character.class?.spellcasting && '#nameModalEq'}
            onClick={character.class?.spellcasting && onNext}
          >
            OK
          </button>

          <div
            className="modal fade"
            id="nameModalEq"
            role="dialog"
            aria-labelledby="chooseName"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="bi bi-x"></i>
                </button>
                <div className="modal-sect pb-0">
                  <h5>Name Your Character</h5>
                </div>
                <div className="card content-card name-card">
                  <FloatingLabel
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <button
                  className="text-uppercase btn-primary modal-button"
                  onClick={onFinish}
                  data-dismiss="modal"
                >
                  FINISH
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

export default Equipment;
