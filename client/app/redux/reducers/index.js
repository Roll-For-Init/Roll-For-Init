import { combineReducers } from 'redux';

import auth from './auth';
import app from './app';
// import character from './character';
// import game from './game';
import alert from './alert';

export default combineReducers({
  auth,
  app,
  // character,
  // game,
  alert,
});
