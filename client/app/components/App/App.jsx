import React from "react";
// import Header from "../Header/Header";
import "./styles.scss";
// eslint-disable-next-line react/prop-types
const App = ({ children }) => (
  <>
    {/* <Header /> */}

    <main className="main">{children}</main>
  </>
);

export default App;
