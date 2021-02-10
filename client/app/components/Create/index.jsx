import React, { useState } from "react";
import Race from "./Race";
import Class from "./Class";
import Background from "./Background";
import Abilities from "./Abilities";
import Options from "./Options";
import Descriptions from "./Descriptions";
import Equipment from "./Equipment";

import "./styles.scss";

const Create = () => {
  const [page, setPage] = useState("race");

  const onPageChange = page => {
    setPage(page);
  };

  let pages;

  switch (page) {
    case "race":
      pages = <Race />;
      break;
    case "class":
      console.log(page);
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
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div
              className="btn-group-vertical"
              role="group"
              style={{ width: "100%" }}
            >
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("race")}
              >
                RACE
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("class")}
              >
                CLASS
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("background")}
              >
                BACKGROUND
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("abilities")}
              >
                ABILITIES
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("options")}
              >
                OPTIONS
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("description")}
              >
                DESCRIPTION
              </button>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
                onClick={() => onPageChange("equipment")}
              >
                EQUIPMENT
              </button>
            </div>
          </div>
          <div className="col-sm-8">{pages}</div>
        </div>
      </div>
    </>
  );
};

export default Create;
