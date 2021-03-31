import React, { useState } from 'react';

function MobileMenu({ buttonNames, page, setPage }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const onPageChange = (page, index) => {
    setPage({ name: page, index });
    toggle(!open);
  };

  return (
    <div className="d-md-none mobile-menu-wrapper">
      <div
        tabIndex={0}
        role="button"
        className="mobile-menu-header"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="mobile-menu-header__title">
          <span>{page.name}</span>
        </div>
        <div className="mobile-menu-header__action">
          {open ? (
            <i className="bi bi-chevron-up"></i>
          ) : (
            <i className="bi bi-chevron-down"></i>
          )}
        </div>
      </div>
      {open && (
        <ul className="mobile-menu-list">
          {buttonNames.map((name, idx) => {
            let classname = 'btn btn-lg btn-secondary menu-button';
            if (page.name === name) {
              classname = 'btn btn-lg btn-primary menu-button active';
            }
            return (
              <li className="mobile-menu-list-item" key={name}>
                <button
                  key={name}
                  type="button"
                  className={classname}
                  disabled={page.index < idx}
                  onClick={() => {
                    page.index >= idx && onPageChange(name, idx);
                  }}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MobileMenu;
