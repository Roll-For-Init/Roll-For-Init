import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { register } from '../../redux/actions/auth';
import { setAlert } from '../../redux/actions/alert';
import validator from 'validator';

import './styles.scss';
import Error from '../Form/Error';

const reduxField = ({ placeholder, input, meta }) => (
  <div className="input-group mb-3">
    <input {...input} className="form-control" placeholder={placeholder} />
    {meta.error && meta.touched && <Error>{meta.error}</Error>}
  </div>
);

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else {
    if (!validator.isEmail(values.email)) {
      errors.email = 'Not a valid email address';
    }
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

const SignUp = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const alert = useSelector(state => state.alert);
  const submitted = alert && alert.submitted ? alert.submitted : false;
  const dispatch = useDispatch();
  const onSubmit = values => {
    const { username, email, password } = values;
    dispatch(register(username, email, password));
    dispatch(setAlert({ submitted: true }));
  };
  if (isLoggedIn === true) {
    return <Redirect to="/" />;
  }
  if (submitted === true) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="container">
      <div className="filler-space"></div>
      <div className="row align-items-center">
        <div className="col"></div>
        <div className="col-6 logo"></div>
        <div className="col"></div>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        // eslint-disable-next-line no-unused-vars
        render={({ handleSubmit, form, submitting, invalid, values }) => (
          <form onSubmit={handleSubmit} className="needs-validation input-form">
            <Field
              type="text"
              name="username"
              component={reduxField}
              placeholder="username"
            />
            <Field
              type="text"
              name="email"
              component={reduxField}
              placeholder="email"
            />
            <Field
              type="password"
              name="password"
              component={reduxField}
              placeholder="password"
            />
            <Field
              type="password"
              name="confirmPassword"
              component={reduxField}
              placeholder="confirm password"
            />
            <div className="d-grid gap-2">
              <Link to="/">
                <button
                  type="button"
                  onClick={form.reset}
                  className="btn btn-lg btn-secondary"
                  disabled={submitting}
                >
                  Back
                </button>
              </Link>
              <button
                type="submit"
                disabled={submitting || invalid}
                className="btn btn-lg btn-primary"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default SignUp;
