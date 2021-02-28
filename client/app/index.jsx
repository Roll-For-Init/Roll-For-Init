import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import './index.scss';
import App from './App.jsx';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('app')
);

if (module.hot)
  // eslint-disable-line no-undef
  module.hot.accept(); // eslint-disable-line no-undef
