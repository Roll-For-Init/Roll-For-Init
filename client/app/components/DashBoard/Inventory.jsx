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
import CharacterService from '../../redux/services/character.service';
import { isRegExp, update } from 'lodash';
import Equipment from '../Create/Equipment';

// const character = useSelector(state => state.characters[charID]);

export const EquipmentItem = ({
  equipment,
  modal = false,
  charClassName,
  togglePinned,
  toggleEquipped,
}) => {
  // const [selection, setSelection] = useState(null)

  return (
    <div className={`card content-card equipment-card`}>
      <div className="row">
        <div className="col px-0">
          <h5>
            {!modal && (
              <button
                className="wrapper-button"
                onClick={() => {
                  togglePinned();
                }}
              >
                <Star
                  className={equipment.pinned ? 'star-filled' : 'star-outline'}
                />
              </button>
            )}
            <span>
              {equipment.quantity > 1 && !(equipment.category === 'currency')
                ? equipment.equipment
                  ? `${equipment.equipment.name} (${equipment.quantity})`
                  : `${equipment.name} (${equipment.quantity})`
                : equipment.equipment
                ? equipment.equipment.name
                : equipment.name}
            </span>
          </h5>
        </div>
        {equipment.ac && !modal && (
          <div className="col-auto pr-0">
            <button
              onClick={() => toggleEquipped()}
              className={`btn ${
                equipment.equipped ? `btn-clicked` : `btn-outline-success`
              } d-inline`}
            >
              {equipment.equipped ? 'Equipped' : 'Equip'}
            </button>
          </div>
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
          {equipment.weight > 0 && (
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
            <p>
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
            </p>
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
      {/* {modal && (
        <>
          <hr />
          {equipment.damage && (
            <>
              <div className="same-line">
                <span
                  className="equipment-item m-0"
                  style={{
                    margin: 'auto',
                    marginRight: '5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Attack Bonus:
                </span>
                <FloatingLabel
                  id="attack_bonus"
                  name="attack_bonus"
                  placeholder="none"
                  type="text"
                />
              </div>
              <p className="equipment-item m-0">
                Damage Bonus:&nbsp;
                {equipment.damage_bonus ? (
                  <i className="equipment-item-info">
                    {equipment.damage_bonus}
                  </i>
                ) : (
                  <i className="equipment-item-info none">none</i>
                )}
              </p>
            </>
          )}
          {equipment.ac && (
            <p className="equipment-item m-0">
              AC Bonus:&nbsp;
              {equipment.ac_bonus ? (
                <i className="equipment-item-info">{equipment.ac_bonus}</i>
              ) : (
                <i className="equipment-item-info none">none</i>
              )}
            </p>
          )}
          <div className="equipment-item m-0">
            Description:&nbsp;
            {equipment.desc ? (
              <div className="equipment-card-body">
                {Array.isArray(equipment.desc) ? (
                  <p>
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
                  </p>
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
            ) : (
              <i className="equipment-item-info none">none</i>
            )}
          </div>
        </>
      )} */}
    </div>
  );
};

export const Inventory = ({
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

  const togglePinned = (type, idx) => {
    if (type === 'weapon') {
      weapons[idx].pinned = !weapons[idx].pinned;
      dispatch(setUpdate(charID, 'attacks', { weapons: weapons }));
    } else if (type === 'armor') {
      armor[idx].pinned = !armor[idx].pinned;
      dispatch(setArrayUpdate(charID, 'equipped_armor', armor));
    } else if (type === 'treasure') {
      treasure.other[idx].pinned = !treasure.other[idx].pinned;
      dispatch(setUpdate(charID, 'treasure', { other: treasure.other }));
    } else if (type === 'other') {
      inventory[idx].pinned = !inventory[idx].pinned;
      dispatch(setArrayUpdate(charID, 'inventory', inventory));
    }
  };

  const toggleEquipped = (armor, idx) => {
    const isShield = armor[idx].category.toLowerCase().includes('shield');
    console.log('toggling', armor[idx]);
    if (!armor[idx].equipped) {
      armor = armor.map(a => {
        if (isShield && a.category.toLowerCase().includes('shield')) {
          a.equipped = false;
        } else if (!isShield && !a.category.toLowerCase().includes('shield')) {
          a.equipped = false;
        }
        return a;
      });
    }
    armor[idx].equipped = !armor[idx].equipped;
    dispatch(setArrayUpdate(charID, 'equipped_armor', armor));
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newTreasure, setNewTreasure] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [denomination, setDenomination] = useState(null);
  const [cardDeclined, setCardDeclined] = useState(false);

  const [allWeapons, setAllWeapons] = useState(null);
  const [allArmor, setAllArmor] = useState(null);
  const [allAdventuringGear, setAllAdventuringGear] = useState(null);
  const [allTools, setAllTools] = useState(null);
  const [allMagicItems, setAllMagicItems] = useState(null);

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

  const AddItem = (itemToAdd, modelArrayName, arrayToUpdate) => {
    if (Array.isArray(arrayToUpdate)) {
      let isDuplicate = false;

      arrayToUpdate.forEach(item => {
        if (item !== null && item.name === itemToAdd.name) {
          console.log('Duplicate item found. Increasing quantity.');
          item.quantity++;
          if (arrayToUpdate === armor || arrayToUpdate === inventory) {
            dispatch(setArrayUpdate(charID, arrayToUpdate, arrayToUpdate));
          } else if (arrayToUpdate === weapons) {
            dispatch(
              setUpdate(charID, modelArrayName, {
                [arrayToUpdate]: arrayToUpdate,
              })
            );
          } else if (arrayToUpdate === treasure.other) {
            dispatch(
              setUpdate(charID, modelArrayName, {
                other: arrayToUpdate,
              })
            );
          }
          isDuplicate = true;
        }
      });

      if (!isDuplicate) {
        arrayToUpdate.push(itemToAdd);
        if (arrayToUpdate === armor || arrayToUpdate === inventory) {
          dispatch(setArrayUpdate(charID, arrayToUpdate, arrayToUpdate));
        } else if (arrayToUpdate === weapons) {
          dispatch(
            setUpdate(charID, modelArrayName, {
              [arrayToUpdate]: arrayToUpdate,
            })
          );
        } else if (arrayToUpdate === treasure.other) {
          dispatch(
            setUpdate(charID, modelArrayName, {
              other: arrayToUpdate,
            })
          );
        }
      }

      console.log(`Added ${itemToAdd.name} to inventory.`);
    }
  };

  const getEquipmentArray = () => {
    if (currentAddModalPage === 'weapon') return weapons;
    else if (currentAddModalPage === 'armor') return armor;
    else if (currentAddModalPage === 'treasure') return treasure.other;
    else if (currentAddModalPage === 'other') return inventory;
  };

  useEffect(() => {
    CharacterService.getSubList('equipment-categories/weapon').then(list => {
      setAllWeapons(list.equipment);
    });
    CharacterService.getSubList('equipment-categories/armor').then(list => {
      setAllArmor(list.equipment);
    });
    CharacterService.getSubList('equipment-categories/adventuring-gear').then(
      list => {
        setAllAdventuringGear(list.equipment);
      }
    );
    CharacterService.getSubList('equipment-categories/tools').then(list => {
      setAllTools(list.equipment);
    });
    CharacterService.getIndexedList('magic-items').then(list => {
      setAllMagicItems(list.equipment);
    });
  }, []);

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
            <div className="add-item-container">
              {allWeapons
                .filter(
                  f =>
                    f.name &&
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((weapon, idx) => (
                  <button
                    className="btn btn-secondary modal-button mb-0"
                    key={idx}
                    onClick={() => setAddedItem(weapon)}
                  >
                    {weapon.name}
                  </button>
                ))}
            </div>
          </>
        )}
        {addedItem && (
          <>
            <div className="modal-eq-card-container">
              <EquipmentItem
                equipment={addedItem}
                charClassName={charClassName}
                modal
              />
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary modal-button-submit"
                onClick={() => setAddedItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary modal-button-submit"
                onClick={() => AddItem(addedItem, 'attacks', weapons)}
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
            <div className="add-item-container">
              {allArmor
                .filter(
                  f =>
                    f.name &&
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((armor, idx) => (
                  <button
                    className="btn btn-secondary modal-button mb-0"
                    key={idx}
                    onClick={() => setAddedItem(armor)}
                  >
                    {armor.name}
                  </button>
                ))}
            </div>
          </>
        )}
        {addedItem && (
          <>
            <div className="modal-eq-card-container">
              <EquipmentItem
                equipment={addedItem}
                charClassName={charClassName}
                modal
              />
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary modal-button-submit"
                onClick={() => setAddedItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary modal-button-submit"
                onClick={() => AddItem(addedItem, 'equipped_armor', armor)}
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
    const [name, setName] = useState(null);
    const [value, setValue] = useState(null);

    return (
      <>
        <div className="modal-eq-card-container">
          <div className="card content-card treasure-card">
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
              <p className="custom-item-field-label">Value (optional):</p>
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
            className="btn btn-secondary modal-button-submit"
            onClick={() => setCurrentAddModalPage('add item')}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary modal-button-submit"
            onClick={() =>
              AddItem(
                { name: name, value: value, pinned: false },
                'treasure',
                treasure.other
              )
            }
          >
            Add
          </button>
        </div>
      </>
    );
  };

  const OtherPage = () => {
    const [addedItem, setAddedItem] = useState(null);
    const [showCustomPage, setShowCustomPage] = useState(false);
    const [name, setName] = useState(null);
    const [category, setCategory] = useState(null);
    const [weight, setWeight] = useState(null);
    const [cost, setCost] = useState(null);
    const [coin, setCoin] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [description, setDescription] = useState(null);

    return (
      <>
        {addedItem === null && showCustomPage === false && (
          <>
            <button
              className="btn btn-primary modal-button mt-0"
              onClick={() => setShowCustomPage(true)}
            >
              Custom
            </button>
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
            <div className="add-item-container">
              {allAdventuringGear
                .concat(allTools)
                .filter(
                  f =>
                    f.name &&
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((weapon, idx) => (
                  <button
                    className="btn btn-secondary modal-button mb-0"
                    key={idx}
                    onClick={() => setAddedItem(weapon)}
                  >
                    {weapon.name}
                  </button>
                ))}
            </div>
          </>
        )}
        {addedItem && showCustomPage === false && (
          <>
            <div className="modal-eq-card-container">
              <EquipmentItem
                equipment={addedItem}
                charClassName={charClassName}
                modal
              />
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary modal-button-submit"
                onClick={() => setAddedItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary modal-button-submit"
                onClick={() => AddItem(addedItem, 'inventory', inventory)}
              >
                Add
              </button>
            </div>
          </>
        )}
        {showCustomPage && (
          <>
            <div className="modal-eq-card-container">
              <div className="card content-card treasure-card">
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
                  <p className="custom-item-field-label">
                    Category (optional):
                  </p>
                  <FloatingLabel
                    id="category"
                    name="category"
                    placeholder="e.g. arcane focus"
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  />
                </div>
                <div className="same-line">
                  <p className="custom-item-field-label">Cost (optional):</p>
                  <FloatingLabel
                    id="cost"
                    name="cost"
                    placeholder="e.g. 50"
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                  />
                </div>
                <div className="same-line">
                  <p className="custom-item-field-label">
                    Denomination (optional):
                  </p>
                  <FloatingLabel
                    id="denomination"
                    name="denomination"
                    placeholder="e.g. gp"
                    type="text"
                    value={coin}
                    onChange={e => setCoin(e.target.value)}
                  />
                </div>
                <div className="same-line">
                  <p className="custom-item-field-label">Weight (optional):</p>
                  <FloatingLabel
                    id="weight"
                    name="weight"
                    placeholder="e.g. 4"
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </div>
                <div className="same-line">
                  <p className="custom-item-field-label">
                    Quantity (optional):&nbsp;
                  </p>
                  <FloatingLabel
                    id="quantity"
                    name="quantity"
                    placeholder="e.g. 10"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                  />
                </div>
                <hr />
                <p className="m-0">Description (optional):&nbsp;</p>
                <FloatingLabel
                  component="textarea"
                  id="description"
                  name="description"
                  placeholder="none"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="same-line">
              <button
                className="btn btn-secondary modal-button-submit"
                onClick={() => setShowCustomPage(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary modal-button-submit"
                onClick={() =>
                  AddItem(
                    {
                      name: name,
                      category: category,
                      cost: { amount: cost, denomination: coin },
                      weight: weight,
                      quantity: quantity,
                      desc: [description],
                      pinned: false,
                    },
                    'inventory',
                    inventory
                  )
                }
              >
                Add
              </button>
            </div>
          </>
        )}
      </>
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
  const [filterWeapons, setFilterWeapons] = useState(true);
  const [filterArmor, setFilterArmor] = useState(true);
  const [filterTreasure, setFilterTreasure] = useState(true);
  const [filterOther, setFilterOther] = useState(true);
  const [selectedCard, setSelectedCard] = useState(false);
  const [currentAddModalPage, setCurrentAddModalPage] = useState('add item');

  const filterOptions = [
    { filter: filterFavorites, setFilter: setFilterFavorites, array: [] },
    { filter: filterEquipped, setFilter: setFilterEquipped, array: [] },
    {
      filter: filterWeapons,
      setFilter: setFilterWeapons,
      array: weapons.map((w, idx) => {
        return { ...w, type: 'weapon', index: idx };
      }),
    },
    {
      filter: filterArmor,
      setFilter: setFilterArmor,
      array: armor.map((a, idx) => {
        return { ...a, type: 'armor', index: idx };
      }),
    },
    {
      filter: filterTreasure,
      setFilter: setFilterTreasure,
      array: treasure.other.map((t, idx) => {
        return { ...t, type: 'treasure', index: idx };
      }),
    },
    {
      filter: filterOther,
      setFilter: setFilterOther,
      array: inventory.map((i, idx) => {
        return { ...i, type: 'other', index: idx };
      }),
    },
  ];

  const onFilterAll = () => {
    setFilterAll(!filterAll);
    if (filterAll) {
      filterOptions.forEach(filterOption => filterOption.setFilter(false));
    } else {
      filterOptions.forEach(filterOption => filterOption.setFilter(true));
      setFilterFavorites(false);
      setFilterEquipped(false);
    }
  };

  const onFilterOption = (filter, setFilter) => {
    setFilter(!filter);
    if (
      filterOptions.filter(filterOption => filterOption.filter === false)
        .length === 0 &&
      !filterFavorites &&
      !filterEquipped
    ) {
      setFilterAll(true);
      filterOptions.forEach(filterOption => filterOption.setFilter(false));
    } else {
      setFilterAll(false);
    }
  };

  const getFilterArray = () => {
    let optionsArray = [];
    filterOptions.forEach(filterOption => {
      if (filterAll || filterOption.filter) {
        optionsArray = optionsArray.concat(filterOption.array);
      }
    });

    if (optionsArray.length === 0 && (filterFavorites || filterEquipped)) {
      optionsArray = weapons.concat(armor, inventory, treasure.other);
    }
    if (filterFavorites) {
      optionsArray = optionsArray.filter(item => item.pinned);
    }
    if (filterEquipped) {
      optionsArray = optionsArray.filter(item => item.equipped);
    }
    return optionsArray.filter(i => i.name);
  };

  return (
    <div className="inventory-container">
      <div className="row">
        <div className="same-line mb-0 w-100">
          <div className="translucent-card ml-0 mt-3">
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
              <h3 className="big-letters">{currentAddModalPage}</h3>
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
                  className="btn btn-secondary modal-button mt-0 mb-0"
                  onClick={() => setCurrentAddModalPage('weapon')}
                >
                  Weapon
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button mb-0"
                  onClick={() => setCurrentAddModalPage('armor')}
                >
                  Armor
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button mb-0"
                  onClick={() => setCurrentAddModalPage('treasure')}
                >
                  Treasure
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-button mb-0"
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
          style={{ padding: '25px 25px 10px' }}
        >
          {getFilterArray().length !== 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {getFilterArray().map((item, idx) => {
                return (
                  <EquipmentItem
                    equipment={item}
                    selectionEq={selectedCard}
                    setSelectionEq={setSelectedCard}
                    charClassName={charClassName}
                    noButton
                    togglePinned={() => {
                      togglePinned(item.type, item.index);
                    }}
                    toggleEquipped={() => {
                      item.type === 'armor' &&
                        toggleEquipped(armor, item.index);
                    }}
                    key={idx}
                  />
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
