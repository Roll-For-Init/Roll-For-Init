import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector, useDispatch } from 'react-redux';
import CharacterService from '../../redux/services/character.service';
import { clearSelectedInfo, getClassInfo } from "../../redux/actions";
import Dropdown from "../shared/Dropdown";
import {setClass} from "../../redux/actions";

const Class = ({charID, setPage}) => {
  const dispatch = useDispatch();
  const [classes, setClasses] = useState(null);
  const [viewClass, setViewClass] = useState(false);

  const character = useSelector(state => state.characters[charID]);

  useEffect(() => {
    CharacterService.getIndexedList("classes").then((list) => setClasses(list));
  }, []);

  
  useEffect(() => {
console.log(character)  }, [character]);
  
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
            {classes && classes.map((theClass, idx) => (
              <div className="w-100 h-auto" key={idx}>
                <button
                  className="btn btn-lg m-0 mb-3 options"
                  type="button"
                  onClick={() => selectClass({index: theClass.name, url: theClass.url})}
                >
                  {theClass.name}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <SidePanel
          charID = {charID}
          setPage={setPage}
          clearClass={() => setViewClass(false)}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

const SidePanel = ({charID, setPage, clearClass, dispatch}) => {
  const theClass = useSelector(state => state.characters[charID].class);

  const [classInfo, setClassInfo] = useState(undefined);
  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  useEffect(() => {
    CharacterService.getClassInfo(theClass).then(
      theClass => {
        console.log(theClass);
        setClassInfo(theClass); //TODO: or subrace
        return theClass
      }
      /*error => {
        console.log(error.toString());
      }*/
    ).then(theClass => {
      CharacterService.getClassDetails(theClass).then(theClass => {setClassInfo(theClass)});
      let equipment = {equipment: theClass.main.starting_equipment};
      dispatch(setClass(charID, equipment));
      dispatch(setClass(charID, {proficiencies: theClass.proficiencies}))    

    });
  }, []);

  const onNext = () => {
    setPage({ index: 2, name: "background" });
    clearClass();
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="d-none d-md-flex title-back-wrapper">
        <button
          onClick={clearClass}
          className="m-0 mr-3 btn-secondary btn-back"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <h2 className="title-card p-4">
          Class
        </h2>
        <div className="btn-back-spacer ml-3"></div>
      </div>
      <div className="d-md-none">
        <button
          onClick={clearClass}
          className="btn btn-secondary btn-back-sm"
        >
          <i className="bi bi-chevron-left"></i><span>Back</span>
        </button>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>
              name
          </h4>
        </div>
        <div>
          <div className="w-auto d-inline-block card content-card floating-card">
            Test
          </div>
          <div className="w-auto d-inline-block card content-card floating-card">
            Test1
          </div>
        </div>
      </div>
      <div className="card translucent-card">
        <h5 className="card content-card card-title">
            Class Options
        </h5>
        <div>
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: "hello", name: "Hello" }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}  />
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: "hello", name: "Hello" }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}  />
        </div>
      </div>
      <div className="card translucent-card">
        <h4 className="card content-card card-title">
            Starting Proficiencies
        </h4>
        <div className="card content-card description-card">
          <p className="text-capitalize">
            <strong className="small-caps">Weapons</strong> – longswords,
            shortswords, shortbows, longbows
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Skills</strong> – perception
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Languages</strong> – Common,
            Elvish
          </p>
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
    </>
  );
};

export default Class;
/*

const mapStateToProps = state => ({
  classes: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectClass: name => dispatch(getClassInfo(name)),
  clearSelectedInfo: () => dispatch(clearSelectedInfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
*/
