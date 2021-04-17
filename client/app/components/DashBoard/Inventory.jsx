import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import { setUpdate, setArrayUpdate } from '../../redux/actions/characters';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import FloatingLabel from 'floating-label-react';
import Dropdown from '../shared/Dropdown';
import Modal from 'react-bootstrap4-modal';
import { useDispatch } from 'react-redux';
import { Star } from '../../utils/svgLibrary';
import characterService from '../../redux/services/character.service';
import { isRegExp, update } from 'lodash';
import Equipment from '../Create/Equipment';

// const character = useSelector(state => state.characters[charID]);

const Inventory = ({
  charID,
  treasure,
  str_score,
  inventory,
  weapons,
  armor,
  charClassName,
}) => {
  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };

  const dispatch = useDispatch();

  // const togglePinned = (type, idx) => {
  //   if (type === 'feature') {
  //     features[idx].pinned = !features[idx].pinned;
  //     dispatch(setArrayUpdate(charID, 'features', features));
  //   } else {
  //     traits[idx].pinned = !traits[idx].pinned;
  //     dispatch(setArrayUpdate(charID, 'traits', traits));
  //   }
  // };

  const EquipmentItem = ({
    equipment,
    modal = false,
    selectionEq,
    setSelectionEq,
    dropdown = false,
    charClassName,
    stateKey,
    noButton = false,
  }) => {
    // const [selection, setSelection] = useState(null)

    return (
      <div
        className={`card content-card equipment-card ${!modal && 'p-0'}`}
        style={{ lineHeight: 'normal' }}
      >
        <div className="same-line">
          <div className="same-line">
            <button className="wrapper-button">
              <Star className="star-outline" />
            </button>
            <div className="equipment-card-title">
              {equipment.quantity > 1 &&
              !(equipment.category === 'currency') ? (
                equipment.equipment ? (
                  <h5>{`${equipment.equipment.name} (${equipment.quantity})`}</h5>
                ) : (
                  <h5>{`${equipment.name} (${equipment.quantity})`}</h5>
                )
              ) : equipment.equipment ? (
                <h5>{equipment.equipment.name}</h5>
              ) : (
                <h5>{equipment.name}</h5>
              )}
            </div>
          </div>
          {equipment.ac && (
            <button className={`btn btn-card`}>{'Equipped'}</button>
          )}
        </div>
        {equipment.cost && <hr />}
        {equipment.category && (
          <i className="equipment-item-info">
            {equipment.category.toLowerCase()}
          </i>
        )}
        {equipment.damage && (
          <p className="equipment-item m-0">
            Damage:&nbsp;
            <i className="equipment-item-info">
              {`${
                equipment.damage.damage_dice
              } ${equipment.damage.damage_type.toLowerCase()}`}
              {equipment.damage.two_handed ? ` one-handed, ` : null}
            </i>
            {equipment.damage.two_handed && (
              <i className="equipment-item-info">{`${
                equipment.damage.two_handed.damage_dice
              } ${equipment.damage.two_handed.damage_type.toLowerCase()} (two-handed)`}</i>
            )}
          </p>
        )}
        {equipment.ac && (
          <p className="equipment-item m-0">
            AC:&nbsp;
            <i className="equipment-item-info">
              {`${equipment.armor_class.base}${
                equipment.armor_class.dex_bonus ? ' + Dex. modifier' : ''
              }${
                equipment.armor_class.max_bonus !== null
                  ? ` max ${equipment.armor_class.max_bonus}`
                  : ''
              }`}
            </i>
          </p>
        )}
        {equipment.range && (
          <p className="equipment-item m-0">
            Range:&nbsp;
            <i className="equipment-item-info">{`${equipment.range.normal}${
              equipment.range.long ? `/${equipment.range.long}` : ``
            }`}</i>
          </p>
        )}
        {equipment.cost && (
          <p className="same-line">
            <span className="equipment-item">
              Cost:&nbsp;
              <i className="equipment-item-info">{`${equipment.cost.amount}${equipment.cost.denomination}`}</i>
            </span>
            {equipment.weight && (
              <span className="equipment-item">
                Weight:&nbsp;
                <i className="equipment-item-info">{equipment.weight}</i>
              </span>
            )}
          </p>
        )}
        {equipment.properties && (
          <p className="equipment-item m-0">
            <i className="equipment-item-info">
              {charClassName.toLowerCase() !== 'monk' &&
                equipment.properties
                  .filter(property => property.toLowerCase() !== 'monk')
                  .map((property, idx, arr) =>
                    idx !== arr.length - 1
                      ? property.toLowerCase() + ', '
                      : property.toLowerCase()
                  )}
            </i>
          </p>
        )}
        {equipment.desc && (
          <div className="equipment-card-body">
            {Array.isArray(equipment.desc) ? (
              <>
                <hr />
                <ReactReadMoreReadLess
                  charLimit={250}
                  readMoreText="Show more"
                  readLessText="Show less"
                  readMoreClassName="read-more-less--more"
                  readLessClassName="read-more-less--less"
                >
                  {equipment.desc.join('\n')}
                </ReactReadMoreReadLess>
              </>
            ) : (
              <p className="equipment-item m-0">
                <i className="equipment-item-info">
                  {charClassName.toLowerCase() !== 'monk' &&
                    equipment.properties
                      .filter(property => property.toLowerCase() !== 'monk')
                      .map((property, idx, arr) =>
                        idx !== arr.length - 1
                          ? property.toLowerCase() + ', '
                          : property.toLowerCase()
                      )}
                </i>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newTreasure, setNewTreasure] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [denomination, setDenomination] = useState(null);
  const [cardDeclined, setCardDeclined] = useState(false);

  const getTotalWeight = () => {
    let totalWeight = 0;

    inventory.forEach(item =>
      item.weight
        ? (totalWeight += item.weight)
        : item.contents?.forEach(
            content =>
              content.item.weight && (totalWeight += content.item.weight)
          )
    );

    return totalWeight;
  };

  const updateTreasure = operation => {
    if (denomination !== null && newTreasure !== '') {
      console.log(
        `${operation}ing ${newTreasure} from/to ${denomination[0].name}`
      );
      let currentTreasure = parseInt(treasure[denomination[0].index]);
      if (isNaN(currentTreasure)) {
        currentTreasure = 0;
      }
      if (operation == 'subtract') {
        if (currentTreasure >= newTreasure) {
          currentTreasure -= parseInt(newTreasure);
          setCardDeclined(false);
        } else {
          setCardDeclined(true);
        }
      } else if (operation == 'add') {
        if (
          !(
            newTreasure < 0 && Math.abs(newTreasure) > Math.abs(currentTreasure)
          )
        ) {
          currentTreasure += parseInt(newTreasure);
          setCardDeclined(false);
        } else {
          setCardDeclined(true);
        }
      }
      dispatch(
        setUpdate(charID, 'treasure', {
          [denomination[0].index]: currentTreasure,
        })
      );
      console.log('Updated character treasure.');
    }
  };

  const searchHandleChange = event => {
    setSearchTerm(event.target.value);
  };

  const AddItem = item => {
    // dispatch(
    //   setUpdate(charID, 'treasure', {
    //     [denomination[0].index]: currentTreasure,
    //   })
    // );
    // console.log('Updated character treasure.');
  };

  const getEquipmentArray = () => {
    if (currentAddModalPage === 'weapon') return weapons;
    else if (currentAddModalPage === 'armor') return armor;
    else if (currentAddModalPage === 'treasure') return treasure.other;
    else if (currentAddModalPage === 'other') return inventory;
  };

  const WeaponPage = () => {
    const [addedItem, setAddedItem] = useState(null);
    return (
      <>
        {addedItem === null && (
          <>
            <div className="row search-container">
              <h4 className="search-bar">
                <i className="bi bi-search" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={searchHandleChange}
                ></input>
              </h4>
            </div>
            {weapons
              .filter(
                f =>
                  f.name &&
                  f.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((weapon, idx) => (
                <button
                  className="btn btn-secondary modal-button"
                  key={idx}
                  onClick={() => setAddedItem(weapon)}
                >
                  {weapon.name}
                </button>
              ))}
          </>
        )}
        {addedItem && (
          <>
            <div className="modal-eq-card-container">
              <EquipmentItem
                equipment={addedItem}
                charClassName={charClassName}
                noButton
                modal
              />
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary"
                onClick={() => setAddedItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => AddItem('attack', addedItem)}
              >
                Add
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  const ArmorPage = () => {
    const [addedItem, setAddedItem] = useState(null);
    return (
      <>
        {addedItem === null && (
          <>
            <div className="row search-container">
              <h4 className="search-bar">
                <i className="bi bi-search" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={searchHandleChange}
                ></input>
              </h4>
            </div>
            {armor
              .filter(
                f =>
                  f.name &&
                  f.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((armor, idx) => (
                <button
                  className="btn btn-secondary modal-button"
                  key={idx}
                  onClick={() => setAddedItem(armor)}
                >
                  {armor.name}
                </button>
              ))}
          </>
        )}
        {addedItem && (
          <>
            <div className="modal-eq-card-container">
              <EquipmentItem
                equipment={addedItem}
                charClassName={charClassName}
                noButton
              />
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary"
                onClick={() => setAddedItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => AddItem('attack', addedItem)}
              >
                Add
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  const TreasurePage = () => {
    const [addedItem, setAddedItem] = useState(null);
    const [name, setName] = useState(null);
    const [value, setValue] = useState(null);
    return (
      <>
        <div className="modal-eq-card-container">
          <div className="card content-card treasure-card mb-0">
            <FloatingLabel
              id="name"
              name="name"
              placeholder="Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <hr />
            <div className="same-line">
              <p
                style={{
                  margin: 'auto',
                  marginRight: '5px',
                  whiteSpace: 'nowrap',
                }}
              >
                Value (optional):
              </p>
              <FloatingLabel
                id="value"
                name="value"
                placeholder="e.g. 10gp"
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="same-line">
          <button
            className="btn btn-secondary"
            onClick={() => setAddedItem(null)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => AddItem('attack', addedItem)}
          >
            Add
          </button>
        </div>
      </>
    );
  };

  const OtherPage = () => {
    return (
      <div className="row search-container">
        <h4 className="search-bar">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={searchHandleChange}
          ></input>
        </h4>
      </div>
    );
  };

  const denominations = [
    { index: 'cp', name: 'cp' },
    { index: 'sp', name: 'sp' },
    { index: 'ep', name: 'ep' },
    { index: 'gp', name: 'gp' },
    { index: 'pp', name: 'pp' },
  ];

  const [filterAll, setFilterAll] = useState(true);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterEquipped, setFilterEquipped] = useState(false);
  const [filterWeapons, setFilterWeapons] = useState(false);
  const [filterArmor, setFilterArmor] = useState(false);
  const [filterTreasure, setFilterTreasure] = useState(false);
  const [filterOther, setFilterOther] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const [currentAddModalPage, setCurrentAddModalPage] = useState('add item');

  const filterOptions = [
    { filter: filterFavorites, setFilter: setFilterFavorites, array: [] },
    { filter: filterEquipped, setFilter: setFilterEquipped, array: [] },
    { filter: filterWeapons, setFilter: setFilterWeapons, array: weapons },
    { filter: filterArmor, setFilter: setFilterArmor, array: armor },
    {
      filter: filterTreasure,
      setFilter: setFilterTreasure,
      array: treasure.other,
    },
    { filter: filterOther, setFilter: setFilterOther, array: inventory },
  ];

  const onFilterAll = () => {
    setFilterAll(!filterAll);
    if (filterAll) {
      filterOptions.forEach(filterOption => filterOption.setFilter(false));
    } else {
      filterOptions.forEach(filterOption => filterOption.setFilter(true));
    }
  };

  const onFilterOption = (filter, setFilter) => {
    setFilter(!filter);
    if (
      filterOptions.filter(filterOption => filterOption.filter === false)
        .length === 0
    ) {
      setFilterAll(true);
      filterOptions.forEach(filterOption => filterOption.setFilter(false));
    } else {
      setFilterAll(false);
    }
  };

  const filterArray = () => {
    if (filterAll) {
      return weapons.concat(armor, inventory, treasure.other);
    } else {
      let optionsArray = [];
      filterOptions.forEach(filterOption => {
        if (filterOption.filter === true) {
          optionsArray = optionsArray.concat(filterOption.array);
        }
      });
      return optionsArray;
    }
  };

  return (
    <div className="inventory-container">
      <div className="row">
        <div className="same-line mb-0 w-100">
          <div className="translucent-card ml-0">
            <div className="same-line mb-0">
              <p className="filter-text">{`Filter by: `}</p>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterAll &&
                  'active'}`}
                onClick={() => onFilterAll()}
              >
                All
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterFavorites &&
                  'active'}`}
                onClick={() =>
                  onFilterOption(filterFavorites, setFilterFavorites)
                }
              >
                Favorites
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterEquipped &&
                  'active'}`}
                onClick={() =>
                  onFilterOption(filterEquipped, setFilterEquipped)
                }
              >
                Equipped
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterWeapons &&
                  'active'}`}
                onClick={() => onFilterOption(filterWeapons, setFilterWeapons)}
              >
                Weapons
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterArmor &&
                  'active'}`}
                onClick={() => onFilterOption(filterArmor, setFilterArmor)}
              >
                Armor
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterTreasure &&
                  'active'}`}
                onClick={() =>
                  onFilterOption(filterTreasure, setFilterTreasure)
                }
              >
                Treasure
              </button>
              <button
                className={`btn btn-lg btn-secondary filter-button ${filterOther &&
                  'active'}`}
                onClick={() => onFilterOption(filterOther, setFilterOther)}
              >
                Other
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm mr-0"
            onClick={() => setShowAddItemModal(true)}
          >
            + Add Item
          </button>
          <Modal
            id="exp-modal"
            visible={showAddItemModal}
            className="modal modal-dialog-centered"
            dialogClassName="modal-dialog-centered"
            onClickBackdrop={() => setShowAddItemModal(false)}
          >
            <div className="modal-header-container">
              <button
                className={`btn btn-secondary ml-0 modal-header-button ${currentAddModalPage ===
                  'add item' && 'hidden'}`}
                onClick={() => setCurrentAddModalPage('add item')}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <h4 className="big-letters">{currentAddModalPage}</h4>
              <button
                className="btn btn-secondary modal-header-button mr-0"
                onClick={() => setShowAddItemModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            {currentAddModalPage === 'add item' && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary modal-button"
                  onClick={() => setCurrentAddModalPage('weapon')}
                >
                  Weapon
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button"
                  onClick={() => setCurrentAddModalPage('armor')}
                >
                  Armor
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button"
                  onClick={() => setCurrentAddModalPage('treasure')}
                >
                  Treasure
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button"
                  onClick={() => setCurrentAddModalPage('other')}
                >
                  Other
                </button>
              </>
            )}
            {currentAddModalPage === 'weapon' && <WeaponPage />}
            {currentAddModalPage === 'armor' && <ArmorPage />}
            {currentAddModalPage === 'treasure' && <TreasurePage />}
            {currentAddModalPage === 'other' && <OtherPage />}
          </Modal>
        </div>
      </div>
      <div className="row">
        <div
          className="translucent-card w-100 mt-0"
          style={{ padding: '20px' }}
        >
          {filterArray().length !== 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {filterArray().map((item, idx) => {
                return (
                  <div className="card content-card equipment-card" key={idx}>
                    <EquipmentItem
                      equipment={item}
                      selectionEq={selectedCard}
                      setSelectionEq={setSelectedCard}
                      charClassName={charClassName}
                      noButton
                    />
                  </div>
                );
              })}
            </Masonry>
          ) : (
            <h4>No results found</h4>
          )}
        </div>
      </div>
      <div className="row">
        <div className="same-line mb-0 w-100">
          <div className="translucent-card mt-0">
            <div className="same-line mb-0">
              <div className="card content-card borderless-card copper">
                {`${treasure.cp} cp`}
              </div>
              <div className="card content-card borderless-card silver">
                {`${treasure.sp} sp`}
              </div>
              <div className="card content-card borderless-card electrum">
                {`${treasure.ep} ep`}
              </div>
              <div className="card content-card borderless-card gold">
                {`${treasure.gp} gp`}
              </div>
              <div className="card content-card borderless-card platinum">
                {`${treasure.pp} pp`}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm m-0"
                onClick={() => setShowTreasureModal(true)}
              >
                +/-
              </button>
            </div>
            <Modal
              id="exp-modal"
              visible={showTreasureModal}
              className="modal modal-dialog-centered"
              dialogClassName="modal-dialog-centered"
              onClickBackdrop={() => setShowTreasureModal(false)}
            >
              <button
                type="button"
                className="close"
                onClick={() => setShowTreasureModal(false)}
                aria-label="Close"
              >
                <i className="bi bi-x"></i>
              </button>
              <div className="modal-sect pb-0">
                <h5>Adjust Treasure</h5>
              </div>
              <div className="adjust-treasure-container">
                <div className="same-line mb-0">
                  <div className="card content-card m-0">
                    <FloatingLabel
                      id="amount"
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      value={newTreasure}
                      onChange={e => setNewTreasure(e.target.value)}
                    />
                  </div>
                  <div className="treasure-dropdown">
                    <Dropdown
                      ddLabel=""
                      hideLabel
                      title="Choose 1"
                      items={denominations}
                      selection={denomination}
                      setSelection={setDenomination}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm plus-minus-button"
                    onClick={() => {
                      updateTreasure('add');
                    }}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-primary btn-sm plus-minus-button"
                    onClick={() => {
                      updateTreasure('subtract');
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
              {cardDeclined && (
                <p className="card-declined-msg">{`You don't have enough ${denomination[0].name}.`}</p>
              )}
            </Modal>
          </div>
          <div
            className="translucent-card mt-0"
            style={{ marginBottom: '25px' }}
          >
            <div className="same-line mb-0">
              <div className="card content-card borderless-card">
                {`Weight carried: ${getTotalWeight()}`}
              </div>
              <div className="card content-card borderless-card">{`Carrying capacity: ${15 *
                str_score}`}</div>
              <Popover
                isOpen={isPopoverOpen}
                positions={['top', 'bottom']}
                padding={15}
                //containerParent=?
                boundaryInset={10}
                onClickOutside={() => setIsPopoverOpen(false)}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor={'#f6efe4'}
                    arrowSize={10}
                    className="popover-arrow-container"
                    arrowClassName="popover-arrow"
                  >
                    <div
                      className="card content-card description-card popover-card"
                      style={{ maxWidth: '250px' }}
                      //onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    >
                      <p>{`Push/drag/lift weight: ${30 * str_score}`}</p>
                      <p>{`Encumbered limit: ${5 * str_score}`}</p>
                      <p>{`Heavily encumbered limit: ${10 * str_score}`}</p>
                    </div>
                  </ArrowContainer>
                )}
              >
                <i
                  className="bi bi-info-circle info-icon off-white ml-0 mr-0"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                ></i>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
