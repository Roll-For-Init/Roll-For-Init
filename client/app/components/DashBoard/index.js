import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


export const DashBoard = () => {
    const user = useSelector(state => state.user);
    console.log(user);

    const character = useSelector(state => state.characters);
    console.log(character);

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
      {Object.keys(character).map((key) => {
            return (<p>{character[key].race.index + " " + character[key].class?.index}</p>)
        })}
    </div>
  );
};

export default DashBoard;
