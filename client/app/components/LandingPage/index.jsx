import React from "react";
import { Link } from "react-router-dom";
import Upload from "../Upload";

import "./styles.scss";

const LandingPage = () => {
  return (
    <div className="container landing">
      <div className="filler-space"></div>
      <div className="row align-items-center">
        <div className="col"></div>
        <div className="col-6 logo"></div>
        <div className="col"></div>
      </div>
      <div className="d-grid gap-2">
        <Link to="/create">
          <button
            type="button"
            className="btn btn-secondary btn-lg top-buttons"
          >
            Create New Character
          </button>
        </Link>
        <button
          type="button"
          className="btn btn-secondary btn-lg top-buttons"
          data-toggle="modal"
          data-target="#uploadModal"
        >
          Upload Existing Character
        </button>
        <div
          className="modal fade"
          id="uploadModal"
          role="dialog"
          aria-labelledby="characterUpload"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>  */}
              <div className="modal-sect pb-0">
                <h5>Upload a Character</h5>
              </div>
              <div className="modal-sect">
                <p>Please upload your Roll For Init PDF character sheet.</p>
              </div>
              <Upload />
            </div>
          </div>
        </div>
      </div>
      <div className="d-grid gap-6">
        <Link to="/login">
          <button type="button" className="btn btn-primary btn-lg btm-buttons">
            Log In
          </button>
        </Link>
        <Link to="/signup">
          <button type="button" className="btn btn-primary btn-lg btm-buttons">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
