import React, { useState } from "react";
import Race from "./Race";
import Class from "./Class";
import Background from "./Background";
import Abilities from "./Abilities";
import Options from "./Options";
import Descriptions from "./Descriptions";
import Equipment from "./Equipment";

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

const Create = () => {
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
      <h1
        className="bg-secondary"
        style={{ width: "100vw", textAlign: "center" }}
      >
        Roll For Init
      </h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4 offset-1">
            <div className="btn-group-vertical w-100" role="group">
              {buttonNames.map((name, idx) => (
                <button
                  key={name}
                  type="button"
                  className={
                    page.index < idx && page.name !== name
                      ? "btn btn-lg btn-primary text-uppercase"
                      : "btn btn-lg btn-light text-uppercase"
                  }
                  style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                  onClick={() => onPageChange(name, idx)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="col-6 offset-1 container">
            {pages}
            <button className="text-uppercase btn-primary btn-lg px-5">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
