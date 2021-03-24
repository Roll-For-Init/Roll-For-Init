import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import ReactReadMoreReadLess from 'react-read-more-read-less';
// import { setEquipment } from '../../redux/actions';

const EquipmentItem = ({
  equipment,
  selectionEq,
  setSelectionEq,
  dropdown = false,
}) => {
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
        <Dropdown
          ddLabel=""
          hideLabel
          title={`Choose ${equipment.choose}`}
          items={[...equipment.from]}
          width="100%"
          multiSelect={equipment.choose > 1}
          selection={selectionEq}
          setSelection={setSelectionEq}
          classname="eq-card"
        />
      ) : (
        <>
          <hr className="mb-0 mt-0" />
          <div className="equipment-card-body">
            {equipment.desc.category && (
              <i className="equipment-item-info">{equipment.desc.category}</i>
            )}
            {equipment.desc.damage && (
              <p className="equipment-item mb-0">
                Damage:&nbsp;
                <i className="equipment-item-info">{equipment.desc.damage}</i>
              </p>
            )}
            {equipment.desc.cost && (
              <>
                {equipment.desc.weight ? (
                  <p className="same-line mb-0">
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
                  <p className="equipment-item mb-0">
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
            {equipment.desc.desc && (
              <>
                {Array.isArray(equipment.desc.desc) ? (
                  <>
                    <hr className="mb-0 mt-0" />
                    <p className="mb-0">
                      <ReactReadMoreReadLess
                        charLimit={250}
                        readMoreText="Show more"
                        readLessText="Show less"
                        readMoreClassName="read-more-less--more"
                        readLessClassName="read-more-less--less"
                      >
                        {equipment.desc.desc.join('\n')}
                      </ReactReadMoreReadLess>
                    </p>
                  </>
                ) : (
                  <i className="equipment-item-info">{equipment.desc.desc}</i>
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
}) => {
  const handleClick = () => {
    if (selectedCard === cardKey) setSelectedCard(null);
    else setSelectedCard(cardKey);
    console.log(selectedCard);
  };

  const [selectionEq, setSelectionEq] = useState([]);
  return (
    <div
      className={`card content-card equipment-card ${selectedCard === cardKey &&
        `selected-card`}`}
    >
      {clickable && (
        <button
          onClick={() => handleClick()}
          className={`btn ${
            selectedCard === cardKey ? `btn-clicked` : `btn-outline-success`
          } btn-card`}
        >
          {selectedCard === cardKey ? 'Selected' : 'Select'}
        </button>
      )}
      {equipmentItem.type ? (
        <>
          {Array.isArray(equipmentItem.from) && (
            <EquipmentItem
              equipment={equipmentItem}
              selectionEq={selectionEq}
              setSelectionEq={setSelectionEq}
              dropdown
            />
          )}
        </>
      ) : (
        <>
          {Array.isArray(equipmentItem) ? (
            <>
              {equipmentItem.map((multiEquipmentOption, idx, arr) => {
                return (
                  <div key={idx}>
                    <EquipmentItem equipment={multiEquipmentOption} />
                    {idx !== arr.length - 1 && (
                      <div className="separator">
                        <i className="amp">&amp;</i>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <EquipmentItem equipment={equipmentItem} clickable />
          )}
        </>
      )}
    </div>
  );
};

const EquipmentList = ({ equipmentOption }) => {
  //const equipmentList = [].concat.apply([], Object.values(equipmentItems));
  //console.log(equipmentList);
  const [selectedCard, setSelectedCard] = useState(null);
  return (
    <div className="card translucent-card">
      <div className="card content-card card-title">
        <h4>{`Choose ${equipmentOption.choose}`}</h4>
      </div>
      {/* <div className="spell-custom-container">
        <div className="container">
          <div className="card-columns"> */}
      <div className="grid">
        {/* <div className="masonry"> */}
        {Array.from(equipmentOption.from).map((equipmentItem, idx) => {
          return (
            // <div className="item">
            <EquipmentCard
              equipmentItem={equipmentItem}
              key={idx}
              cardKey={idx}
              clickable
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
            />
            // </div>
          );
        })}
        {/* </div> */}
      </div>
    </div>
  );
};

export const Equipment = ({ charID, setPage }) => {
  const character = useSelector(state => state.characters[charID]);
  const [equipment, setEquipment] = useState(
    character.class.equipment.concat(character.background.equipment)
  );
  const [equipmentOptions, setEquipmentOptions] = useState(
    character.class.equipment_options.concat(
      character.background.equipment_options
    )
  );
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);

  const [selectionEq, setSelectionEq] = useState([]);
  const [addedEquipment, setAddedEquipment] = useState([]);

  const addEquipment = idx => {
    setAddedEquipment(...addedEquipment, idx);
  };

  const removeEquipment = idx => {
    setAddedEquipment(
      addedEquipment.filter(equipment => equipment.index != idx)
    );
  };

  const onNext = () => {
    setPage({ index: 6, name: 'spells' });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const promises = [];
    promises.push(
      CharacterService.getEquipmentDetails(equipment).then(
        equipmentWDetails => {
          setEquipment(equipmentWDetails);
          console.log('equipment', equipmentWDetails);
        }
      )
    );
    promises.push(
      CharacterService.getEquipmentDetails(equipmentOptions).then(
        equipmentWDetails => {
          setEquipmentOptions(equipmentWDetails);
          console.log('options', equipmentWDetails);
        }
      )
    );
    Promise.all(promises).then(() => {
      setEquipmentLoaded(true);
    });
  }, []);

  return (
    <div className="background">
      {equipmentLoaded && (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Equipment</h2>
          </div>
          <div className="card translucent-card">
            <div className="card content-card card-title">
              <h4>Starting Equipment</h4>
            </div>
            <div className="spell-custom-container">
              <div className="container">
                <div className="card-columns">
                  {equipment.map((equipmentItem, idx) => {
                    return (
                      <div
                        className="card content-card equipment-card"
                        key={idx}
                      >
                        <EquipmentItem equipment={equipmentItem} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {equipmentOptions.map((equipmentOption, idx) => {
            return (
              <EquipmentList equipmentOption={equipmentOption} key={idx} />
            );
          })}
          <button
            className="text-uppercase btn-primary btn-lg px-5 btn-floating"
            onClick={onNext}
          >
            OK
          </button>
        </>
      )}
    </div>
  );
};

export default Equipment;
