import React, { useState } from "react";
import { connect } from "react-redux";
import { clearSelectedInfo, getRaceInfo } from "../../actions";
import Dropdown from "../shared/Dropdown";

const Race = props => {
  const { races, selectedInfo } = props.races;

  const selectRace = race => {
    props.selectRace(race);
  };

  return (
    <div className="race position-relative">
      {!selectedInfo ? (
        <>
          <div className="mx-auto d-none d-md-flex title-back-wrapper">
            <h2 className="title-card p-4">Race</h2>
          </div>
          <div className="dropdown btn-group-vertical w-100 mt-3">
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
    window.scrollTo(0, 0);
    props.clearSelectedInfo();
  };

  return (
    <>
      <div className="d-none d-md-flex title-back-wrapper">
        <button
          onClick={() => props.selectRace(null)}
          className="m-0 mr-3 btn btn-secondary btn-back"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <h2 className="title-card p-4">
          Race
        </h2>
        <div className="btn-back-spacer ml-3"></div>
      </div>
      <div className="d-md-none">
        <button
          onClick={() => props.selectRace(null)}
          className="btn btn-secondary btn-back-sm"
        >
          <i className="bi bi-chevron-left"></i><span>Back</span>
        </button>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>
              {name}
          </h4>
        </div>
        <div>
          <div className="w-auto d-inline-block card content-card floating-card">
            +{skills.dexterity} Dexterity
            <br />+{skills.intelligence} Intelligence
          </div>
          <div className="w-auto d-inline-block card content-card floating-card">
            Speed: {skills.speed}
            <br />
            Size: {skills.size}
          </div>
        </div>
      </div>
      <div className="card translucent-card">
        <h4 className="card content-card card-title">
            Race Options
        </h4>
        <div>
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={[{ index: "hello", name: "Hello" }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1} />
          <Dropdown
            title="Choose 1 Extra Language"
            items={[{ index: "hello", name: "Hello" }]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1} />
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h4>
            Starting Proficiencies
          </h4>
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
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
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
