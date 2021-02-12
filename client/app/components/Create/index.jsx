import React, { useState } from "react";
import { connect } from "react-redux";
import Race from "./Race";
import Class from "./Class";
import Background from "./Background";
import Abilities from "./Abilities";
import Options from "./Options";
import Descriptions from "./Descriptions";
import Equipment from "./Equipment";
import SidePanel from "./SidePanel";

import "./styles.scss";

const buttonNames = [
  "race",
  "class",
  "background",
  "abilities",
  "options",
  "description",
  "equipment"
];

const Create = props => {
  const { selectedInfo } = props.info;
  const [page, setPage] = useState({ name: "race", index: 0 });
  const onPageChange = (page, index) => {
    setPage({ name: page, index });
  };

  let pages;

  switch (page.name) {
    case "race":
      pages = <Race />;
      break;
    case "class":
      pages = <Class />;
      break;
    case "background":
      pages = <Background />;
      break;
    case "abilities":
      pages = <Abilities />;
      break;
    case "options":
      pages = <Options />;
      break;
    case "description":
      pages = <Descriptions />;
      break;
    case "equipment":
      pages = <Equipment />;
      break;
  }

  return (
    <>
      <header>
        <h1 className="bg-dark text-center m-0">Roll For Init</h1>
      </header>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 p-5 bg-secondary overflow-auto">
            <div className="btn-group-vertical w-100" role="group">
              {buttonNames.map((name, idx) => (
                <button
                  key={name}
                  type="button"
                  className={
                    page.index < idx && page.name !== name
                      ? "btn btn-lg btn-primary text-uppercase text-white-50"
                      : "btn btn-lg btn-light text-uppercase"
                  }
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    borderRadius: 5,
                    minWidth: 200
                  }}
                  onClick={() => onPageChange(name, idx)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="col-5 pb-0 px-5 pt-5 container overflow-auto position-relative">
            {pages}
          </div>
          <div className="col-4 p-4 container overflow-auto">
            {selectedInfo ? (
              <SidePanel />
            ) : (
              <div className="card bg-dark mt-5 p-5">
                <div className="card-header">
                  <h4>Nothing Is Selected</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  info: state.createCharacter
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
