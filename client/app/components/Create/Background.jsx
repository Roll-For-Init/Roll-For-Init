import React, { useState, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import getBackgroundInfo from '../../redux/services/character.service';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setBackground } from '../../redux/actions';
import FloatingLabel from 'floating-label-react';

const BackgroundSelector = ({
  background,
  backgrounds,
  selectBackground,
  custom,
  customName,
  customDesc,
  setCustomName,
  setCustomDesc,
}) => {
  return (
    <>
      <div className="card translucent-card">
        <div className="dd-container mt-0">
          <Dropdown
            ddLabel="Background"
            title="Choose 1"
            items={backgrounds}
            width="70%"
            selection={background ? [background] : null}
            setSelection={bg => {
              selectBackground(bg);
            }}
            classname="header"
          />
        </div>
        {custom && (
          <div className="card content-card card-subtitle">
            <FloatingLabel
              id="backgroundName"
              name="backgroundName"
              placeholder="Background Name"
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
            />
          </div>
        )}
        {(background?.desc || custom) && (
          <div className="card content-card description-card mb-0">
            {custom ? (
              <p>
                <FloatingLabel
                  component="textarea"
                  id="backgroundDesc"
                  name="backgroundDesc"
                  placeholder="Background Description (optional)"
                  type="text"
                  value={customDesc}
                  onChange={e => setCustomDesc(e.target.value)}
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
                  {background.desc.join('\n')}
                </ReactReadMoreReadLess>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const Proficiencies = ({
  background,
  custom,
  skillOptions,
  skillChoices,
  setSkillChoices,
  toolAndLanguageOptions,
  toolAndLanguageChoices,
  setToolAndLanguageChoices,
}) => {
  return (
    <>
      {(custom || Object.values(background.proficiencies).some(p=>{return p.length})) && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>Proficiencies</h4>
          </div>
          {custom && (
            <div className="dd-container">
              <Dropdown
                ddLabel="Extra Skills"
                title="Choose 2"
                items={skillOptions}
                // items={[...skills]}
                selection={skillChoices}
                multiSelect
                selectLimit={2}
                setSelection={setSkillChoices}
                classname="dd-choice"
              />
            </div>
          )}
          {custom && (
            <div className="dd-container">
              <Dropdown
                ddLabel="Tools &#38; Languages"
                title="Choose 2"
                items={toolAndLanguageOptions}
                selection={toolAndLanguageChoices}
                multiSelect
                selectLimit={2}
                setSelection={setToolAndLanguageChoices}
                classname="dd-choice"
              />
            </div>
          )}
          {!custom && (
            <div className="card content-card description-card mb-0">
              <p>
                {Object.keys(background.proficiencies).map(key => {
                  return (
                    background.proficiencies[key].length > 0 && (
                      <p className="text-capitalize" key={key}>
                        <strong className="small-caps">{`Extra ${key}`}</strong>{' '}
                        -{' '}
                        {background.proficiencies[key].map((prof, index) => {
                          if (
                            background.proficiencies[key].length ===
                            index + 1
                          )
                            return `${prof}`;
                          else return `${prof}, `;
                        })}
                      </p>
                    )
                  );
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const BackgroundOptions = ({
  options,
  userChoices,
  setUserChoices,
  custom,
}) => {
  const skill = ['animal handling', 'acrobatics', 'elvish'];
  return (
    <>
      {!custom && options && (
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>Background Options</h4>
          </div>
          {options.map((option, index) => {
            return (
              <div className="dd-container" key={index}>
                <Dropdown
                  ddLabel={`${option.header}`}
                  title={`Choose ${option.choose}`}
                  items={option.options.filter(
                    item => !skill.includes(item.name.toString().toLowerCase())
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
                  stateKey={`${option.header.toLowerCase().replace(' ', '-')}-${
                    option.type
                  }-${index}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const FeatureDetails = ({
  background,
  featureName,
  featureDesc,
  setFeatureName,
  setFeatureDesc,
  custom,
}) => {
  return (
    <>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>Background Feature</h4>
        </div>
        {custom && (
          <div className="card content-card description-card">
            <p>
              Background features are normally soft skills that can help you
              outside of combat. Background features can help you with social
              interactions, give you knowledge about a certain topic, or give
              you resources to otherwise give you an upper hand in specific
              situations. If you create a custom feature, work with your GM to
              ensure it makes sense for your character.
            </p>
          </div>
        )}
        {(background?.feature?.name || custom) && (
          <div className="card content-card card-subtitle">
            {custom ? (
              <FloatingLabel
                id="featName"
                name="featName"
                placeholder="Feature Name"
                type="text"
                value={featureName}
                onChange={e => setFeatureName(e.target.value)}
              />
            ) : (
              background.feature.name
            )}
          </div>
        )}
        {(background?.feature?.desc || custom) && (
          <div className="card content-card description-card mb-0">
            {custom ? (
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
                  {background.feature.desc.join('\n')}
                </ReactReadMoreReadLess>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const customBackground = { name: 'Custom', index: 'custom', equipment: [] };

export const Background = ({ charID, setPage }) => {
  const dispatch = useDispatch();

  const background = useSelector(state => state.characters[charID].background);
  const character = useSelector(state => state.characters[charID]);

  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    dispatch(setBackground(charID, { choices: newState }));
    return newState;
  };

  const [userChoices, setUserChoices] = useReducer(
    reducer,
    background?.choices ?? {}
  );
  const [skillChoices, setSkillChoices] = useState(background?.proficiencies?.Skills ?? []);

  const [toolAndLanguageChoices, setToolAndLanguageChoices] = useState(background?.proficiencies?.Tools.concat(
    background?.proficiencies?.Languages.map((lang) => lang = {name: lang, index: lang.toLowerCase(), url: `api/languages/${lang.toLowerCase()}`})) 
    ?? []);

  /*useEffect(() => {
    const toolSelection = background?.proficiencies?.Tools ?? [];
    const languageSelection = background?.proficiencies?.Languages ?? [];
    setSkillChoices(background?.proficiencies?.Skills ?? []);
    setToolAndLanguageChoices(toolSelection.concat(languageSelection));
  }, [background]);*/

  useEffect(() => {
    if (!background || !toolAndLanguageChoices?.size || !skillChoices?.size)
      return;
    let languages = [];
    let tools = [];
    for (let choice of toolAndLanguageChoices) {
      if (choice?.url.includes('language')) {
        languages.push(choice);
      } else {
        tools.push(choice);
      }
    }
    dispatch(
      setBackground(charID, {
        proficiencies: {
          Skills: [...skillChoices],
          Tools: [...tools],
          Languages: [...languages],
        },
      })
    );
    console.log(background);
  }, [skillChoices, toolAndLanguageChoices]);

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

  const selectBackground = newBackground => {
    newBackground = newBackground[0];
    console.log("NEW BACKGROUND", newBackground)
    if (newBackground?.index == 'custom') {
      dispatch(setBackground(charID, null));
      dispatch(
        setBackground(charID, {
          ...newBackground,
          equipment_options: [],
          equipment: [],
        })
      );
      return;
    }
    CharacterService.getBackgroundInfo(newBackground).then(bg => {
        let equipment = { equipment: bg.starting_equipment };
        if (bg.other_equipment) {
          equipment.equipment = equipment.equipment.concat(bg.other_equipment)
        }
        equipment.equipment.push({...bg.starting_currency, category: 'currency'});
        let personality = {
          traits: bg.personality_traits,
          ideals: bg.ideals,
          bonds: bg.bonds,
          flaws: bg.flaws,
        };
        dispatch(setBackground(charID, {
          index: newBackground.index,
          name: newBackground.name,
          ...equipment,
          equipment_options: bg.equipment_options,
          proficiencies: bg.proficiencies,
          description: personality,
          desc: bg.desc,
          feature: bg.feature,
          options: bg.options
        }))
      });
  };

  useEffect(() => {
    if(!background) {
      dispatch(setBackground(charID, customBackground));
      dispatch(setBackground(charID, {
        equipment_options: [],
        equipment: [],
      }))
    } 

    CharacterService.getIndexedList('backgrounds').then(list => {
      setBackgrounds([customBackground, ...list]);
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

  const [customName, setCustomName] = useState(
    background?.name != "Custom" ? background?.name : ''
  );
  const [customDesc, setCustomDesc] = useState(background?.desc ?? '');
  const [customFeatureName, setCustomFeatureName] = useState(
    background?.feature?.name ?? ''
  );
  const [customFeatureDesc, setCustomFeatureDesc] = useState(
    background?.feature?.desc ?? ''
  );

  /*useEffect(() => {
    setCustomName(background?.name != "Custom" ? background?.name : '');
    setCustomDesc(background?.desc ?? '');
    setCustomFeatureName(background?.feature?.name ?? '');
    setCustomFeatureDesc(background?.feature?.desc ?? '');
  }, [background]);*/

  const onNext = () => {
    console.log(background);
    if (!background) return;
    if (background?.index == 'custom') {
      console.log(background);
      let customBackground = {
        proficiencies: {
          Tools: [],
          Languages: [],
          Skills: [...skillChoices],
          Armor: []
        },
        name: customName,
        desc: customDesc,
        feature: {
          name: customFeatureName,
          desc: customFeatureDesc,
        },
      };
      for (let selection of toolAndLanguageChoices) {
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
     {backgrounds ? (
      <>
        <div className="mx-auto d-none d-md-flex title-back-wrapper">
          <h2 className="title-card p-4">Background</h2>
        </div>
        <div className="card content-card description-card m-0 mt-4">
          <p>
            Choose a preset background, or create your own. Your background
            reveals where you came from. how you became an adventurer, and your
            place in the world. If you create a custom background, work with
            your GM to build one that makes sense for your character.
          </p>
        </div>
          <React.Fragment>
            <BackgroundSelector
              backgrounds={backgrounds}
              background={background}
              custom={background?.index === 'custom'}
              customName={customName}
              customDesc={customDesc}
              setCustomName={setCustomName}
              setCustomDesc={setCustomDesc}
              selectBackground={selectBackground}
            />
            {background?.index && (
              <>
                <BackgroundOptions
                  options={background.options}
                  userChoices={userChoices}
                  setUserChoices={setUserChoices}
                  custom={background?.index === 'custom'}
                />
                <Proficiencies
                  background={background}
                  custom={background?.index === 'custom'}
                  skillOptions={[...skills].filter(
                    item => !skill.includes(item.name.toString().toLowerCase())
                  )}
                  toolAndLanguageOptions={[
                    ...languages,
                    ...artisansTools,
                    ...gamingSets,
                    ...musicalInstruments,
                    ...otherTools,
                    ...kits,
                  ].filter(
                    item => !skill.includes(item.name.toString().toLowerCase())
                  )}
                  skillChoices={skillChoices}
                  setSkillChoices={setSkillChoices}
                  toolAndLanguageChoices={toolAndLanguageChoices}
                  setToolAndLanguageChoices={setToolAndLanguageChoices}
                />
                <FeatureDetails
                  background={background}
                  custom={background?.index === 'custom'}
                  featureName={customFeatureName}
                  featureDesc={customFeatureDesc}
                  setFeatureName={setCustomFeatureName}
                  setFeatureDesc={setCustomFeatureDesc}
                />
              </>
            )}
            <button
              className="text-uppercase btn-primary btn-lg px-5 btn-floating"
              onClick={onNext}
            >
              OK
            </button>
          </React.Fragment>
      </>
       ) : (
        'LOADING'
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
