import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

function Header({}) {
  return (
    <header className="navbar">
      <nav>
        <Link to="/">
          <img
            src={require('/client/public/assets/imgs/navbar-logo.png')}
            alt="Roll for Init"
          />
        </Link>
      </nav>
    </header>
  );
}

export default Header;
