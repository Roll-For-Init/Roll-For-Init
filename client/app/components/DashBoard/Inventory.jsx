import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../shared/Header';
//import classIcon from '../../../public/assets/imgs/icons/off-white/class/rogue.png'
import { setUpdate, setArrayUpdate } from '../../redux/actions/characters';
import './styles.scss';
import FloatingLabel from 'floating-label-react';
import Modal from 'react-bootstrap4-modal';
import EditableLabel from 'react-inline-editing';

export const Inventory = () => {
  const user = useSelector(state => state.user);
  console.log(user);

  const charID = JSON.parse(localStorage.getItem('state')).app
    .current_character;
  const character = useSelector(state => state.characters[charID]);
  console.log(character);

  return character.level ? (
    <div id="dashboard" className="dashboard"></div>
  ) : (
    <>Loading...</>
  );
};
export default Inventory;
