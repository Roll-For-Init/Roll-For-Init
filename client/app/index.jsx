import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './components/App/App';
import NotFound from './components/App/NotFound';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import Upload from './components/Upload';
import Create from './components/Create';
import DashBoard from './components/DashBoard';

import './styles.scss';

render(
  <Provider store={store}>
    <Router>
      <App>
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
      </App>
    </Router>
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('app')
);

if (module.hot)
  // eslint-disable-line no-undef
  module.hot.accept(); // eslint-disable-line no-undef
