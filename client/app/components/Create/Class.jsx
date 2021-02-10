import React from "react";
import { connect } from "react-redux";

export const Class = props => {
  return <div>class</div>;
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Class);
