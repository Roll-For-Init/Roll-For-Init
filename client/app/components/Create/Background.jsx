import React, { useState, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import getBackgroundInfo from '../../redux/services/character.service';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setBackground } from '../../redux/actions';
import FloatingLabel from 'floating-label-react';

export const Background = ({ charID, setPage }) => {
  const dispatch = useDispatch();

  const [backgrounds, setBackgrounds] = useState(null);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [gamingSets, setGamingSets] = useState([]);
  const [otherTools, setOtherTools] = useState([]);
  const [artisansTools, setArtisansTools] = useState([]);
  const [musicalInstruments, setMusicalInstruments] = useState([]);
  const [kits, setKits] = useState([]);
  const [landVehicles, setLandVehicles] = useState([]);
  //const [mountsVehicles, setMountsVehicles] = useState([]);
  //const [drawnVehicles, setDrawnVehicles] = useState([]);
  const [waterVehicles, setWaterVehicles] = useState([]);

  const selectBackground = background => {
    dispatch(setBackground(charID, background[0]));
    if (background[0].index == 'custom') {
      setSelectionBg(background);
      dispatch(setBackground(charID, { equipment: [] }));
      dispatch(setBackground(charID, { equipment_options: [] }));
    } else {
      CharacterService.getBackgroundInfo(background[0])
        .then(bg => {
          setSelectionBg([bg]);
          return bg;
        })
        .then(bg => {
          let equipment = { equipment: bg.starting_equipment };
          if (bg.other_equipment) {
            equipment.equipment = equipment.equipment.concat(bg.other_equipment)
          }
          dispatch(setBackground(charID, equipment));
          dispatch(
            setBackground(charID, { equipment_options: bg.equipment_options })
          );
          dispatch(setBackground(charID, { proficiencies: bg.proficiencies }));
          let personality = {
            traits: bg.personality_traits,
            ideals: bg.ideals,
            bonds: bg.bonds,
            flaws: bg.flaws,
          };
          dispatch(setBackground(charID, { description: personality }));
          dispatch(setBackground(charID, { desc: bg.desc }))
        });
    }
  };

  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    dispatch(setBackground(charID, { choices: newState }));
    return newState;
  };

  useEffect(() => {
    CharacterService.getIndexedList('backgrounds')
      .then(list => {
        const custom = [{ name: 'Custom', index: 'custom', equipment: [] }];
        setBackgrounds(custom.concat(list));
        dispatch(setBackground(charID, custom[0]));
        dispatch(setBackground(charID, { equipment: [] }));
        dispatch(setBackground(charID, { equipment_options: [] }));
        return custom;
      })
      .then(custom => {
        setSelectionBg(custom);
      });
    CharacterService.getIndexedList('skills').then(list => {
      setSkills(list);
    });
    CharacterService.getIndexedList('languages').then(list => {
      setLanguages(list);
    });
    CharacterService.getSubList('equipment-categories/artisans-tools').then(
      list => {
        setArtisansTools(list.equipment);
      }
    );
    CharacterService.getSubList('equipment-categories/other-tools').then(
      list => {
        setOtherTools(list.equipment);
      }
    );
    CharacterService.getSubList('equipment-categories/gaming-sets').then(
      list => {
        setGamingSets(list.equipment);
      }
    );
    CharacterService.getSubList(
      'equipment-categories/musical-instruments'
    ).then(list => {
      setMusicalInstruments(list.equipment);
    });
    CharacterService.getSubList('equipment-categories/kits').then(list => {
      setKits(list.equipment);
    });
    CharacterService.getSubList('equipment-categories/land-vehicles').then(
      list => {
        setLandVehicles(list.equipment);
      }
    );
    // CharacterService.getSubList(
    //   'equipment-categories/mounts-and-vehicles'
    // ).then(list => {
    //   setMountsVehicles(list.equipment);
    // });
    // CharacterService.getSubList(
    //   'equipment-categories/tack-harness-and-drawn-vehicles'
    // ).then(list => {
    //   setDrawnVehicles(list.equipment);
    // });
    CharacterService.getSubList(
      'equipment-categories/waterborne-vehicles'
    ).then(list => {
      setWaterVehicles(list.equipment);
    });
  }, []);

  const [selectionBg, setSelectionBg] = useState(null);
  const [userChoices, setUserChoices] = useReducer(reducer, {});
  const [selectionSk1, setSelectionSk1] = useState([]);
  const [selectionSk2, setSelectionSk2] = useState([]);
  const [selectionTlLg1, setSelectionTlLg1] = useState([]);
  const [selectionTlLg2, setSelectionTlLg2] = useState([]);
  const [bgName, setBgName] = useState('');
  const [bgDesc, setBgDesc] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');

  const onNext = () => {
    if (selectionBg[0].index == 'custom') {
      let customBackground = {
        proficiencies: {
          Tools: [],
          Languages: [],
          Skills: [...selectionSk1],
          Armor: []
        },
        name: bgName,
        desc: bgDesc,
        feature: {
          name: featureName,
          desc: featureDesc,
        },
      };
      for (let selection of selectionTlLg1) {
        if (selection.url.includes('language')) {
          customBackground.proficiencies.Languages.push(selection.name);
        } else {
          customBackground.proficiencies.Tools.push(selection.name);
        }
      }
      dispatch(setBackground(charID, customBackground));
    }
    setPage({ index: 4, name: 'description' });
    window.scrollTo(0, 0);
  };
  const skill = ['animal handling', 'acrobatics', 'elvish'];

  return (
    <div className="background">
      {backgrounds && selectionBg ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Background</h2>
          </div>
          <div className="card content-card description-card m-0 mt-4">
            <p>
              Choose a preset background, or create your own. Your background
              reveals where you came from. how you became an adventurer, and
              your place in the world. If you create a custom background, work
              with your GM to build one that makes sense for your character.
            </p>
          </div>
          <div className="card translucent-card">
            <div className="dd-container mt-0">
              <Dropdown
                ddLabel="Background"
                title="Custom"
                items={[...backgrounds]}
                width="70%"
                selection={selectionBg}
                setSelection={selectBackground}
                classname="header"
              />
            </div>
            {selectionBg[0].index === 'custom' && (
              <div className="card content-card card-subtitle">
                <FloatingLabel
                  id="backgroundName"
                  name="backgroundName"
                  placeholder="Background Name"
                  type="text"
                  value={bgName}
                  onChange={e => setBgName(e.target.value)}
                />
              </div>
            )}
            <div className="card content-card description-card mb-0">
              {selectionBg[0].index === 'custom' ? (
                <p>
                  <FloatingLabel
                    component="textarea"
                    id="backgroundDesc"
                    name="backgroundDesc"
                    placeholder="Background Description (optional)"
                    type="text"
                    value={bgDesc}
                    onChange={e => setBgDesc(e.target.value)}
                  />
                </p>
              ) : (
                <p>
                  <ReactReadMoreReadLess
                    charLimit={250}
                    readMoreText="Show more"
                    readLessText="Show less"
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {selectionBg[0].desc.join('\n')}
                  </ReactReadMoreReadLess>
                </p>
              )}
            </div>
          </div>
          {selectionBg[0].index != 'custom' && (
            <div className="card translucent-card">
              <div className="card content-card card-title">
                <h4>Background Options</h4>
              </div>
              {selectionBg[0].options.map((option, index) => {
                return (
                  <div className="dd-container" key={index}>
                    <Dropdown
                      ddLabel={`${option.header}`}
                      title={`Choose ${option.choose}`}
                      items={option.options.filter(
                        item =>
                          !skill.includes(item.name.toString().toLowerCase())
                      )}
                      selectLimit={option.choose}
                      multiSelect={option.choose > 1}
                      selection={
                        userChoices[
                          `${option.header.toLowerCase().replace(' ', '-')}-${
                            option.type
                          }-${index}`
                        ]
                      }
                      setSelection={setUserChoices}
                      classname="dd-choice"
                      stateKey={`${option.header
                        .toLowerCase()
                        .replace(' ', '-')}-${option.type}-${index}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {(selectionBg[0].index === 'custom' || selectionBg[0].proficiencies?.size) &&
            <div className="card translucent-card">
              <div className="card content-card card-title">
                <h4>Proficiencies</h4>
              </div>
              {selectionBg[0].index === 'custom' && (
                <div className="dd-container">
                  <Dropdown
                    ddLabel="Extra Skills"
                    title="Choose 2"
                    items={[...skills].filter(
                      item => !skill.includes(item.name.toString().toLowerCase())
                    )}
                    // items={[...skills]}
                    selection={selectionSk1}
                    multiSelect
                    selectLimit={2}
                    setSelection={setSelectionSk1}
                    classname="dd-choice"
                  />
                </div>
              )}
              {selectionBg[0].index === 'custom' && (
                <div className="dd-container">
                  <Dropdown
                    ddLabel="Tools &#38; Languages"
                    title="Choose 2"
                    items={[
                      ...languages,
                      ...artisansTools,
                      ...gamingSets,
                      ...musicalInstruments,
                      ...otherTools,
                      ...kits
                    ].filter(
                      item =>
                        !skill.includes(item.name.toString().toLowerCase())
                    )}
                    selection={selectionTlLg1}
                    multiSelect
                    selectLimit={2}
                    setSelection={setSelectionTlLg1}
                    classname="dd-choice"
                  />
                </div>
              )}
              {selectionBg[0].index !== 'custom' && (
                <div className="card content-card description-card mb-0">
                  <p>
                    {Object.keys(selectionBg[0].proficiencies).map(key => {
                      return (
                        selectionBg[0].proficiencies[key].length > 0 && (
                          <p className="text-capitalize" key={key}>
                            <strong className="small-caps">{`Extra ${key}`}</strong>{' '}
                            -{' '}
                            {selectionBg[0].proficiencies[key].map(
                              (prof, index) => {
                                if (
                                  selectionBg[0].proficiencies[key].length ===
                                  index + 1
                                )
                                  return `${prof}`;
                                else return `${prof}, `;
                              }
                            )}
                          </p>
                        )
                      );
                    })}
                  </p>
                </div>
              )}
            </div>
          }
          <div className="card translucent-card">
            <div className="card content-card card-title">
              <h4>Background Feature</h4>
            </div>
            {selectionBg[0].index === 'custom' && (
              <div className="card content-card description-card">
                <p>
                  Background features are normally soft skills that can help you
                  outside of combat. Background features can help you with
                  social interactions, give you knowledge about a certain topic,
                  or give you resources to otherwise give you an upper hand in
                  specific situations. If you create a custom feature, work with
                  your GM to ensure it makes sense for your character.
                </p>
              </div>
            )}
            <div className="card content-card card-subtitle">
              {selectionBg[0].index === 'custom' ? (
                <FloatingLabel
                  id="featName"
                  name="featName"
                  placeholder="Feature Name"
                  type="text"
                  value={featureName}
                  onChange={e => setFeatureName(e.target.value)}
                />
              ) : (
                selectionBg[0].feature.name
              )}
            </div>
            <div className="card content-card description-card mb-0">
              {selectionBg[0].index === 'custom' ? (
                <p>
                  <FloatingLabel
                    component="textarea"
                    id="featDesc"
                    name="featDesc"
                    placeholder="Feature Description"
                    type="text"
                    value={featureDesc}
                    onChange={e => setFeatureDesc(e.target.value)}
                  />
                </p>
              ) : (
                <p>
                  <ReactReadMoreReadLess
                    charLimit={240}
                    readMoreText="Show more"
                    readLessText="Show less"
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {selectionBg[0].feature.desc.join('\n')}
                  </ReactReadMoreReadLess>
                </p>
              )}
            </div>
          </div>
          <button
            className="text-uppercase btn-primary btn-lg px-5 btn-floating"
            onClick={onNext}
          >
            OK
          </button>
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

/*
const mapStateToProps = state => ({
  backgrounds: state.createCharacter,
});

const mapDispatchToProps = dispatch => ({
  selectBackground: background => dispatch(getBackgroundInfo(background)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Background);
*/
export default Background;
