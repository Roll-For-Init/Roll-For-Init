import React from "react";
import { connect } from "react-redux";
import { getRaceInfo } from "../../actions";

const Race = props => {
  const { races } = props.races;

  const selectRace = race => {
    props.selectRace(race);
  };

  return (
    <div className="race">
      <h2 className="p-4" style={{ position: "sticky", top: -50, zIndex: 99 }}>
        Race
      </h2>
      <div className="dropdown btn-group-vertical w-75">
        {races.map((race, idx) => (
          <div className="w-100 h-auto" key={idx}>
            <button
              className="btn btn-lg my-3 mx-0 options dropdown-toggle text-uppercase w-100"
              type="button"
              id={`dropdownMenuButton1${idx}`}
              data-toggle="dropdown"
              aria-expanded="true"
            >
              {race.name}
            </button>
            <div
              className="dropdown-menu w-100 p-0"
              aria-labelledby={`dropdownMenuButton1${idx}`}
            >
              {race.subraces.length > 0 ? (
                race.subraces.map((subrace, idx) => (
                  <button
                    key={idx}
                    className="w-100 m-0 border-0 shadow-none text-center text-uppercase"
                    onClick={() => selectRace(subrace.name)}
                  >
                    {subrace.name}
                  </button>
                ))
              ) : (
                <button
                  className="w-100 m-0 border-0 shadow-none text-center text-uppercase"
                  disabled
                >
                  No subraces
                </button>
              )}
            </div>
          </div>
        ))}
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
