import React, { useState } from "react";
import { connect } from "react-redux";
import { clearSelectedInfo, getClassInfo } from "../../actions";
import Dropdown from "../shared/Dropdown";

export const Class = props => {
  const { classes, selectedInfo } = props.classes;

  const selectClass = name => {
    props.selectClass(name);
  };

  return (
    <div className="class position-relative">
      {!selectedInfo ? (
        <>
          <div className="mx-auto mb-4 w-75">
            <h2 className="title-card p-4">Class</h2>
          </div>
          <div className="dropdown btn-group-vertical w-75">
            {classes.map((name, idx) => (
              <div className="w-100 h-auto" key={idx}>
                <button
                  className="btn btn-lg m-0 mb-3 options"
                  type="button"
                  onClick={() => selectClass(name.name)}
                >
                  {name.name}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <SidePanel
          info={selectedInfo}
          setPage={props.setPage}
          selectClass={selectClass}
          clearSelectedInfo={props.clearSelectedInfo}
        />
      )}
    </div>
  );
};

const SidePanel = props => {

  const [selection1, setSelection1] = useState([]);
  const [selection2, setSelection2] = useState([]);

  const onNext = () => {
    props.setPage({ index: 2, name: "background" });
    props.clearSelectedInfo();
  };

  console.log(props.info);

  return (
    <>
      <div className="mb-3">
        <button
          onClick={() => props.selectClass(null)}
          className="float-left p-3 m-0 mx-2"
          style={{ width: 40, height: 40 }}
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
        <h2 className="title-card p-4">
          Class
        </h2>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title">
          <h5>
              name
          </h5>
        </div>
        <h6 className="card-subtitle">
          <div className="w-auto d-inline-block card content-card floating-card">
            Test
          </div>
          <div className="w-auto d-inline-block card content-card floating-card">
            Test1
          </div>
        </h6>
      </div>
      <div className="card translucent-card">
        <h5 className="card content-card card-title">
            Class Options
        </h5>
        <div className="card">
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={["hello"]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}  />
          <Dropdown
            title="Choose 1 High Elf Cantrip"
            items={["hello"]}
            width="100%"
            selection={selection1}
            setSelection={setSelection1}  />
        </div>
      </div>
      <div className="card translucent-card">
        <h5 className="card content-card card-title">
            Starting Proficiencies
        </h5>
        <div className="card content-card description-card">
          <p className="text-capitalize">
            <strong className="small-caps">Weapons</strong> – longswords,
            shortswords, shortbows, longbows
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Skills</strong> – perception
          </p>
          <p className="text-capitalize">
            <strong className="small-caps">Languages</strong> – Common,
            Elvish
          </p>
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
  classes: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectClass: name => dispatch(getClassInfo(name)),
  clearSelectedInfo: () => dispatch(clearSelectedInfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
