import React, { useState } from "react";
//import onClickOutside from 'react-onclickoutside';
import "./styles.scss";

function Dropdown({ title, items, multiSelect = false }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  //Dropdown.handleClickOutside = () => setOpen(false);

  function handleOnClick(item, idx) {
    if (!selection.some(current => current.id === idx)) {
      if (!multiSelect) {
        setSelection([item]);
        toggle(!open);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        current => current.id !== idx
      );
      setSelection([...selectionAfterRemoval]);
    }
  }

  function isItemInSelection(idx) {
    if (selection.some(current => current.id === idx)) {
      return true;
    }
    return false;
  }

  return (
    <div className="dd-wrapper">
      <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="dd-header__title">
          <p>{title}</p>
        </div>
        <div className="dd-header__action">
          <p>{open ? "C" : "O"}</p>
        </div>
      </div>
      {open && (
        <ul className="dd-list">
          {items.map((item, idx) => (
            <li className="dd-list-item" key={idx}>
              <button type="button" onClick={() => handleOnClick(item, idx)}>
                <span>{item}</span>
                <span>{isItemInSelection(idx) && "Selected"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside
};

//export default onClickOutside(Dropdown, clickOutsideConfig);
export default Dropdown;
