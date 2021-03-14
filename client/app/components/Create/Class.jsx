import React, { useEffect, useState, useReducer } from 'react';
// import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import CharacterService from '../../redux/services/character.service';
// import { clearSelectedInfo, getClassInfo } from '../../redux/actions';
import Dropdown from '../shared/Dropdown';
import { setClass } from '../../redux/actions';

const Class = ({ charID, setPage }) => {
  const dispatch = useDispatch();
  const [classes, setClasses] = useState(null);
  const [viewClass, setViewClass] = useState(false);

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    CharacterService.getIndexedList('classes').then(list => setClasses(list));
  }, []);

  const selectClass = theClass => {
    dispatch(setClass(charID, theClass));
    setViewClass(true);
  };

  return (
    <div className="class position-relative">
      {!viewClass ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Class</h2>
          </div>
          <div className="dropdown btn-group-vertical w-100 mt-3">
            {classes &&
              classes.map((theClass, idx) => (
                <div className="w-100 h-auto" key={idx}>
                  <button
                    className="btn btn-lg m-0 mb-3 options"
                    type="button"
                    onClick={() =>
                      selectClass({ index: theClass.name, url: theClass.url })
                    }
                  >
                    {theClass.name}
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : (
        <SidePanel
          charID={charID}
          setPage={setPage}
          clearClass={() => setViewClass(false)}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

const SidePanel = ({ charID, setPage, clearClass, dispatch }) => {
  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    dispatch(setClass(charID, { choices: newState }));
    return newState;
  };

  const theClass = useSelector(state => state.characters[charID].class);

  //See background for an example! Make sure to include a key in the dropdown
  const [userChoices, setUserChoices] = useReducer(reducer, {});
  const [classInfo, setClassInfo] = useState(undefined);
  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  useEffect(() => {
    CharacterService.getClassInfo(theClass)
      .then(
        theClass => {
          setClassInfo(theClass);
          return theClass;
        }
        /*error => {
        console.log(error.toString());
      }*/
      )
      .then(theClass => {
        CharacterService.getClassDetails(theClass).then(theClass => {
          setClassInfo(theClass);
        });
        let equipment = { equipment: theClass.main.starting_equipment };
        dispatch(setClass(charID, equipment));
        dispatch(setClass(charID, { proficiencies: theClass.proficiencies }));
      });
  }, []);
  console.log('class', classInfo);

  const onNext = () => {
    setPage({ index: 2, name: 'abilities' });
    clearClass();
    window.scrollTo(0, 0);
  };
  if (classInfo) {
    const { main, features, options, proficiencies } = classInfo;
    return (
      <>
        <div className="d-none d-md-flex title-back-wrapper">
          <button
            onClick={clearClass}
            className="m-0 mr-3 btn-secondary btn-back"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <h2 className="title-card p-4">Class</h2>
          <div className="btn-back-spacer ml-3"></div>
        </div>
        <div className="d-md-none">
          <button
            onClick={clearClass}
            className="btn btn-secondary btn-back-sm"
          >
            <i className="bi bi-chevron-left"></i>
            <span>Back</span>
          </button>
        </div>
        <div className="card translucent-card">
          <div className="card content-card card-title">
            <h4>{main.name}</h4>
          </div>
          <div>
            <div className="w-auto d-inline-block card content-card floating-card">
              Hit Die - {main.hit_die}
            </div>
            <div className="w-auto d-inline-block card content-card floating-card">
              SAVING THROWS -{' '}
              {main.saving_throws.map((throws, idx) => (
                <small key={idx}>
                  {throws.name}
                  {idx < main.saving_throws.length - 1 && ', '}
                </small>
              ))}
            </div>
          </div>
        </div>
        {options.length > 0 && (
          <div className="card translucent-card">
            <h4 className="card content-card card-title">Class Options</h4>
            <div>
              {options.map((option, index) => {
                return (
                  <Dropdown
                    ddLabel={option.header}
                    title={`Choose ${option.choose}`}
                    items={option.options}
                    width="100%"
                    selectLimit={option.choose}
                    multiselect={option.choose > 1}
                    selection={
                      userChoices[
                        `${option.header
                          .toLowerCase()
                          .replace(' ', '-')}-${index}`
                      ]
                    }
                    setSelection={setUserChoices}
                    classname="choice"
                    stateKey={`${option.header
                      .toLowerCase()
                      .replace(' ', '-')}-${index}`}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="card translucent-card">
          <h4 className="card content-card card-title">
            Starting Proficiencies
          </h4>
          <div className="card content-card description-card">
            {Object.entries(proficiencies).map(prof => (
              <p className="text-capitalize" key={prof[0]}>
                <strong className="small-caps">{prof[0]}</strong> –{' '}
                {prof[1].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item}
                    {idx < prof[1].length - 1 && ', '}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
        {features.length > 0 && (
          <div className="card translucent-card">
            <h4 className="card content-card card-title">Level 1 Features</h4>
            {features.map(feature => (
              <div
                className="card content-card description-card"
                key={feature.index}
              >
                <h5 className="text-center">{feature.name}</h5>
                {feature.desc.map(desc => (
                  <p key={desc}>{desc}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        {main.spellcasting && (
          <div className="card translucent-card">
            <h4 className="card content-card card-title">SPELL CASTING</h4>
            {main.spellcasting.info.map(spell => (
              <div
                className="card content-card description-card"
                key={spell.name}
              >
                <h5 className="text-center">{spell.name}</h5>
                {spell.desc.map(desc => (
                  <p key={desc}>{desc}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        <button
          className="text-uppercase btn-primary btn-lg px-5 btn-floating"
          onClick={onNext}
        >
          OK
        </button>
      </>
    );
  } else {
    return <>Loading</>;
  }
};

export default Class;
/*

const mapStateToProps = state => ({
  classes: state.createCharacter,
});

const mapDispatchToProps = dispatch => ({
  selectClass: name => dispatch(getClassInfo(name)),
  clearSelectedInfo: () => dispatch(clearSelectedInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
*/
