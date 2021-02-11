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
      <h2 className="bg-secondary">Race</h2>
      <div className="dropdown btn-group-vertical w-100">
        {races.map((race, idx) => (
          <div className="w-100 h-auto" key={idx}>
            <button
              className="btn btn-lg btn-secondary dropdown-toggle text-uppercase w-100"
              style={{ margin: "10px 0px" }}
              type="button"
              id={`dropdownMenuButton1${idx}`}
              data-toggle="dropdown"
              aria-expanded="true"
            >
              {race.name}
            </button>
            <div
              className="dropdown-menu w-100"
              style={{ padding: 0 }}
              aria-labelledby={`dropdownMenuButton1${idx}`}
            >
              {race.subraces.length > 0 ? (
                race.subraces.map((subrace, idx) => (
                  <button
                    key={idx}
                    className="w-100 border-0 shadow-none text-center text-uppercase"
                    style={{ margin: 0 }}
                  >
                    {subrace.name}
                  </button>
                ))
              ) : (
                <button
                  className="w-100 border-0 shadow-none text-center text-uppercase"
                  style={{ margin: 0 }}
                  disabled
                >
                  No subraces
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Race);
