import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../redux/actions/auth';

const Logout = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  if (isLoggedIn === true) {
    dispatch(logout());
  }
  return <Redirect to="/" />;
};

export default Logout;
