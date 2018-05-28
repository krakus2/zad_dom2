import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text }) => <span style={{color: "#ae5856", width: "205px", display: "block", textAlign: "center"}}>{text}</span>

InlineError.propTypes = {
  text: PropTypes.string.isRequired
}

export default InlineError;
