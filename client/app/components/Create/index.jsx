import React, { useState } from "react";
import { connect } from "react-redux";
import Race from "./Race";
import Class from "./Class";
import Background from "./Background";
import Abilities from "./Abilities";
import Options from "./Options";
import Descriptions from "./Descriptions";
import Equipment from "./Equipment";
import { Link } from "react-router-dom";

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
      pages = <Race setPage={setPage} page={page} />;
      break;
    case "class":
      pages = <Class setPage={setPage} page={page} />;
      break;
    case "background":
      pages = <Background setPage={setPage} page={page} />;
      break;
    case "abilities":
      pages = <Abilities setPage={setPage} page={page} />;
      break;
    case "options":
      pages = <Options setPage={setPage} page={page} />;
      break;
    case "description":
      pages = <Descriptions setPage={setPage} page={page} />;
      break;
    case "equipment":
      pages = <Equipment setPage={setPage} page={page} />;
      break;
  }

  return (
    <div className="create">
      <header>
        <h1 className="text-center m-0" style={{ backgroundColor: "#333" }}>
          <Link to="/" className="link-regular">
            Roll For Init
          </Link>
        </h1>
      </header>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 p-5 side-bar overflow-auto">
            <div className="btn-group-vertical w-100" role="group">
              {buttonNames.map((name, idx) => {
                let classname = "btn btn-lg btn-secondary text-uppercase";
                if (page.index < idx) {
                  classname =
                    "btn btn-lg btn-secondary text-uppercase disabled";
                }
                if (page.name === name) {
                  classname = "btn btn-lg btn-primary text-uppercase";
                }
                return (
                  <button
                    key={name}
                    type="button"
                    className={classname}
                    style={{
                      marginLeft: 0,
                      marginRight: 0,
                      borderRadius: 5,
                      minWidth: 200
                    }}
                    onClick={() => {
                      page.index > idx && onPageChange(name, idx);
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="col-9 pb-0 px-5 pt-5 container overflow-auto">
            {pages}
          </div>
          {/* <div className="col-4">
            {selectedInfo ? (
              <SidePanel />
            ) : (
              <div className="card mt-5 p-5 side-bar">
                <div className="card-header">
                  <h4>Nothing Is Selected</h4>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  info: state.createCharacter
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
