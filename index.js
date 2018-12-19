import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

ReactDOM.render(<App />, document.getElementById("aura_visualizacion"));

//const PageComponent = ReactDOM.render(<App ref={(pageComponent) => {window.pageComponent = pageComponent}}/>, document.getElementById("aura_visualizacion"));