import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import Race from './Race';
import Class from './Class';
import Background from './Background';
import Abilities from './Abilities';
import Options from './Options';
import Descriptions from './Descriptions';
import Equipment from './Equipment';
import Spells from './Spells';
import MobileMenu from './MobileMenu';

import { startCharacter, setPage } from '../../redux/actions/';

import './styles.scss';
import Header from '../shared/Header';
import { Link } from 'react-router-dom';

//import {backgroundCaller} from '../apiCaller';

const buttonNames = [
  'race',
  'class',
  'abilities',
  'background',
  'description',
  'equipment',
];

const Loading = () => {
  return <React.Fragment>LOADING_CHARACTER</React.Fragment>;
};

const Page = ({ page, setCharPage, charID }) => {
  let currentPage;
  switch (page.name) {
    case 'race':
      currentPage = <Race setPage={setCharPage} charID={charID} />;
      break;
    case 'class':
      currentPage = <Class setPage={setCharPage} charID={charID} />;
      break;
    case 'abilities':
      currentPage = <Abilities setPage={setCharPage} charID={charID} />;
      break;
    case 'background':
      currentPage = <Background setPage={setCharPage} charID={charID} />;
      break;
    case 'description':
      currentPage = <Descriptions setPage={setCharPage} charID={charID} />;
      break;
    case 'equipment':
      currentPage = <Equipment setPage={setCharPage} charID={charID} />;
      break;
    case 'spells':
      currentPage = <Spells setPage={setCharPage} charID={charID} />;
      break;
  }
  return (
    <div className="col-md-9 offset-md-3 pb-0 pt-md-3 container">
      {currentPage}
    </div>
  );
};

const Buttons = ({ page, onPageChange }) => {
  return (
    page && (
      <React.Fragment>
        {buttonNames.map((name, idx) => {
          let classname = 'btn btn-lg btn-secondary menu-button';
          if (page.name === name) {
            classname = 'btn btn-lg btn-primary menu-button active';
          }
          return (
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
          );
        })}
      </React.Fragment>
    )
  );
};

const PageViewer = ({ charID }) => {
  const character = useSelector(state => state.characters[charID]);

  const dispatch = useDispatch();
  const setCharPage = (name, index) => {
    console.log('YAY');
    dispatch(setPage(charID, { ...name, ...index }));
  };

  const onPageChange = (page, index) => {
    const payload = { name: page, index: index };
    dispatch(setPage(charID, payload));
    window.scrollTo(0, 0);
  };

  return character ? (
    <div className="row position-relative" style={{ top: '45px' }}>
      <div className="col-3 d-none d-md-block side-bar overflow-auto">
        <div className="btn-group-vertical w-100" role="group">
          <Buttons page={character.page} onPageChange={onPageChange} />
          {character.class?.spellcasting && (
            <button
              key="spells"
              type="button"
              className={
                character.page.name === 'spells'
                  ? 'btn btn-lg btn-primary menu-button active'
                  : 'btn btn-lg btn-secondary menu-button'
              }
              disabled={character.page.index < 6}
              onClick={() => {
                character.page.index >= 6 && onPageChange('spells', 6);
              }}
            >
              spells
            </button>
          )}
        </div>
      </div>
      <MobileMenu
        buttonNames={buttonNames}
        page={character.page}
        setPage={setPage}
      />
      <Page page={character.page} setCharPage={setCharPage} charID={charID} />
    </div>
  ) : (
    <Loading />
  );
};

const Create = () => {
  const { current_character } = useSelector(state => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    let uuid = current_character;
    if (!uuid) {
      uuid = dispatch(startCharacter());
    }
  }, []);

  return (
    <div className="create">
      <Header />
      <div className="container-fluid">
        {current_character ? (
          <PageViewer charID={current_character} />
        ) : (
          'NOCHAR'
        )}
      </div>
    </div>
  );
};

export default Create;
