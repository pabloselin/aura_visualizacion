import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

const wrapper = document.getElementById("aura_visualizacion");
let edicion = wrapper.dataset.edicion ? wrapper.dataset.edicion : "azul";
let isglobal = wrapper.dataset.isglobal ? wrapper.dataset.isglobal : "true";
let url = wrapper.dataset.url
	? wrapper.dataset.url
	: "http://auraaustral.local";

ReactDOM.render(
	<App url={url} isglobal={isglobal} edicion={edicion} />,
	wrapper
);
