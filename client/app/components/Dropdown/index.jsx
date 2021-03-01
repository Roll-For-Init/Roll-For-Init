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
        <div className="dd-header__title">{title}</div>
        <div className="dd-header__action">
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
          )}
        </div>
      </div>
      {open && (
        <ul className="dd-list">
          {items.map((item, idx) => (
            <li className="dd-list-item" key={idx}>
              <button
                type="button"
                className="text-background"
                onClick={() => handleOnClick(item, idx)}
              >
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
