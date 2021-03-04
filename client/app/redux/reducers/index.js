import { combineReducers } from 'redux';

import auth from './auth';
import app from './app';
import characters from './characters';
// import game from './game';
import alert from './alert';

export default combineReducers({
  auth,
  app,
  characters,
  // game,
  alert,
});
