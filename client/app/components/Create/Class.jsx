import React, { useState } from 'react';
import { connect } from 'react-redux';
import { clearSelectedInfo, getClassInfo } from '../../actions';
import Dropdown from '../shared/Dropdown';
import { classCaller } from '../apiCaller';

export const Class = props => {
  const { classes, selectedInfo } = props.classes;
  let apiData;

  useEffect(() => {
    const fetchData = async () => {
      apiData = await classCaller();
      console.log(apiData);
      /*apiData.main for the class. 
        all properties are the same as in the api. 
        there are also three properties in .main -- .options, .proficiencies, and .features -- that group all options, features, and proficiencies together.
        proficiencies are sorted into .weapons, .armor, .languages, .skills, .tools, and .throws. 
        options is an array where each object in it has a .choose (with how many you should choose, an integer), .header (the type, ie "extra language")
          and .options subarray with .name and .desc in each. 
        ANY .DESC DESCRIPTION IS AN ARRAY. proceeed accordingly.
      */
    };
    fetchData();
  }, []);
  const selectClass = name => {
    props.selectClass(name);
  };

  return (
    <div className="class position-relative">
      {!selectedInfo ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Class</h2>
          </div>
          <div className="dropdown btn-group-vertical w-100 mt-3">
            {classes.map((name, idx) => (
              <div className="w-100 h-auto" key={idx}>
                <button
                  className="btn btn-lg m-0 mb-3 options"
                  type="button"
                  onClick={() => selectClass(name.name)}
                >
                  {name.name}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <SidePanel
          info={selectedInfo}
          setPage={props.setPage}
          selectClass={selectClass}
          clearSelectedInfo={props.clearSelectedInfo}
        />
      )}
    </div>
  );
};

const SidePanel = props => {
  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  const onNext = () => {
    props.setPage({ index: 2, name: 'background' });
    props.clearSelectedInfo();
  };

  const onNext = () => {
    props.setPage({ index: 2, name: 'background' });
    props.clearSelectedInfo();
    window.scrollTo(0, 0);
  };

  console.log(props.info);

  return (
    <>
      <div className="d-none d-md-flex title-back-wrapper">
        <button
          onClick={() => props.selectClass(null)}
          className="m-0 mr-3 btn-secondary btn-back"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <h2 className="title-card p-4">Class</h2>
        <div className="btn-back-spacer ml-3"></div>
      </div>
      <div className="d-md-none">
        <button
          onClick={() => props.selectClass(null)}
          className="btn btn-secondary btn-back-sm"
        >
          <i className="bi bi-chevron-left"></i>
          <span>Back</span>
        </button>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>name</h4>
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
        <h5 className="card content-card card-title">Class Options</h5>
        <div>
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: 'hello', name: 'Hello' }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}
          />
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: 'hello', name: 'Hello' }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}
          />
        </div>
      </div>
      <div className="card translucent-card">
        <h4 className="card content-card card-title">Starting Proficiencies</h4>
        <div className="card content-card description-card">
          <p className="text-capitalize">
            <strong className="small-caps">Weapons</strong> – longswords,
            shortswords, shortbows, longbows
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Skills</strong> – perception
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Languages</strong> – Common, Elvish
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

const mapStateToProps = state => ({
  classes: state.createCharacter,
});

const mapDispatchToProps = dispatch => ({
  selectClass: name => dispatch(getClassInfo(name)),
  clearSelectedInfo: () => dispatch(clearSelectedInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
