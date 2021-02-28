import React, { useEffect } from 'react';
// import Header from "../Header/Header";
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line react/prop-types
const App = ({ children }) => {
  const isAppLoading = useSelector(state => state.app.isAppLoading);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch();
  // }, []);

  return (
    <>
      {/* <Header /> */}
      <main className="main">
        {isAppLoading && <React.Fragment>LOADING</React.Fragment>}
        {children}
      </main>
    </>
  );
};

export default App;
