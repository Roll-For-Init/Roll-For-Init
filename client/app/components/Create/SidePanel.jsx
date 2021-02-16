import React from "react";
import { connect } from "react-redux";

const SidePanel = props => {
  const { name, skills, traits } = props.info;
  return (
    <div className="card w-100 side-bar">
      <div className="card-body">
        <h4 className="card-title">
          <div
            style={{ backgroundColor: "white", padding: 20 }}
            className="card-title text-uppercase text-dark rounded w-75 m-auto"
          >
            {name}
          </div>
        </h4>
        <h6 className="card-subtitle container-fluid px-0 mt-4 ">
          <div
            style={{
              backgroundColor: "white",
              padding: 10,
              fontSize: 12,
              textAlign: "left"
            }}
            className="text-dark col-5 d-inline-block rounded"
          >
            +{skills.dexterity} dexterity
            <br />+{skills.intelligence} Intelligence
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: 10,
              fontSize: 12,
              textAlign: "left"
            }}
            className="text-dark col-5 offset-2 d-inline-block rounded"
          >
            Speed: {skills.speed}
            <br />
            Size: {skills.size}
          </div>
        </h6>
        <div
          className="card-text container-fluid mt-4"
          style={{ fontSize: 12, textAlign: "left" }}
        >
          <h6 className="row mb-3">
            <div className="col-12 text-dark text-center bg-light p-2 rounded text-uppercase">
              {name} traits
            </div>
          </h6>
          {traits.map((trait, idx) => (
            <div className="row" key={idx}>
              <p className="col-12 text-dark bg-light p-2 rounded">
                <b className="text-uppercase text-dark fs-2">{trait.name} - </b>
                {trait.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  info: state.createCharacter.selectedInfo
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
