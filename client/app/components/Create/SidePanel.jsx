import React from "react";
import { connect } from "react-redux";

export const SidePanel = props => {
  return (
    <div className="card bg-secondary w-100">
      <div className="card-body">
        <h4 className="card-title">
          <div
            style={{ backgroundColor: "white", padding: 20 }}
            className="card-title text-uppercase text-dark rounded w-75 m-auto"
          >
            High Elf
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
            +2 dexterity
            <br />
            +1 Intelligence
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
            Speed: 30
            <br />
            Size: Medium
          </div>
        </h6>
        <div
          className="card-text container-fluid mt-4"
          style={{ fontSize: 12, textAlign: "left" }}
        >
          <h6 className="row mb-3">
            <div className="col-12 text-dark text-center bg-light p-2 rounded text-uppercase">
              elf traits
            </div>
          </h6>
          <div className="row">
            <p className="col-12 text-dark bg-light p-2 rounded">
              <b className="text-uppercase text-dark fs-2">Dark Vision - </b>
              You have superior vision blah blah blah
            </p>
          </div>
          <div className="row">
            <p className="col-12 text-dark bg-light p-2 rounded">
              <b className="text-uppercase text-dark fs-2">Dark Vision - </b>
              You have superior vision blah blah blah
            </p>
          </div>
          <div className="row">
            <p className="col-12 text-dark bg-light p-2 rounded">
              <b className="text-uppercase text-dark fs-2">Dark Vision - </b>
              You have superior vision blah blah blah
            </p>
          </div>
          <div className="row">
            <p className="col-12 text-dark bg-light p-2 rounded">
              <b className="text-uppercase text-dark fs-2">Dark Vision - </b>
              You have superior vision blah blah blah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
