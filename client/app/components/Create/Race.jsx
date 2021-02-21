import React from "react";
import { connect } from "react-redux";
import { getRaceInfo } from "../../actions";

const Race = props => {
  const { races, selectedInfo } = props.races;

  const selectRace = race => {
    props.selectRace(race);
  };

  return (
    <div className="race position-relative">
      <div className="mx-auto mb-4 w-75">
        <div className="w-100 d-flex flex-row">
          {selectedInfo && (
            <button
              onClick={() => props.selectRace(null)}
              className="float-left p-4 m-0 w-25"
            >
              back
            </button>
          )}
          <h2
            className={
              selectedInfo
                ? "p-4 px-5 mx-3 w-50 m-0 float-left rounded"
                : "p-4 w-100 rounded"
            }
          >
            Race
          </h2>
        </div>
      </div>
      <div className="dropdown btn-group-vertical w-75">
        {!selectedInfo ? (
          races.map((race, idx) => (
            <div className="w-100 h-auto" key={idx}>
              <button
                className={
                  race.subraces.length > 0
                    ? "btn btn-lg my-3 mx-0 options dropdown-toggle text-uppercase w-50"
                    : "btn btn-lg my-3 mx-0 options text-uppercase w-50"
                }
                type="button"
                id={`dropdownMenuButton1${idx}`}
                data-toggle={race.subraces.length > 0 ? "dropdown" : ""}
                aria-expanded="true"
              >
                {race.name}
              </button>
              <div
                className="dropdown-menu w-50 p-0"
                aria-labelledby={`dropdownMenuButton1${idx}`}
              >
                {race.subraces.map((subrace, idx) => (
                  <button
                    key={idx}
                    className="w-100 m-0 border-0 shadow-none text-center text-uppercase"
                    onClick={() => selectRace(subrace.name)}
                  >
                    {subrace.name}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <SidePanel info={selectedInfo} setPage={props.setPage} />
        )}
      </div>
    </div>
  );
};

const SidePanel = props => {
  const { name, skills, traits } = props.info;
  return (
    <div className="w-100">
      <div className="card w-100 side-bar">
        <div className="card-body">
          <h4 className="card-title">
            <div
              style={{ backgroundColor: "white", padding: 20 }}
              className="card-title text-uppercase text-dark rounded w-75 m-auto"
            >
              {name}
            </div>
          </h4>
          <h6 className="card-subtitle container-fluid px-0 mt-4 ">
            <div
              style={{
                backgroundColor: "white",
                padding: 10,
                fontSize: 12,
                textAlign: "left"
              }}
              className="text-dark col-5 d-inline-block rounded"
            >
              +{skills.dexterity} dexterity
              <br />+{skills.intelligence} Intelligence
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: 10,
                fontSize: 12,
                textAlign: "left"
              }}
              className="text-dark col-5 offset-2 d-inline-block rounded"
            >
              Speed: {skills.speed}
              <br />
              Size: {skills.size}
            </div>
          </h6>
          <div
            className="card-text container-fluid mt-4"
            style={{ fontSize: 12, textAlign: "left" }}
          >
            <h6 className="row mb-3">
              <div className="col-12 text-dark text-center bg-light p-2 rounded text-uppercase">
                {name} traits
              </div>
            </h6>
            {traits.map((trait, idx) => (
              <div className="row" key={idx}>
                <p className="col-12 text-dark bg-light p-2 rounded">
                  <b className="text-uppercase text-dark fs-2">
                    {trait.name} -{" "}
                  </b>
                  {trait.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5"
        style={{ position: "sticky", bottom: 10 }}
        onClick={() => props.setPage({ index: 1, name: "class" })}
      >
        OK
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  races: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectRace: name => dispatch(getRaceInfo(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Race);
