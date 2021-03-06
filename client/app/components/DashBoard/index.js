import React from 'react';
import { Link } from 'react-router-dom';

export const DashBoard = () => {
  return (
    <div className="container">
      <h1 className="display-1 text-center text-light title">
        Dashboard
        <Link to="/logout">
          <button
            type="button"
            className="btn btn-outline-danger log-out-button"
          >
            Log Out
          </button>
        </Link>
      </h1>
    </div>
  );
};

export default DashBoard;
