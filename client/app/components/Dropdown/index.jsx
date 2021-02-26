import React, { useState } from "react";
import onClickOutside from "react-onclickoutside";
import "./styles.scss";

function Dropdown({
  title,
  items,
  width,
  multiSelect = false,
  selectLimit = 2,
  header = false
}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([items[0]]);
  const [multiSelection, setMultiSelection] = useState([]);
  const [newTitle, setTitle] = useState([title]);
  const toggle = () => setOpen(!open);
  Dropdown.handleClickOutside = () => setOpen(false);

  function handleOnClick(item) {
    if (!selection.some(current => current.index === item.index)) {
      if (!multiSelect) {
        setSelection([item]);
        setTitle([item.name]);
        toggle(!open);
      } else if (multiSelect) {
        if (selection.length < selectLimit) {
          setSelection([...selection, item]);
        }
      }
    } else {
      if (multiSelect) {
        let selectionAfterRemoval = selection;
        selectionAfterRemoval = selectionAfterRemoval.filter(
          current => current.index !== item.index
        );
        setSelection([...selectionAfterRemoval]);
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
      <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="dd-header__title">
          <p className="dd-header__title--bold">
            {header ? <h5>{newTitle}</h5> : <>{newTitle}</>}
          </p>
        </div>
        <div className="dd-header__action">
          <p>
            {open
              ? // <i className="bi bi-chevron-down"></i>
                "Close"
              : //<i className="bi bi-chevron-up"></i>
                "Open"}
          </p>
        </div>
      </div>
      {open && (
        <ul className="dd-list">
          {items.map(item => (
            <li className="dd-list-item" key={item.index}>
              <button type="button" onClick={() => handleOnClick(item)}>
                <span>{header ? <h5>{item.name}</h5> : <>{item.name}</>}</span>
                <span>{isItemInSelection(item) && "Selected"}</span>
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

// TODO: fix this outside clicky boi
//export default onClickOutside(Dropdown, clickOutsideConfig);
export default Dropdown;
