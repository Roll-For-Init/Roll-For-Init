import React from "react";
import { connect } from "react-redux";
import { clearSelectedInfo, getRaceInfo } from "../../actions";
import Dropdown from "../Dropdown";

const Race = props => {
  const { races, selectedInfo } = props.races;

  const selectRace = race => {
    props.selectRace(race);
  };

  return (
    <div className="race position-relative">
      {!selectedInfo ? (
        <>
          <div className="mx-auto mb-4 w-75">
            <h2 className="p-4 w-100 rounded">Race</h2>
          </div>
          <div className="dropdown btn-group-vertical w-75">
            {races.map((race, idx) => (
              <div className="w-100 h-auto" key={idx}>
                <button
                  className={
                    race.subraces.length > 0
                      ? "btn btn-lg m-0 mb-3 options dropdown-toggle text-uppercase"
                      : "btn btn-lg m-0 mb-3 options text-uppercase"
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

  const onNext = () => {
    props.setPage({ index: 1, name: "class" });
    props.clearSelectedInfo();
  };

  return (
    <>
      <div className="mb-3" style={{ height: 70 }}>
        <button
          onClick={() => props.selectRace(null)}
          className="float-left p-3 m-0 mx-2"
          style={{ width: "10%", height: 70 }}
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
        <h2 style={{ width: "85%" }} className="p-3 m-0 float-right rounded">
          Race
        </h2>
      </div>
      <div className="card w-75 side-bar">
        <div className="card-body">
          <h4 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              {name}
            </div>
          </h4>
          <h6 className="card-subtitle mt-4">
            <div className="w-auto mx-2 p-2 d-inline-block rounded text-background">
              +{skills.dexterity} dexterity
              <br />+{skills.intelligence} Intelligence
            </div>
            <div className="w-auto mx-2 p-2 d-inline-block rounded text-background">
              Speed: {skills.speed}
              <br />
              Size: {skills.size}
            </div>
          </h6>
        </div>
      </div>
      <div className="card w-75 side-bar">
        <div className="card-body">
          <h5 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              race options
            </div>
          </h5>
          <div className="card-subtitle mt-4 ">
            <Dropdown title="Choose 1 High Elf Cantrip" items={["hello"]} />
            <Dropdown title="Choose 1 Extra Language" items={["hello"]} />
          </div>
        </div>
      </div>
      <div className="card w-100 side-bar">
        <div className="card-body">
          <h5 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              starting proficiencies
            </div>
          </h5>
          <div className="card-subtitle mt-4 text-background text-left">
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Weapons</strong> - longswords,
              shortswords, shortbows, longbows
            </p>
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Skills</strong> - perception
            </p>
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Languages</strong> - Common,
              elvish
            </p>
          </div>
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
