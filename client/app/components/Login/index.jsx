import React from 'react';
import { useDispatch, connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { login } from '../../redux/actions/auth';

import './styles.scss';
import validator from 'validator';

const reduxField = ({ placeholder, input, meta }) => (
  <div className="input-group mb-3">
    <input {...input} className="form-control" placeholder={placeholder} />
    {meta.error && meta.touched && (
      <span style={{ width: '100%', color: 'red' }}>{meta.error}</span>
    )}
  </div>
);

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    message: state.message,
  };
}

const validate = values => {
  const errors = {};
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
  return errors;
};

const Login = props => {
  const { isLoggedIn, message } = props;
  const dispatch = useDispatch();
  const onSubmit = values => {
    const { email, password } = values;
    dispatch(login(email, password));
  };
  if (isLoggedIn === true) {
    return <Redirect to="/" />;
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
        render={({ handleSubmit, form, submitting, invalid, values }) => (
          <form onSubmit={handleSubmit} className="needs-validation input-form">
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
            <div className="d-grid gap-2">
              <Link to="/">
                <button
                  type="button"
                  onClick={form.reset}
                  className="btn btn-secondary btn-lg"
                  disabled={submitting}
                >
                  Back
                </button>
              </Link>
              {/* <Link to="/dashboard"> */}
              <button
                type="submit"
                disabled={submitting || invalid}
                className="btn btn-primary btn-lg"
              >
                Log In
              </button>
              {/* </Link> */}
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default connect(mapStateToProps)(Login);
