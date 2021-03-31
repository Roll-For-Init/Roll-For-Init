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

const PageViewer = ({ charID }) => {
  let pages;
  const character = useSelector(state => state.characters[charID]);
  const [page, setPage] = useState({ name: 'race', index: 0 });

  const onPageChange = (page, index) => {
    setPage({ name: page, index: index });
    window.scrollTo(0, 0);
  };
  /*FOR DEBUGGING ONLY 
useEffect(() => {
  console.log("in useeffect");
  const fetchData = async () => {
    let apiData = {dummy: "stupid"}
    apiData = await backgroundCaller("/api/backgrounds/acolyte");
  }
  fetchData();
}, []);
*/

  const getPage = page => {
    switch (page.name) {
      case 'race':
        pages = <Race setPage={setPage} page={page} charID={charID} />;
        break;
      case 'class':
        pages = <Class setPage={setPage} page={page} charID={charID} />;
        break;
      case 'abilities':
        pages = <Abilities setPage={setPage} page={page} charID={charID} />;
        break;
      case 'background':
        pages = <Background setPage={setPage} page={page} charID={charID} />;
        break;
      case 'description':
        pages = <Descriptions setPage={setPage} page={page} charID={charID} />;
        break;
      case 'equipment':
        pages = <Equipment setPage={setPage} page={page} charID={charID} />;
        break;
      case 'spells':
        pages = <Spells setPage={setPage} page={page} charID={charID} />;
        break;
    }
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
      <div className="col-3 d-none d-md-block side-bar overflow-auto scroll">
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
      <div className="col-3 offset-md-9 d-none d-md-block side-bar overflow-auto p-0">
        <div className="right-side-bar-container">
          {charRace !== null && (
            <div className="card content-card card-title">
              <h5>
                {charRace !== null &&
                  (charRace.subrace?.index
                    ? `${charRace.subrace.index} `
                    : `${charRace.index} `)}
                {charClass !== null && `${charClass.index}`}
              </h5>
            </div>
          )}
          <div className="race-silhouette-container">
            {charRace !== null && (
              <img
                src={raceSilhouettes[`${charRace.index.toLowerCase()}.png`]}
              />
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
          {charRace !== null && (
            <div className="card content-card side-bar-card scroll">
              {page.name === 'race' && charRace !== null && (
                <p className="mb-0">
                  Half-Orcs are known for their power and fortitude, and so
                  often use their great Strength to excel in the Barbarian or
                  Paladin professions. Many see them as brutish, but their
                  incredible Constitution also lends well to healing in the
                  midst of battle.
                </p>
              )}
              {page.name === 'class' &&
                (charClass !== null ? (
                  <p className="mb-0">
                    Clerics are known for their great Wisdom and close
                    connection to their deity, through which they can cast
                    powerful healing magic and offensive spells. Their sheer
                    versatility is both daunting to their enemies and widely
                    sought-after by future allies.
                  </p>
                ) : (
                  <p className="mb-0">
                    Half-Orcs are known for their power and fortitude, and so
                    often use their great Strength to excel in the Barbarian or
                    Paladin professions. Many see them as brutish, but their
                    incredible Constitution also lends well to healing in the
                    midst of battle.
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
      <MobileMenu
        buttonNames={buttonNames}
        page={page}
        pages={pages}
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
  const dispatch = useDispatch();

  const [charID, setCharID] = useState('');

  useEffect(() => {
    const uuid = dispatch(startCharacter());
    setCharID(uuid);
    console.log(uuid);
  }, []);

  return (
    <div className="create">
      <Header />
      <div className="container-fluid">
        {charID ? <PageViewer charID={charID} /> : 'NOCHAR'}
      </div>
    </div>
  );
};

export default Create;
