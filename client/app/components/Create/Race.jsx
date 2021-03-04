import React, { useState, useEffect} from "react";
import { connect } from "react-redux";
import { clearSelectedInfo, getRaceInfo } from "../../actions";
import Dropdown from "../shared/Dropdown";
import {raceCaller, classCaller} from "../apiCaller";

const Race = props => {
  const { races, selectedInfo } = props.races;
  let apiData;
  useEffect(() => {
    const fetchData = async () => {
      apiData = await classCaller();
      console.log(apiData);
      /*apiData.main for the top level race, .sub for the subrace. pull qualities from .main and .sub together to form the interface.
        all properties are the same as in the api, but you can access .desc for those that were pointers before, such as in traits and options.
        there are also two properties in .main and .sub, .options and .proficiencies, that group all options and proficiencies together.
        proficiencies are sorted into .weapons, .armor, .languages, .skills, .tools, and .throws. 
        options is an array where each object in it has a .choose (with how many you should choose, an integer), .header (the type, ie "extra language")
          and .options subarray with .name and .desc in each. 
        ANY .DESC DESCRIPTION IS AN ARRAY. proceeed accordingly.
      */
    }
    fetchData();
  }, []);

  const selectRace = race => {
    props.selectRace(race);
  };

  return (
    <div className="race position-relative">
      {!selectedInfo ? (
        <>
          <div className="mx-auto mb-4 w-75">
            <h2 className="title-card p-4">Race</h2>
          </div>
          <div className="dropdown btn-group-vertical w-75">
            {races.map((race, idx) => (
              <div className="w-100 h-auto" key={idx}>
                <button
                  className={
                    race.subraces.length > 0
                      ? "btn btn-lg m-0 mb-3 options dropdown-toggle"
                      : "btn btn-lg m-0 mb-3 options"
                  }
                  type="button"
                  id={`dropdownMenuButton1${idx}`}
                  data-toggle={race.subraces.length > 0 ? "dropdown" : ""}
                  aria-expanded="true"
                >
                  {race.name}
                </button>
                <div
                  className="dropdown-menu m-0 p-0"
                  aria-labelledby={`dropdownMenuButton1${idx}`}
                >
                  {race.subraces.map((subrace, idx) => (
                    <button
                      key={idx}
                      className="w-100 m-0 border-0 shadow-none text-center text-uppercase options-dropdown"
                      onClick={() => selectRace(subrace.name)}
                    >
                      {subrace.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <SidePanel
          info={selectedInfo}
          setPage={props.setPage}
          selectRace={selectRace}
          clearSelectedInfo={props.clearSelectedInfo}
        />
      )}
    </div>
  );
};

const SidePanel = props => {
  const { name, skills, traits } = props.info;

  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  const onNext = () => {
    props.setPage({ index: 1, name: "class" });
    props.clearSelectedInfo();
  };

  return (
    <>
      <div className="mb-3">
        <button
          onClick={() => props.selectRace(null)}
          className="float-left p-3 m-0 mx-2"
          style={{ width: 40, height: 40 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-left"
            viewBox="0 0 16 16"
          >
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        </button>
        <h2 className="title-card p-4">
          Race
        </h2>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h5>
              {name}
          </h5>
        </div>
        <h6 className="card-subtitle">
          <div className="w-auto d-inline-block card content-card floating-card">
            +{skills.dexterity} Dexterity
            <br />+{skills.intelligence} Intelligence
          </div>
          <div className="w-auto d-inline-block card content-card floating-card">
            Speed: {skills.speed}
            <br />
            Size: {skills.size}
          </div>
        </h6>
      </div>
      <div className="card translucent-card">
        <h5 className="card content-card card-title">
            Race Options
        </h5>
        <div className="card">
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={["hello"]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1} />
          <Dropdown
            title="Choose 1 Extra Language"
            items={["hello"]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1} />
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h5>
            Starting Proficiencies
          </h5>
        </div>
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
        className="text-uppercase btn-primary btn-lg px-5"
        style={{ position: "sticky", bottom: 10 }}
        onClick={onNext}
      >
        OK
      </button>
    </>
  );
};

const mapStateToProps = state => ({
  races: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectRace: name => dispatch(getRaceInfo(name)),
  clearSelectedInfo: () => dispatch(clearSelectedInfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(Race);
