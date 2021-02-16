import React from "react";
import { connect } from "react-redux";
import { getClassInfo } from "../../actions";

export const Class = props => {
  const { classes } = props.classes;

  const selectClass = name => {
    props.selectClass(name);
  };

  return (
    <div className="race">
      <h2 className="p-4" style={{ position: "sticky", top: -50, zIndex: 99 }}>
        Class
      </h2>
      <div className="dropdown btn-group-vertical w-75">
        {classes.map((name, idx) => (
          <div className="w-100 h-auto" key={idx}>
            <button
              className="btn btn-lg my-3 mx-0 options text-uppercase w-100"
              type="button"
              onClick={() => selectClass(name.name)}
            >
              {name.name}
            </button>
          </div>
        ))}
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5"
        style={{ position: "sticky", bottom: 10 }}
        onClick={() => props.setPage({ index: 2, name: "background" })}
      >
        OK
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  classes: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectClass: name => dispatch(getClassInfo(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
