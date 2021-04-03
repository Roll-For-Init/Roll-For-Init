import React, { useEffect, useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import { Popover, ArrowContainer } from 'react-tiny-popover';

import './styles.scss';

function Dropdown({
  ddLabel,
  hideLabel = false,
  title,
  items,
  width,
  multiSelect = false,
  popover = false,
  popoverText,
  selectLimit = 1,
  selection,
  setSelection,
  classname,
  border = '3px',
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
          if (selection.length + 1 == selectLimit) {
            toggle(!open);
          }
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
        if (selectionAfterRemoval.length >= selectLimit) toggle(!open);
      } else {
        toggle(!open);
      }
    }
  }

  useEffect(() => {
    let updatedTitle;
    if (Object.keys(selection).length !== 0) {
      updatedTitle = Object.keys(selection)
        .map(function(k) {
          return selection[k].name;
        })
        .join(', ');
    } else {
      updatedTitle = `Choose ${selectLimit}`;
    }
    setTitle(updatedTitle);
  }, [selection]);

  function isItemInSelection(item) {
    if (selection.some(current => current.index === item.index)) {
      return true;
    }
    return false;
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div className="dd-wrapper" style={{ width: width }}>
      {!hideLabel && (
        <div className={classname ? 'dd-label ' + classname : 'dd-label'}>
          {popover && (
            <Popover
              isOpen={isPopoverOpen}
              positions={['left', 'top', 'bottom']}
              padding={15}
              //containerParent=?
              //reposition
              //boundaryInset={10}
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
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <p>{popoverText}</p>
                  </div>
                </ArrowContainer>
              )}
            >
              <i
                className="bi bi-info-circle info-icon"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              ></i>
            </Popover>
          )}
          {ddLabel}
        </div>
      )}
      <div
        tabIndex={0}
        className={classname ? 'dd-header ' + classname : 'dd-header'}
        style={{ border: `${border} solid $maroon` }}
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
        // <ul className="dd-list shadow-card scroll">
        <ul className={`dd-list ${classname && classname} shadow-card scroll`}>
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
