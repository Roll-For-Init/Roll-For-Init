// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
// import Header from "../Header/Header";
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/NotFound';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import Upload from './components/Upload';
import Create from './components/Create';
import DashBoard from './components/DashBoard';

import { finishLoading } from './redux/actions/app';

const App = () => {
  const isAppLoading = useSelector(state => state.app.isAppLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAppLoading) {
      dispatch(finishLoading());
    }
  }, []);
  return (
    <Router>
      {/* <Header /> */}
      <main className="main">
        {isAppLoading && <React.Fragment>LOADING</React.Fragment>}
        <div>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/dashboard" component={DashBoard} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </Router>
  );
};

export default App;
