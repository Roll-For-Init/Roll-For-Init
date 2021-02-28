import React from 'react';
import { useDispatch, connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../redux/actions/auth';

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
}

const Logout = props => {
  const { isLoggedIn } = props;
  const dispatch = useDispatch();
  if (isLoggedIn === true) {
    dispatch(logout());
  }
  return <Redirect to="/" />;
};

export default connect(mapStateToProps)(Logout);
