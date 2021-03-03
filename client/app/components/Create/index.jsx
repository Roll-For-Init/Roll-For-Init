import React, { useState } from "react";
import { connect } from "react-redux";
import Race from "./Race";
import Class from "./Class";
import Background from "./Background";
import Abilities from "./Abilities";
import Options from "./Options";
import Descriptions from "./Descriptions";
import Equipment from "./Equipment";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";

import "./styles.scss";
import Header from "../shared/Header";

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
    window.scrollTo(0, 0);
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
      <Header />
      <div className="container-fluid">
        <div className="row position-relative" style={{top: "45px"}}>
          <div className="col-3 d-none d-md-block side-bar overflow-auto">
            <div className="btn-group-vertical w-100" role="group">
              {buttonNames.map((name, idx) => {
                let classname = "btn btn-lg btn-secondary menu-button";
                if (page.name === name) {
                  classname = "btn btn-lg btn-primary menu-button active";
                }
                return (
                  <button
                    key={name}
                    type="button"
                    className={classname}
                    disabled={page.index < idx}
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
          <MobileMenu 
            buttonNames={buttonNames}
            page={page}
            pages={pages}
            setPage={setPage}
          />
          <div className="col-md-9 offset-md-3 pb-0 pt-md-3 container">
            {pages}
          </div>
          {/* <div className="col-3 p-4 container overflow-auto">
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
