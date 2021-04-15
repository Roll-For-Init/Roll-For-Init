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

import { startCharacter, setPage} from '../../redux/actions/';

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
    <div className="col-md-6 offset-md-3 pb-0 pt-md-3 container">
    {currentPage}
    </div>
  );
};

const Buttons = ({ page, onPageChange, charRace, charClass, raceIconsOffWhite, raceIconsMedBlue, classIconsOffWhite, classIconsMedBlue }) => {
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
      </React.Fragment>
    )
  );
};

const PageViewer = ({ charID}) => {
  const character = useSelector(state => state.characters[charID]);

  const dispatch = useDispatch();
  const setCharPage = (name, index) => {
    dispatch(setPage(charID, { ...name, ...index }));
  };

  const [totalProficiencies, setTotalProficiencies] = useState(null);

  const onPageChange = (page, index) => {
    const payload = { name: page, index: index };
    dispatch(setPage(charID, payload));
    window.scrollTo(0, 0);
  };

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

  const fluffText = [
    {
      type: 'race',
      contents: [
        {
          index: 'half-orc',
          info:
            'Half-Orcs are known for their power and fortitude, and use their great Strength to excel as Barbarians and Paladins. Many see them as brutish, but their incredible Constitution also lends well to healing in the midst of battle.',
        },
        {
          index: 'half-elf',
          info:
            'A jack of all trades due to their split heritage, Half-Elves can be found in all professions, and will excel at any of them. They are especially Charismatic due to their Elven sides, however, and are known for their negotiation skills.',
        },
        {
          index: 'high elf',
          info:
            'High-Elves are known for their craftsmanship and Dexterous ability as Fighters, Monks, Rangers, and Rogues. Their long lifespans may make them alluring and arrogant in equal measure, but they are a great addition to any party.',
        },
        {
          index: 'dragonborn',
          info:
            'Dragonborn have inherited a tough, scaly hide and fearsome appearance from their ancestors, and are proud of it. Their great Strength and Charismatic character make them intimidating Paladins, Barbarians, and Warlocks.',
        },
        {
          index: 'hill dwarf',
          info:
            'Known for their short stature, Hill Dwarves’ high Constitution and Wisdom have served them well as miners and blacksmiths. With their incredible resilience, many pursue the life of an adventurer as a Paladin or spellcaster. ',
        },
        {
          index: 'lightfoot halfling',
          info:
            'Highly Dexterous and Charismatic, Lightfoot Halflings often serve as Clerics, Rogues, Rangers, or Warlocks. Their nomadic natures make them common companions on the road, but they should always be watched for their sticky fingers.',
        },
        {
          index: 'rock gnome',
          info:
            'Despite being the smallest of the land’s races, Rock Gnomes are not to be underestimated. They have a hardy Constitution and Intelligence in spades, which alongside their endless curiosity makes for a fine Wizard.',
        },
        {
          index: 'human',
          info:
            'Underestimated for their plain appearance, Humans often surprise opponents with their versatility and sheer determination. They can be found in all walks of life, and are some of the most common adventurers in the land.',
        },
        {
          index: 'tiefling',
          info:
            'Tieflings have a fearsome reputation for their cunning and silver tongues. However, they aren’t all as their demonic heritage suggests; with high Intelligence and Charisma, they are staunch allies as Paladins, Bards, Warlocks, and Sorcerers.',
        },
      ],
    },
    {
      type: 'class',
      contents: [
        {
          index: 'cleric',
          info:
            'Clerics are known for great Wisdom and a strong connection to their deity, through which they can cast powerful healing magic. Those with a deity of the LIfe domain are especially good healers, and are vital to many adventuring parties.',
          stats: 'Wisdom and Constitution',
        },
        {
          index: 'fighter',
          info:
            'Though the stereotype is a swordsman with great Strength, Fighters may wield any weapon, many of which require some finesse and thus high Dexterity to master. They are powerful, and the archetypal adventurer for good reason.',
          stats: 'Strength and Dexterity',
        },
        {
          index: 'sorcerer',
          info:
            'Sorcerers are the only innate spellcasters, inheriting it from a variety of sources such as draconic ancestry. They use their Charisma to fuel their magic and can alter spells to their whims, making them incredibly versatile.',
          stats: 'Charisma and Constitution',
        },
        {
          index: 'wizard',
          info:
            'Wizards study for years to be able to wield magic and use their high Intelligence to do so. They are also quick on the uptake and can replicate spells they say. This alongside their heavy tomes gives them an impressive repertoire.',
          stats: 'Intelligence and Constitution',
        },
        {
          index: 'warlock',
          info:
            'Bestowed great power by dark forces, Warlocks have a Fiendish patron on their side which may influence the world in their favor. They use their Charisma in their magic, and are often seen with a familiar, tome, or blade granted by their patron.',
          stats: 'Charisma and Constitution',
        },
        {
          index: 'druid',
          info:
            'Druids are one with nature, and they straddle the line of man and beast, shapeshifting at will between the two. They use their Wisdom of the world in their spellcasting. Their magic reflects their roots and the land they once come from.',
          stats: 'Strenth and Wisdom',
        },
        {
          index: 'rogue',
          info:
            'Rogues are swift and silent, and a good one is never seen. They use their Dexterity for sneak attacks and pickpocketing, and the most highly-regarded Rogues are near-impossible to hit. No lock is safe with one in your party.',
          stats: 'Dexterity and Intelligence',
        },
        {
          index: 'paladin',
          info:
            'Paladins fight with their Strength in the name of their principles, dealing deadly strikes to their foes and laying healing hands on their allies. Their devotion wards away Fiends and the Undead, and they can cast some spells with the power of their Charisma.',
          stats: 'Strength and Charisma',
        },
        {
          index: 'monk',
          info:
            'Monks are masters of martial arts and use their Ki and Dexterity to attack more quickly, deflect projectiles, and evade enemies. Their Wisdom grants them protection in lieu of armor. Those of the Way of the Open Hand can even use their enemies’ Ki against them.',
          stats: 'Dexterity and Wisdom',
        },
        {
          index: 'ranger',
          info:
            'Rangers are bridges between civilization and the wilderness, and use their Dexterity to traverse treacherous environments and deal deadly blows. Those of the Hunter specialize in downing specific foes. They can cast some spells with their Wisdom of the world.',
          stats: 'Dexterity and Wisdom',
        },
        {
          index: 'barbarian',
          info:
            'Barbarians use their extreme Strength in combat, and are a go-to for when an enemy needs to stay down for good. They are in tune with their instincts and often fight without thought to the consequences. Their sheer Constitution substitutes for armor.',
          stats: 'Strength and Constitution',
        },
        {
          index: 'bard',
          info:
            'Bards are musicians and performers who use their Charisma to cast support magic and their strength of personality to inspire their companions during combat. Those from the College of Lore are well-read, granting them additional conversational and spellcasting prowess.',
          stats: 'Charisma and Dexterity',
        },
      ],
    },
    {
      type: 'background',
      contents:
        'Adventurers come from all walks of life. They need only a reason and a means to call themselves an adventurer. Whether they are spreading the word of their religion, running from a dark past, or simply exploring the world, any can have great renown.',
    },
    {
      type: 'description',
      contents:
        'Adventurers come in all shapes and sizes, and no two are alike. Hasty or cautious, cunning or careless, just or selfish, all have something to contribute to their parties. Their alignment informs their reasoning and mannerisms, but is by no means the only indicator of their character.',
    },
  ];

  function getFluffContents(currentPage, name) {
    return fluffText.map(pageType =>
      pageType.type === currentPage && Array.isArray(pageType.contents)
        ? pageType.contents.map(
            item => item.index === name.toLowerCase() && item.info
          )
        : pageType.contents
    );
  }

  const charRace = useSelector(state => state.characters[charID].race);
  const charClass = useSelector(state => state.characters[charID].class);
  const charEquipment = useSelector(
    state => state.characters[charID].equipment
  );
  const charSpells = useSelector(state => state.characters[charID].spells);

  return character ? (
    <div className="row position-relative" style={{ top: '45px' }}>
      <div className="col-3 d-none d-md-block side-bar overflow-auto">
        <div className="btn-group-vertical w-100" role="group">
          
          <Buttons page={character.page} onPageChange={onPageChange} charRace={charRace} charClass={charClass} raceIconsOffWhite={raceIconsOffWhite} raceIconsMedBlue={raceIconsMedBlue} classIconsOffWhite={classIconsOffWhite} classIconsMedBlue={classIconsMedBlue}/>
          {character.class?.spellcasting?.level <= 1 && (
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
      <div className="col-3 offset-md-9 d-none d-md-block side-bar overflow-auto p-0">
        <div className="right-side-bar-container">
          {charRace !== null && (
            <div className="card content-card card-title">
              <h5>
                {charRace !== null &&
                  (charRace.subrace
                    ? `${charRace.subrace} `
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
              {character.page.name === 'race' && charRace !== null && (
                <p>
                  {console.log(fluffText[0], charRace)}
                  {
                    fluffText[0].contents.find(
                      fluffRace =>
                        fluffRace.index ===
                        (charRace.subrace
                          ? charRace.subrace.toLowerCase()
                          : charRace.index.toLowerCase())
                    ).info
                  }
                </p>
              )}
              {character.page.name === 'class' && charClass !== null && (
                <p>
                  {
                    fluffText[1].contents.find(
                      fluffClass =>
                        fluffClass.index === charClass.index.toLowerCase()
                    ).info
                  }
                </p>
              )}
              {character.page.name === 'abilities' && charClass !== null && (
                <p>
                  {`To specialize or to diversify--this is a dilemma many an
                  adventurer has faced. While ${
                    charClass.index
                  } performs best with high
                  ${
                    fluffText[1].contents.find(
                      fluffClass =>
                        fluffClass.index === charClass.index.toLowerCase()
                    ).stats
                  }, it’s up to the individual what their strengths (and
                  weaknesses) will be. However, some extra Constitution never
                  hurts.`}
                </p>
              )}
              {character.page.name === 'background' && <p>{fluffText[2].contents}</p>}
              {character.page.name === 'description' && <p>{fluffText[3].contents}</p>}
              {character.page.name === 'equipment' && charEquipment !== null && (
                <ul className="shortlist">
                  <h6 className="card-subtitle small-caps">
                    Starting Equipment
                  </h6>
                  {charEquipment.set &&
                    charEquipment.set.map((equip, idx) => {
                      return (
                        <li key={`equip-set-${idx}`}>
                          <p>{equip.equipment.name}</p>
                        </li>
                      );
                    })}
                  {charEquipment.choices &&
                    Object.keys(charEquipment.choices).map((equipment, idx) => {
                      let equip = charEquipment.choices
                        ? charEquipment.choices[equipment]
                        : null;
                      if (equip) {
                        if (equip.equipment?.name)
                          return (
                            <li key={`equip-choice-${idx}`}>
                              <p>{equip?.equipment?.name}</p>
                            </li>
                          );
                        else {
                          let items = [];
                          if (Array.isArray(equip.equipment)) {
                            items = items.concat(equip.equipment.map(
                              (item, idx2) => {
                                return (
                                  item.name ?
                                  <li key={`equip-select-${idx}-${idx2}`}>
                                    <p>{item.name}</p>
                                  </li>
                                  :
                                  <></>
                                );
                              }
                            ));
                          }
                          if (equip.selection)
                            items = items.concat(Object.keys(equip.selection).map(
                              selection => {
                                return equip.selection[selection].map(
                                  (item, idx) => {
                                    return (
                                      <li key={`equip-select-${idx}`}>
                                        <p>{item.name}</p>
                                      </li>
                                    );
                                  }
                                );
                              }
                            ));
                          return items;
                        }
                      }
                    })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <MobileMenu
        buttonNames={buttonNames}
        page={character.page}
        setPage={setPage}
        charID={charID}
      />
      <Page page={character.page} setCharPage={setCharPage} charID={charID} raceIconsOffWhite={raceIconsOffWhite} raceIconsMedBlue={raceIconsMedBlue} classIconsOffWhite={classIconsOffWhite} classIconsMedBlue={classIconsMedBlue}/>
      {/*<div className="col-md-6 offset-md-3 pb-0 pt-md-3 container">
        {/*charID ? character.page : <Loading />}
      </div>*/}
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
