import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

const wrapper = document.getElementById("aura_visualizacion");
let edicion = wrapper.dataset.edicion ? wrapper.dataset.edicion : 'azul';
let url = wrapper.dataset.url
	? wrapper.dataset.url
	: "http://auraaustral.local";

ReactDOM.render(<App url={url} edicion={edicion} />, wrapper);
