import React from "react";
import { connect } from "react-redux";

export const Background = props => {
  return <div>background</div>;
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Background);
