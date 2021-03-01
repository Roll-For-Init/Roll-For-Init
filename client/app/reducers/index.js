import { combineReducers } from "redux";
import { signUp } from "./signUp";
import { login } from "./login";
import { createCharacter } from "./createCharacter";

export const rootReducer = combineReducers({
  signUp: signUp,
  login: login,
  createCharacter: createCharacter
});
