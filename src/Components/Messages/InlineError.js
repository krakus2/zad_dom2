import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text, style }) => (
  <span style={{color: "#ae5856", width: `${style.width}`, display: "block", textAlign: `${style.textAlign}`, marginBottom: `${style.marginBottom}`}}>{text}</span>
)

InlineError.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired
}

export default InlineError;
