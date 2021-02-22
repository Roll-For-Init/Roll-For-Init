import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const LandingPage = () => {
  return (
    <div className="container">
      <div className="filler-space"></div>
      <div className="row align-items-center">
        <div className="col"></div>
        <div className="col-6 logo">
        </div>
        <div className="col"></div>
      </div>
      <div className="d-grid gap-2">
        <Link to="/create">
          <button type="button" className="btn btn-secondary btn-lg top-buttons">
            Create New Character
          </button>
        </Link>
        <Link to="/upload">
          <button type="button" className="btn btn-secondary btn-lg top-buttons">
            Upload Existing Character
          </button>
        </Link>
      </div>
      <div className="d-grid gap-6">
        <Link to="/login">
          <button type="button" className="btn btn-primary btn-lg btm-buttons">
            Log In
          </button>
        </Link>
        <Link to="/register">
          <button type="button" className="btn btn-primary btn-lg btm-buttons">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
