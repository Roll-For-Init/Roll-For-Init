import React, { useState , useEffect} from 'react';
import { connect } from 'react-redux';
import { getBackgroundInfo } from '../../redux/actions';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Dropdown from '../shared/Dropdown';

const acolyte = {"index":"acolyte","name":"Acolyte","starting_proficiencies":[{"index":"skill-insight","name":"Skill: Insight","url":"/api/proficiencies/skill-insight"},{"index":"skill-religion","name":"Skill: Religion","url":"/api/proficiencies/skill-religion"}],"language_options":{"from":[{"index":"common","name":"Common","url":"/api/languages/common"},{"index":"dwarvish","name":"Dwarvish","url":"/api/languages/dwarvish"},{"index":"elvish","name":"Elvish","url":"/api/languages/elvish"},{"index":"giant","name":"Giant","url":"/api/languages/giant"},{"index":"gnomish","name":"Gnomish","url":"/api/languages/gnomish"},{"index":"goblin","name":"Goblin","url":"/api/languages/goblin"},{"index":"halfling","name":"Halfling","url":"/api/languages/halfling"},{"index":"orc","name":"Orc","url":"/api/languages/orc"},{"index":"abyssal","name":"Abyssal","url":"/api/languages/abyssal"},{"index":"celestial","name":"Celestial","url":"/api/languages/celestial"},{"index":"draconic","name":"Draconic","url":"/api/languages/draconic"},{"index":"deep-speech","name":"Deep Speech","url":"/api/languages/deep-speech"},{"index":"infernal","name":"Infernal","url":"/api/languages/infernal"},{"index":"primordial","name":"Primordial","url":"/api/languages/primordial"},{"index":"sylvan","name":"Sylvan","url":"/api/languages/sylvan"},{"index":"undercommon","name":"Undercommon","url":"/api/languages/undercommon"}],"choose":2,"type":"languages"},"starting_equipment":[{"equipment":{"index":"clothes-common","name":"Clothes, common","url":"/api/equipment/clothes-common"},"quantity":1},{"equipment":{"index":"pouch","name":"Pouch","url":"/api/equipment/pouch"},"quantity":1}],"starting_equipment_options":[{"choose":1,"type":"equipment","from":[{"equipment_category":{"index":"holy-symbols","name":"Holy Symbols","url":"/api/equipment-categories/holy-symbols"}}]}],"feature":{"desc":["As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.","You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple."],"name":"Shelter of the Faithful"},"personality_traits":{"from":["I idolize a particular hero of my faith, and constantly refer to that person's deeds and example.","I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.","I see omens in every event and action. The gods try to speak to us, we just need to listen.","Nothing can shake my optimistic attitude.","I quote (or misquote) sacred texts and proverbs in almost every situation.","I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.","I've enjoyed fine food, drink, and high society among my temple's elite. Rough living grates on me.","I've spent so long in the temple that I have little practical experience dealing with people in the outside world."],"choose":2,"type":"personality_traits"},"ideals":{"from":[{"desc":"Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld.","alignments":[{"index":"lawful-good","name":"Lawful Good","url":"api/alignments/lawful-good"},{"index":"lawful-neutral","name":"Lawful Neutral","url":"api/alignments/lawful-neutral"},{"index":"lawful-evil","name":"Lawful Evil","url":"api/alignments/lawful-evil"}]},{"desc":"Charity. I always try to help those in need, no matter what the personal cost.","alignments":[{"index":"lawful-good","name":"Lawful Good","url":"api/alignments/lawful-good"},{"index":"neutral-good","name":"Neutral Good","url":"api/alignments/neutral-good"},{"index":"chaotic-good","name":"Chaotic Good","url":"api/alignments/chaotic-good"}]},{"desc":"Change. We must help bring about the changes the gods are constantly working in the world.","alignments":[{"index":"chaotic-good","name":"Chaotic Good","url":"api/alignments/chaotic-good"},{"index":"chaotic-neutral","name":"Chaotic Neutral","url":"api/alignments/chaotic-neutral"},{"index":"chaotic-evil","name":"Chaotic Evil","url":"api/alignments/chaotic-evil"}]},{"desc":"Power. I hope to one day rise to the top of my faith's religious hierarchy.","alignments":[{"index":"lawful-good","name":"Lawful Good","url":"api/alignments/lawful-good"},{"index":"lawful-neutral","name":"Lawful Neutral","url":"api/alignments/lawful-neutral"},{"index":"lawful-evil","name":"Lawful Evil","url":"api/alignments/lawful-evil"}]},{"desc":"Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well.","alignments":[{"index":"lawful-good","name":"Lawful Good","url":"api/alignments/lawful-good"},{"index":"lawful-neutral","name":"Lawful Neutral","url":"api/alignments/lawful-neutral"},{"index":"lawful-evil","name":"Lawful Evil","url":"api/alignments/lawful-evil"}]},{"desc":"Aspiration. I seek to prove myself worthy of my god's favor by matching my actions against his or her teachings.","alignments":[{"index":"lawful-good","name":"Lawful Good","url":"api/alignments/lawful-good"},{"index":"neutral-good","name":"Neutral Good","url":"api/alignments/neutral-good"},{"index":"chaotic-good","name":"Chaotic Good","url":"api/alignments/chaotic-good"},{"index":"lawful-neutral","name":"Lawful Neutral","url":"api/alignments/lawful-neutral"},{"index":"neutral","name":"Neutral","url":"api/alignments/neutral"},{"index":"chaotic-neutral","name":"Chaotic Neutral","url":"api/alignments/chaotic-neutral"},{"index":"lawful-evil","name":"Lawful Evil","url":"api/alignments/lawful-evil"},{"index":"neutral-evil","name":"Neutral Evil","url":"api/alignments/neutral-evil"},{"index":"chaotic-evil","name":"Chaotic Evil","url":"api/alignments/chaotic-evil"}]}],"choose":1,"type":"ideals"},"bonds":{"from":["I would die to recover an ancient relic of my faith that was lost long ago.","I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.","I owe my life to the priest who took me in when my parents died.","Everything I do is for the common people.","I will do anything to protect the temple where I served.","I seek to preserve a sacred text that my enemies consider heretical and seek to destroy."],"choose":1,"type":"bonds"},"flaws":{"from":["I judge others harshly, and myself even more severely.","I put too much trust in those who wield power within my temple's hierarchy.","My piety sometimes leads me to blindly trust those that profess faith in my god.","I am inflexible in my thinking.","I am suspicious of strangers and expect the worst of them.","Once I pick a goal, I become obsessed with it to the detriment of everything else in my life."],"choose":1,"type":"flaws"}};
export const Background = props => {
    const [backgrounds, setBackgrounds] = useState([{name: 'custom', index: 'custom'}, acolyte]);
    //const { backgrounds } = props.backgrounds;

    const selectBackground = background => {
        props.selectBackground(background);
    };
    
    const [selectionBg, setSelectionBg] = useState([backgrounds[0]]);
    const [selectionSk1, setSelectionSk1] = useState([]);
    const [selectionSk2, setSelectionSk2] = useState([]);
    const [selectionLang, setSelectionLang] = useState([
        backgrounds[1].language_options.from[0],
    ]);
    //^^ was changed from backgrounds[0]
    const [selectionTlLg1, setSelectionTlLg1] = useState([]);
    const [selectionTlLg2, setSelectionTlLg2] = useState([]);

    const onNext = () => {
        props.setPage({ index: 3, name: 'description' });
        window.scrollTo(0, 0);
    };

    return (
        <div className="background">
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
                    title={backgrounds[0].name}
                    items={[
                        ...backgrounds,
                        { index: 'custom', name: 'Custom' },
                    ]}
                    width="70%"
                    selection={selectionBg}
                    setSelection={setSelectionBg}
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
                            {selectionBg[0].desc}
                        </ReactReadMoreReadLess>
                    )}
                </div>
            </div>
            <div className="card translucent-card">
                <div className="card content-card card-title">
                    <h4>Proficiencies</h4>
                </div>
                <div className="choice-container">
                    {selectionBg[0].index === 'custom' ? (
                        <Dropdown
                            title="Choose a Skill"
                            items={[]}
                            selection={selectionSk1}
                            setSelection={setSelectionSk1}
                            classname="choice"
                        />
                    ) : (
                        <div className="card content-card choice">
                            {selectionBg[0].starting_proficiencies[0].name}
                        </div>
                    )}
                    {selectionBg[0].index === 'custom' ? (
                        <Dropdown
                            title="Choose a Skill"
                            items={[]}
                            selection={selectionSk2}
                            setSelection={setSelectionSk2}
                            classname="choice"
                        />
                    ) : (
                        <div className="card content-card choice">
                            {selectionBg[0].starting_proficiencies[1].name}
                        </div>
                    )}
                </div>
                <div className="choice-container">
                    {selectionBg[0].index === 'custom' ? (
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
                    ) : (
                        <Dropdown
                            title={`Choose ${selectionBg[0].language_options.choose}: ${selectionBg[0].language_options.type}`}
                            items={selectionBg[0].language_options.from}
                            selectLimit={selectionBg[0].language_options.choose}
                            multiSelect
                            selection={selectionLang}
                            setSelection={setSelectionLang}
                            classname="choice"
                        />
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
                            {selectionBg[0].feature.desc[0]}
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
