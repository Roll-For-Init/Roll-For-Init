import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { register } from '../../redux/actions/auth';
import validator from 'validator';

import './styles.scss';
import Error from '../Form/Error';

const reduxField = ({ placeholder, input, meta }) => {
  return (
    <div className="input-group mb-3">
      <input {...input} className="form-control" placeholder={placeholder} />
      {meta.error && meta.touched && <Error err={meta.error} />}
    </div>
  );
};

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
  };
  if (isLoggedIn === true) {
    return <Redirect to="/" />;
  }
  if (submitted === true) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="container signup">
      <div className="filler-space"></div>
      <div className="row align-items-center">
        <div className="col-1 col-md"></div>
        <div className="col col-md-6 mb-5">
          <img
            className="logo"
            src={require('../../../public/assets/imgs/logo.png')}
          />
        </div>
        <div className="col-1 col-md"></div>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={values => validate(values)}
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
              <p className="text-center text-danger m-0">
                {alert && alert.message && <Error err={alert.message} />}
              </p>
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
