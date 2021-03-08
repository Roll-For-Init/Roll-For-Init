import React, { useState , useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import { getBackgroundInfo } from '../../redux/actions';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Dropdown from '../shared/Dropdown';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch} from 'react-redux';
import {setBackground} from "../../redux/actions";



export const Background = ({charID, setPage}) => {
    const dispatch = useDispatch();

    const [backgrounds, setBackgrounds] = useState(null);
    //const { backgrounds } = props.backgrounds;

    const selectBackground = background => {
        dispatch(setBackground(charID, background[0]));
        if (background[0].index == 'custom') {
            setSelectionBg(background);
        }
        else {
            CharacterService.getBackgroundInfo(background[0]).then((bg) => {
                setSelectionBg([bg])
                console.log(bg)
                return bg
            })
            .then((bg) => {
                let equipment = {equipment: bg.starting_equipment};
                dispatch(setBackground(charID, equipment));
                dispatch(setBackground(charID, {proficiencies: bg.proficiencies}))    
            })
        }
    };

    const reducer = (state, newProp) => {
        let newState = {...state, ...newProp};
        dispatch(setBackground(charID, {choices: newState}));
        return newState;
    }

    useEffect(() => {
        CharacterService.getIndexedList("backgrounds").then((list) => {
            const custom = [{name: 'Custom', index: 'custom'}];
            setBackgrounds(custom.concat(list));
            dispatch(setBackground(charID, custom[0]));
            return custom;
        }).then((custom) => {
            setSelectionBg(custom);
        });
    }, []);
    
    const [selectionBg, setSelectionBg] = useState(null);
    const [userChoices, setUserChoices] = useReducer(reducer, {});
    const [selectionSk1, setSelectionSk1] = useState([]);
    const [selectionSk2, setSelectionSk2] = useState([]);
    const [selectionTlLg1, setSelectionTlLg1] = useState([]);
    const [selectionTlLg2, setSelectionTlLg2] = useState([]);

    const onNext = () => {
        props.setPage({ index: 3, name: 'description' });
        window.scrollTo(0, 0);
    };

    return (
        <div className="background">
             {backgrounds && selectionBg && (
                 <>
                <div className="mx-auto d-none d-md-flex title-back-wrapper">
                    <h2 className="title-card p-4">Background</h2>
                </div>
                <div className="card content-card description-card m-0 mt-4">
                    Choose a preset background, or create your own. Your background
                    reveals where you came from. how you became an adventurer, and
                    your place in the world. If you create a custom background, work
                    with your GM to build one that makes sense for your character.
                </div>
                <div className="card translucent-card">
                    <Dropdown
                        title="Custom"
                        items={[
                            ...backgrounds,
                        ]}
                        width="70%"
                        selection={selectionBg}
                        setSelection={selectBackground}
                        classname="header"
                    />
                    {selectionBg[0].index === 'custom' && (
                        <div className="card content-card card-subtitle">
                            <form style={{ padding: '0px 5px' }}>
                                <input
                                    className="p-0 m-0"
                                    style={{ border: 'none', width: '100%' }}
                                    type="text"
                                    name="backgroundName"
                                    placeholder="Background Name"
                                />
                            </form>
                        </div>
                    )}
                    <div className="card content-card description-card mb-0">
                        {selectionBg[0].index === 'custom' ? (
                            <form>
                                <textarea
                                    className="p-0 m-0"
                                    style={{
                                        background: '#f2e9d9',
                                        border: 'none',
                                        width: '100%',
                                    }}
                                    type="text"
                                    name="backgroundDesc"
                                    placeholder="Background Description (optional)"
                                />
                            </form>
                        ) : (
                            <ReactReadMoreReadLess
                                charLimit={250}
                                readMoreText="Show more"
                                readLessText="Show less"
                                readMoreClassName="read-more-less--more"
                                readLessClassName="read-more-less--less"
                            >
                                {selectionBg[0].desc.join('\n')}
                            </ReactReadMoreReadLess>
                        )}
                    </div>
                </div>
                {selectionBg[0].index != 'custom' && (
                    <div className="card translucent-card">
                        <div className="card content-card card-title">
                            <h4>Background Options</h4>
                        </div>
                        <div className="choice-container">
                            {selectionBg[0].options.map((option,index) => {
                                    return (
                                    <Dropdown
                                        title={`Choose ${option.choose}: ${option.header}`}
                                        items={option.options}
                                        selectLimit={option.choose}
                                        multiSelect
                                        selection={userChoices[`dropdown-${index}`]}
                                        setSelection={setUserChoices}
                                        classname="choice"
                                        stateKey={`${option.header.toLowerCase().replace(' ','-')}-${index}`}
                                    />)
                                })}
                        </div>
                    </div>
                )}
 
                <div className="card translucent-card">
                    <div className="card content-card card-title">
                        <h4>Proficiencies</h4>
                    </div>
                    {selectionBg[0].index === 'custom' && (
                        <div className="choice-container">
                            <>
                            <Dropdown
                                title="Choose a Skill"
                                items={[]}
                                selection={selectionSk1}
                                setSelection={setSelectionSk1}
                                classname="choice"
                            />
                            <Dropdown
                                title="Choose a Skill"
                                items={[]}
                                selection={selectionSk2}
                                setSelection={setSelectionSk2}
                                classname="choice"
                            />
                            </>
                    </div>
                    )}
                    <div className="choice-container">
                        {selectionBg[0].index == 'custom' && (
                            <>
                                <Dropdown
                                    title="Choose a Tool or Language"
                                    items={[]}
                                    selection={selectionTlLg1}
                                    setSelection={setSelectionTlLg1}
                                    classname="choice"
                                />
                                <Dropdown
                                    title="Choose a Tool or Language"
                                    items={[]}
                                    selection={selectionTlLg2}
                                    setSelection={setSelectionTlLg2}
                                    classname="choice"
                                />
                            </>
                        )}
                        {selectionBg[0].index != 'custom' && (
                            <div className="card content-card description-card">
                            {
                            Object.keys(selectionBg[0].proficiencies).map((key) => {
                              return(
                              <p className="text-capitalize">
                                <strong className="small-caps">{key}</strong> - {selectionBg[0].proficiencies[key].map((prof, index) => {
                                  if(selectionBg[0].proficiencies[key].length === index+1) return `${prof}`;
                                  else return `${prof}, `;
                                  })}
                              </p>
                              )
                              
                            })}
                          </div>
                        )}
                    </div>
                </div>
                <div className="card translucent-card">
                    <div className="card content-card card-title">
                        <h4>Background Feature</h4>
                    </div>
                    {selectionBg[0].index === 'custom' && (
                        <div className="card content-card description-card">
                            Background features are normally soft skills that can
                            help you outside of combat. Background features can help
                            you with social interactions, give you knowledge about a
                            certain topic, or give you resources to otherwise give
                            you an upper hand in specific situations. If you create
                            a custom feature, work with your GM to ensure it makes
                            sense for your character.
                        </div>
                    )}
                    <div className="card content-card card-subtitle">
                        {selectionBg[0].index === 'custom' ? (
                            <form style={{ padding: '0px 5px' }}>
                                <input
                                    className="p-0 m-0"
                                    style={{ border: 'none', width: '100%' }}
                                    type="text"
                                    name="featName"
                                    placeholder="Feature Name"
                                />
                            </form>
                        ) : (
                            selectionBg[0].feature.name
                        )}
                    </div>
                    <div className="card content-card description-card mb-0">
                        {selectionBg[0].index === 'custom' ? (
                            <form>
                                <textarea
                                    style={{
                                        background: '#f2e9d9',
                                        border: 'none',
                                        width: '100%',
                                    }}
                                    type="text"
                                    name="featDesc"
                                    placeholder="Feature Description"
                                />
                            </form>
                        ) : (
                            <ReactReadMoreReadLess
                                charLimit={240}
                                readMoreText="Show more"
                                readLessText="Show less"
                                readMoreClassName="read-more-less--more"
                                readLessClassName="read-more-less--less"
                            >
                                {selectionBg[0].feature.desc.join('\n')}
                            </ReactReadMoreReadLess>
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
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    backgrounds: state.createCharacter,
});

const mapDispatchToProps = dispatch => ({
    selectBackground: background => dispatch(getBackgroundInfo(background)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Background);
