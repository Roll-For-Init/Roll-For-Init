import React, { useState } from "react";
import { connect } from "react-redux";

export const Race = props => {
  const [races, setRaces] = useState([
    { name: "dragonborn", subraces: [] },
    { name: "dwarf", subraces: [] },
    { name: "elf", subraces: [] },
    { name: "gnome", subraces: [] },
    {
      name: "half-elf",
      subraces: [
        {
          name: "high elf"
        }
      ]
    },
    { name: "half-orc", subraces: [] },
    { name: "halfling", subraces: [] },
    { name: "human", subraces: [] },
    { name: "tiefling", subraces: [] }
  ]);
  
  return (
    <>
      <h2
        className="bg-secondary"
        style={{ position: "sticky", top: -50, zIndex: 99 }}
      >
        Race
      </h2>
      <div className="dropdown btn-group-vertical w-75">
        {races.map((race, idx) => (
          <div className="w-100 h-auto" key={idx}>
            <button
              className="btn btn-lg my-3 mx-0 btn-secondary dropdown-toggle text-uppercase w-100"
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
      >
        OK
      </button>
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Race);
