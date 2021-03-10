import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Race from './Race';
import Class from './Class';
import Background from './Background';
import Abilities from './Abilities';
import Options from './Options';
import Descriptions from './Descriptions';
import Equipment from './Equipment';
import MobileMenu from './MobileMenu';

import { startCharacter } from '../../redux/actions/';

import './styles.scss';
import Header from '../shared/Header';
//import {backgroundCaller} from '../apiCaller';

const buttonNames = [
  'race',
  'class',
  'abilities',
  'background',
  'options',
  'description',
  'equipment',
];

const Loading = () => {
  return <React.Fragment>LOADING_CHARACTER</React.Fragment>;
};

const PageViewer = ({ charID }) => {
  let pages;

  const [page, setPage] = useState({ name: 'abilities', index: 2 });

  const onPageChange = (page, index) => {
    setPage({ name: page, index: index });
    window.scrollTo(0, 0);
  };
/*FOR DEBUGGING ONLY 
useEffect(() => {
  console.log("in useeffect");
  const fetchData = async () => {
    let apiData = {dummy: "stupid"}
    apiData = await backgroundCaller("/api/backgrounds/acolyte");
  }
  fetchData();
}, []);
*/

  const getPage = page => {
    switch (page.name) {
      case 'race':
        pages = <Race setPage={setPage} page={page} charID={charID} />;
        break;
      case 'class':
        pages = <Class setPage={setPage} page={page} charID = {charID}/>;
        break;
      case 'abilities':
        pages = <Abilities setPage={setPage} page={page} />;
        break;
      case 'background':
        pages = <Background setPage={setPage} page={page} charID = {charID}/>;
        break;
      case 'abilities':
        pages = <Abilities setPage={setPage} page={page} charID = {charID}/>;
        break;
      case 'description':
        pages = <Descriptions setPage={setPage} page={page} charID = {charID}/>;
        break;
      case 'equipment':
        pages = <Equipment setPage={setPage} page={page} charID = {charID}/>;
        break;
        /*
      case 'spells':
        pages = <Spells setPage={setPage} page={page} charID = {charID}/>;
      break;*/
    }
  };

  const [currentPage, setCurrentPage] = useState(getPage(page));

  useEffect(() => {
    console.log('page', charID);
    let nextPage = getPage(page);
    setCurrentPage(nextPage);
  }, [page]);

  return (
    <div className="row position-relative" style={{ top: '45px' }}>
      <div className="col-3 d-none d-md-block side-bar overflow-auto">
        <div className="btn-group-vertical w-100" role="group">
          {buttonNames.map((name, idx) => {
            let classname = 'btn btn-lg btn-secondary menu-button';
            if (page.name === name) {
              classname = 'btn btn-lg btn-primary menu-button active';
            }
            return (
              <button
                key={name}
                type="button"
                className={classname}
                //disabled={page.index < idx}
                onClick={() => {
                  page.index != idx && onPageChange(name, idx);
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      <MobileMenu
        buttonNames={buttonNames}
        page={page}
        pages={pages}
        setPage={setPage}
      />
      <div className="col-md-9 offset-md-3 pb-0 pt-md-3 container">
        {charID ? pages : <Loading />}
      </div>
      {/* <div className="col-3 p-4 container overflow-auto">
      {selectedInfo ? (
        <SidePanel />
      ) : (
        <div className="card mt-5 p-5 side-bar">
          <div className="card-header">
            <h4>Nothing Is Selected</h4>
          </div>
        </div>
      )}
    </div> */}
    </div>
  );
};

const Create = () => {
  const dispatch = useDispatch();

  const [charID, setCharID] = useState('');

  useEffect(() => {
    const uuid = dispatch(startCharacter());
    setCharID(uuid);
    console.log(uuid);
  }, []);

  return (
    <div className="create">
      <Header />
      <div className="container-fluid">
        {charID ? <PageViewer charID={charID} /> : 'NOCHAR'}
      </div>
    </div>
  );
};

export default Create;
