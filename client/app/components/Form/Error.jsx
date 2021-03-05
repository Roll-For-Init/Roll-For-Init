import React from 'react';
import PropTypes from 'prop-types';

// TODO: remove inline styling
const Error = ({ err }) => {
  return <span style={{ width: '100%', color: 'red' }}>{err}</span>;
};
Error.propTypes = {
  err: PropTypes.string.isRequired,
};

export default Error;
