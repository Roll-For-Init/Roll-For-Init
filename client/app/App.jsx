// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
// import Header from "../Header/Header";
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import NotFound from './components/NotFound';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import Upload from './components/Upload';
import Create from './components/Create';
import DashBoard from './components/DashBoard';
import Legal from './components/Legal';

import { finishLoading } from './redux/actions/app';
import { clearAlert } from './redux/actions/alert';

export const history = createBrowserHistory();

const App = () => {
  const { isAppLoading, awaiting } = useSelector(state => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(clearAlert()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    if (isAppLoading) {
      dispatch(finishLoading('app'));
    }
  }, []);

  return (
    <Router history={history}>
      {/* <Header /> */}
      <main className="main">
        {isAppLoading && awaiting.indexOf('app') > -1 && (
          <React.Fragment>LOADING</React.Fragment>
        )}
        <div>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/dashboard" component={DashBoard} />
            <Route exact path="/legal" component={Legal} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </Router>
  );
};

export default App;
