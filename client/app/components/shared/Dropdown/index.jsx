import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import './styles.scss';

function Dropdown({
  ddLabel,
  title,
  items,
  width,
  multiSelect = false,
  selectLimit = 2,
  selection,
  setSelection,
  classname,
  stateKey,
}) {
  const [open, setOpen] = useState(false);
  // const [selection, setSelection] = useState([items[0]]);
  // //const [multiSelection, setMultiSelection] = useState([]);
  const [newTitle, setTitle] = useState([title]);
  const toggle = () => setOpen(!open);
  if (selection == undefined) selection = [];
  //Dropdown.handleClickOutside = () => setOpen(false);

  function handleOnClick(item) {
    if (!selection.some(current => current.index === item.index)) {
      if (!multiSelect) {
        if (stateKey != undefined) {
          let select = {};
          select[stateKey] = [item];
          setSelection(select);
        } else setSelection([item]);
        setTitle([item.name]);
        toggle(!open);
      } else if (multiSelect) {
        if (selection.length < selectLimit) {
          if (stateKey != undefined) {
            let select = {};
            select[stateKey] = [...selection, item];
            setSelection(select);
          } else setSelection([...selection, item]);
          console.log(selection, item);
        }
      }
    } else {
      if (multiSelect) {
        let selectionAfterRemoval = selection;
        selectionAfterRemoval = selectionAfterRemoval.filter(
          current => current.index !== item.index
        );
        if (stateKey != undefined) {
          let select = {};
          select[stateKey] = [...selectionAfterRemoval];
          setSelection(select);
        } else setSelection([...selectionAfterRemoval]);
      } else {
        toggle(!open);
      }
    }
  }

  function isItemInSelection(item) {
    if (selection.some(current => current.index === item.index)) {
      return true;
    }
    return false;
  }

  return (
    <div className="dd-wrapper" style={{ width: width }}>
      <div className={classname ? 'dd-label ' + classname : 'dd-label'}>
        {ddLabel}
      </div>
      <div
        tabIndex={0}
        className={classname ? 'dd-header ' + classname : 'dd-header'}
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="dd-header__title">
          <span>{newTitle}</span>
        </div>
        <div className="dd-header__action">
          {open ? (
            <i className="bi bi-chevron-up"></i>
          ) : (
            <i className="bi bi-chevron-down"></i>
          )}
        </div>
      </div>
      {open && (
        <ul className="dd-list shadow-card scroll">
          {items.map(item => (
            <li className="dd-list-item" key={item.index}>
              <button
                type="button"
                className={
                  isItemInSelection(item)
                    ? 'selected'
                    : multiSelect && selection.length >= selectLimit
                    ? 'unselectable'
                    : ''
                }
                onClick={() => handleOnClick(item)}
              >
                <span>
                  {' '}
                  {classname == 'header' ? (
                    <h5>{item.name}</h5>
                  ) : (
                    <>{item.name}</>
                  )}
                </span>
                <span>
                  {isItemInSelection(item) && <i className="bi bi-check"></i>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside,
};

// TODO: fix this outside clicky boi
//export default onClickOutside(Dropdown, clickOutsideConfig);
export default Dropdown;
