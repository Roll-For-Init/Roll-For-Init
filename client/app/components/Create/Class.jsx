import React from "react";
import { connect } from "react-redux";
import { clearSelectedInfo, getClassInfo } from "../../actions";
import Dropdown from "../Dropdown";

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
                  className="btn btn-lg my-3 mx-0 options w-100"
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
  const onNext = () => {
    props.setPage({ index: 2, name: "background" });
    props.clearSelectedInfo();
  };

  console.log(props.info);

  return (
    <>
      <div className="mb-3" style={{ height: 70 }}>
        <button
          onClick={() => props.selectClass(null)}
          className="float-left p-3 m-0 mx-2"
          style={{ width: "10%", height: 70 }}
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
        <h2 style={{ width: "85%" }} className="p-3 m-0 float-right rounded">
          Class
        </h2>
      </div>
      <div className="card w-75 side-bar">
        <div className="card-body">
          <h4 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              name
            </div>
          </h4>
          <h6 className="card-subtitle mt-4">
            <div className="w-auto mx-2 p-2 d-inline-block rounded text-background">
              Test
            </div>
            <div className="w-auto mx-2 p-2 d-inline-block rounded text-background">
              Test1
            </div>
          </h6>
        </div>
      </div>
      <div className="card w-75 side-bar">
        <div className="card-body">
          <h5 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              race options
            </div>
          </h5>
          <div className="card-subtitle mt-4 ">
            <Dropdown title="Choose 1 High Elf Cantrip" items={["hello"]} />
            <Dropdown title="Choose 1 Extra Language" items={["hello"]} />
          </div>
        </div>
      </div>
      <div className="card w-100 side-bar">
        <div className="card-body">
          <h5 className="card-title">
            <div
              style={{ padding: 20 }}
              className="card-title text-uppercase rounded w-75 m-auto text-background"
            >
              starting proficiencies
            </div>
          </h5>
          <div className="card-subtitle mt-4 text-background text-left">
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Weapons</strong> - longswords,
              shortswords, shortbows, longbows
            </p>
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Skills</strong> - perception
            </p>
            <p className="text-capitalize m-0">
              <strong className="text-uppercase">Languages</strong> - Common,
              elvish
            </p>
          </div>
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
