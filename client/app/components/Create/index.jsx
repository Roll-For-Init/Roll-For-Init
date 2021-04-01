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
import { startCharacter } from '../../redux/actions/';
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

  const [currentPage, setCurrentPage] = useState(getPage(page));

  useEffect(() => {
    console.log('page', charID);
    let nextPage = getPage(page);
    setCurrentPage(nextPage);
  }, [page]);

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  }

  const raceIconsMedBlue = importAll(
    require.context(
      '../../../public/assets/imgs/icons/medium-blue/race',
      false,
      /\.(png)$/
    )
  );

  const classIconsMedBlue = importAll(
    require.context(
      '../../../public/assets/imgs/icons/medium-blue/class',
      false,
      /\.(png)$/
    )
  );

  const raceIconsOffWhite = importAll(
    require.context(
      '../../../public/assets/imgs/icons/off-white/race',
      false,
      /\.(png)$/
    )
  );

  const classIconsOffWhite = importAll(
    require.context(
      '../../../public/assets/imgs/icons/off-white/class',
      false,
      /\.(png)$/
    )
  );

  const raceSilhouettes = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/race',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesSlimShort = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/slim-short',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesSlimTall = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/slim-tall',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesWideShort = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/wide-short',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesWideTall = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/wide-tall',
      false,
      /\.(png)$/
    )
  );

  const buildDictionary = [
    { name: 'dragonborn', build: 'wide-tall' },
    { name: 'dwarf', build: 'wide-short' },
    { name: 'elf', build: 'slim-tall' },
    { name: 'gnome', build: 'slim-short' },
    { name: 'half-elf', build: 'slim-tall' },
    { name: 'half-orc', build: 'wide-tall' },
    { name: 'halfling', build: 'slim-short' },
    { name: 'human', build: 'slim-tall' },
    { name: 'tiefling', build: 'slim-tall' },
  ];

  const findBuild = raceName => {
    return buildDictionary.find(dictEntry => dictEntry.name === raceName).build;
  };

  function getBuildImage(raceName, className) {
    let buildImage;
    const build = findBuild(raceName);

    if (build === 'slim-tall') {
      buildImage = classSilhouettesSlimTall[`${className}.png`];
    } else if (build === 'slim-short') {
      buildImage = classSilhouettesSlimShort[`${className}.png`];
    } else if (build === 'wide-tall') {
      buildImage = classSilhouettesWideTall[`${className}.png`];
    } else if (build === 'wide-short') {
      buildImage = classSilhouettesWideShort[`${className}.png`];
    }

    return buildImage;
  }

  const charRace = useSelector(state => state.characters[charID].race);
  const charClass = useSelector(state => state.characters[charID].class);

  return (
    <div className="row position-relative" style={{ top: '45px' }}>
      <div className="col-3 d-none d-md-block side-bar overflow-auto">
        {/* <div className="side-bar-icon-container">
          {charRace !== null && (
            <div className="card content-card side-bar-icon-card">
              <div className="same-line">
                {charRace !== null && (
                  <img
                    className="side-bar-icon"
                    src={raceIconsMedBlue['dragonborn.png']}
                  />
                )}
                {charClass !== null && (
                  <img
                    className="side-bar-icon"
                    src={classIconsMedBlue['bard.png']}
                  />
                )}
              </div>
            </div>
          )}
        </div> */}
        <div className="btn-group-vertical w-100" role="group">
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
                  page.index > idx && onPageChange(name, idx);
                }}
              >
                {name}
                {name === 'race' && charRace !== null && (
                  <div className="button-icon-container">
                    <img
                      className="button-icon"
                      src={
                        page.name === name
                          ? raceIconsOffWhite[
                              `${charRace.index.toLowerCase()}.png`
                            ]
                          : raceIconsMedBlue[
                              `${charRace.index.toLowerCase()}.png`
                            ]
                      }
                    />
                  </div>
                )}
                {name === 'class' && charClass !== null && (
                  <div className="button-icon-container">
                    <img
                      className="button-icon"
                      src={
                        page.name === name
                          ? classIconsOffWhite[
                              `${charClass.index.toLowerCase()}.png`
                            ]
                          : classIconsMedBlue[
                              `${charClass.index.toLowerCase()}.png`
                            ]
                      }
                    />
                  </div>
                )}
              </button>
            );
          })}
          {character.class?.spellcasting && (
            <button
              key="spells"
              type="button"
              className={
                page.name === 'spells'
                  ? 'btn btn-lg btn-primary menu-button active'
                  : 'btn btn-lg btn-secondary menu-button'
              }
              disabled={page.index < 6}
              onClick={() => {
                page.index > 6 && onPageChange('spells', 6);
              }}
            >
              spells
            </button>
          )}
        </div>
      </div>

      <div className="col-3 offset-md-9 d-none d-md-block side-bar overflow-auto">
        <div className="race-silhouette-container">
          {charRace !== null && (
            <img src={raceSilhouettes[`${charRace.index.toLowerCase()}.png`]} />
          )}
          {charClass !== null && (
            <img
              src={getBuildImage(
                charRace.index.toLowerCase(),
                charClass.index.toLowerCase()
              )}
            />
          )}
        </div>
      </div>

      <MobileMenu
        buttonNames={buttonNames}
        page={character.page}
        setPage={setPage}
        charID={charID}
      />
      <div className="col-md-6 offset-md-3 pb-0 pt-md-3 container">
        {charID ? pages : <Loading />}
      </div>
      {/* <div className="col-3 p-4 container overflow-auto">
      {selectedInfo ? (
        <SidePanel />
      ) : (
        <div className="card mt-5 p-5 side-bar">
          <div className="card-header">
            <h4>Nothing Is Selected</h4>
          </div>
        </div>
      )}
    </div> */}
    </div>
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
