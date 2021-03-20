import React, { useState, useEffect, useReducer } from 'react';
// import { getEquipmentInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import ReactReadMoreReadLess from 'react-read-more-read-less';
// import { setEquipment } from '../../redux/actions';

const EquipmentCard = ({ equipment, clickable = false }) => {
  const handleClick = () => {
    // setSelected(!selected);
    console.log('toggle!');
  };

  const [selected, setSelected] = useState(false);
  return (
    <>
      {/* {clickable ? (
        <div id={equipment.index} className="container-fluid">
          <div className="row">
            <div className="equipment-card-title col-sm">{equipment.name}</div>
            <button
              onClick={() => handleClick()}
              className={`btn ${
                selected === false ? `btn-outline-success` : `btn-clicked`
              } d-inline col-sm`}
            >
              Select
            </button>
          </div>
        </div>
      ) : ( */}
      <div className="equipment-card-title">
        {equipment.quantity > 1 ? (
          <h5>{`${equipment.name} (${equipment.quantity})`}</h5>
        ) : (
          <h5>{equipment.name}</h5>
        )}
      </div>

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
              <div className="same-line mb-0">
                <span className="equipment-item">
                  Cost:&nbsp;
                  <i className="equipment-item-info">{equipment.desc.cost}</i>
                </span>
                <span className="equipment-item">
                  Weight:&nbsp;
                  <i className="equipment-item-info">{equipment.desc.weight}</i>
                </span>
              </div>
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
      {equipmentLoaded ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Equipment</h2>
          </div>
          <div className="card translucent-card">
            {' '}
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
                        <EquipmentCard equipment={equipmentItem} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {equipmentOptions.map((equipmentOption, idx) => {
            return (
              <div className="card translucent-card" key={idx}>
                <div className="card content-card card-title">
                  <h4>{`Choose ${equipmentOption.choose}`}</h4>
                </div>
                <div className="spell-custom-container">
                  <div className="container">
                    <div className="card-columns">
                      {Array.from(equipmentOption.from).map(
                        (equipmentItem, idx) => {
                          return (
                            <div
                              className="card content-card equipment-card"
                              key={idx}
                            >
                              {equipmentItem.type ? (
                                <>
                                  {Array.isArray(equipmentItem.from) && (
                                    <>
                                      <div className="equipment-card-title">
                                        <h5>{equipmentItem.header}</h5>
                                      </div>
                                      <Dropdown
                                        ddLabel=""
                                        hideLabel
                                        title={`Choose ${equipmentItem.choose}`}
                                        items={[...equipmentItem.from]}
                                        width="100%"
                                        multiSelect={equipmentItem.choose > 1}
                                        selection={selectionEq}
                                        setSelection={setSelectionEq}
                                        // classname="eq-card"
                                      />
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {Array.isArray(equipmentItem) ? (
                                    <>
                                      {equipmentItem.map(
                                        (multiEquipmentOption, idx, arr) => {
                                          return (
                                            <div key={idx}>
                                              {multiEquipmentOption.type ? (
                                                <>
                                                  {Array.isArray(
                                                    multiEquipmentOption.from
                                                  ) && (
                                                    <>
                                                      <div className="equipment-card-title">
                                                        <h5>
                                                          {
                                                            multiEquipmentOption.header
                                                          }
                                                        </h5>
                                                      </div>
                                                      <Dropdown
                                                        ddLabel=""
                                                        hideLabel
                                                        title={`Choose ${multiEquipmentOption.choose}`}
                                                        items={[
                                                          ...multiEquipmentOption.from,
                                                        ]}
                                                        width="100%"
                                                        border="2px"
                                                        multiSelect={
                                                          multiEquipmentOption.choose >
                                                          1
                                                        }
                                                        selection={selectionEq}
                                                        setSelection={
                                                          setSelectionEq
                                                        }
                                                        // classname="eq-card"
                                                      />
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  <EquipmentCard
                                                    equipment={
                                                      multiEquipmentOption
                                                    }
                                                    clickable
                                                  />
                                                  {idx !== arr.length - 1 && (
                                                    <div className="separator">
                                                      <i className="amp">
                                                        &amp;
                                                      </i>
                                                    </div>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <div>
                                      <EquipmentCard
                                        equipment={equipmentItem}
                                        clickable
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            className="text-uppercase btn-primary btn-lg px-5 btn-floating"
            onClick={onNext}
          >
            OK
          </button>
        </>
      ):
      <>Loading</>}
    </div>
  );
};

export default Equipment;
