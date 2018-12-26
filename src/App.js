import React, { Component } from "react";
import axios from "axios";
import MediaQuery from "react-responsive";
import Graph from "./Graph";
import styled from "styled-components";
import config from "../config";

const GraphWrapper = styled.div`
	font-family: "Josefin Sans", sans-serif;
	min-height: 100vh;
	min-width: 100%;
	background-color: transparent;
	background-image: url(https://auraaustral.cl/wp-content/uploads/2018/09/20160607_104046-1920x1080.jpg);
	background-size: cover;
	position: relative;
	&:after {
		content: "";
		background: rgba(0, 0, 0, 0.9);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.graph {
		min-height: 90vh;
		min-width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
`;

const TaxLabel = styled.div`
	position: absolute;
	left: 12px;
	bottom: 24px;
	font-size: 60px;
	z-index: 3;
	text-align: center;
	.label {
		color: white;
		text-transform: uppercase;
		transform: rotate(-90deg);
		transform-origin: 0 0;
	}
	@media screen and (max-width: 768px) {
		font-size: 18px;
		bottom: 48px;
	}
`;

const ActiveNodeZone = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 3;
	color: white;
	padding: 12px;

	h1 {
		font-size: 18px;
		font-weight: normal;
	}

	h2 {
		font-size: 14px;
		font-weight: normal;
	}

	a {
		color: white;
		text-decoration: none;
	}
`;

const TaxSwitcherDesktop = styled.div`
	.taxswitcherlist {
		position: absolute;
		bottom: 12px;
		right: 0;
		z-index: 2;
		.tax {
			cursor: pointer;
			color: white;
			display: inline-block;
			padding: 4px;
		}
		.active,
		.tax:hover {
			font-weight: bold;
			background-color: white;
			color: #000;
		}
	}
`;

const TaxSwitcherMobile = styled.div`	
		.wrapper {
			width: 100%;
			height: 100vh;
			position: absolute;
			z-index: 10;
			background-color: rgba(0, 0, 0, 0.6);
			top: 0;
			.taxswitcherlist {
				padding: 32px;
				.tax {
			cursor: pointer;
			color: white;
			display: block;
			padding: 4px;
			font-size: 24px;
			text-align: center;
		}
		.active,
		.tax:hover {
			font-weight: bold;
			background-color: white;
			color: #000;
		}
			}
		}
		p.closebtn {
			color: white;
			text-align: center;
			font-size: 24px;
			padding: 6px;
			margin: 12px auto;
			border: 1px solid white;
			border-radius: 4px;
			max-width: 160px;
		}
	}
`;

const LayoutSwitcher = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	color: white;
	z-index: 4;
	.switcher {
		cursor: pointer;
		display: inline-block;
		padding: 6px;
		background-color: #333;
		margin: 6px;
		&.active {
			background-color: white;
			color: #333;
		}
	}
`;

const Horizonte = styled.div`
	position: absolute;
	bottom: -45px;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	border-top: 2px solid white;
	border-radius: 50%;
	height: 135px;
	z-index: 3;
`;

const Menumobile = styled.div`
	text-align: center;
	position: absolute;
	bottom: 45px;
	width: 100%;
	span.plusSign {
		margin: 0 auto;
		font-size: 32px;
		display: block;
		width: 60px;
		padding: 3px 24px;
		display: block;
		color: white;
		font-family: "Josefin Sans";
		border-width: 1px 1px 0 1px;
		border-color: white;
		border-style: solid;
		border-radius: 6px 6px 0 0;
	}
`;

//Other Layouts

const layouts = {
	random: {
		name: "random",
		fit: true,
		circle: true,
		padding: 10,
		nodeDimensionsIncludeLabels: false
	},
	grid: {
		name: "grid",
		fit: true,
		padding: 10,
		nodeDimensionsIncludeLabels: false
	},
	breadthfirst: {
		name: "breadthfirst",
		fit: true,
		circle: true,
		padding: 10,
		nodeDimensionsIncludeLabels: true
	},
	cose: {
		name: "cose",
		fit: true,
		circle: true,
		padding: 10,
		nodeDimensionsIncludeLabels: true
	},
	concentric: {
		name: "concentric",
		fit: true,
		circle: true,
		padding: 10,
		nodeDimensionsIncludeLabels: false
	}
};

//Graph Style Array NOT Styled component

const nodeColor = "#fff";

const graphStyle = [
	{
		selector: "*",
		style: {
			opacity: 0
		}
	},
	{
		selector: "node",
		style: {
			"background-color": nodeColor,
			"font-family": "Arial, Helvetica, sans-serif",
			"font-weight": 300,
			width: "12px",
			height: "12px",
			"font-size": "12px",
			color: nodeColor,
			"text-max-width": "260px",
			"text-wrap": "wrap",
			"text-background-color": "black",
			"text-background-opacity": 1,
			"text-background-padding": "2px",
			"text-background-shape": "rectangle",
			"text-valign": "middle",
			"transition-property": "background-color"
		}
	},
	{
		selector: "edge",
		style: {
			width: "0",
			color: "rgba(255,255,255, 0.6)",
			"line-style": "dashed",
			"line-color": nodeColor,
			"line-dash-pattern": [6, 10],
			"curve-style": "unbundled-bezier",
			"control-point-distances": 120,
			"control-point-weights": 0.1
		}
	},
	{
		selector: "edge.hover",
		style: {
			width: "0.5px",
			"line-style": "dashed",
			color: nodeColor
		}
	},
	{
		selector: "node.selected",
		style: {
			"background-color": "#333",
			"border-color": nodeColor
		}
	},
	{
		selector: "node.hover",
		style: {
			"background-color": "#333",
			"border-color": nodeColor
		}
	},
	{
		selector: "node.articulo",
		style: {
			"background-color": nodeColor,
			"background-image": "data(img)",
			"border-width": "1px",
			"border-color": nodeColor,
			width: "32px",
			height: "32px",
			shape: "point"
		}
	},
	{
		selector: "node.articulo.hover",
		style: {
			label: "data(name)"
		}
	},
	{
		selector: "node.term",
		style: {
			label: "data(name)",
			"text-max-width": "120px",
			"text-wrap": "ellipsis",
			"text-valign": "bottom",
			"text-halign": "center",
			"text-margin-y": "0"
		}
	},
	{
		selector: "node.term.hover",
		style: {
			"border-width": "1px",
			"border-color": nodeColor,
			"text-wrap": "none"
		}
	}
];

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null,
			taxonomies: [
				"lugares",
				"personajes",
				"pueblos",
				"expediciones",
				"hitos",
				"publicaciones",
				"instituciones",
				"fauna",
				"flora"
			],
			curtax: "lugares",
			articles: null,
			curlayout: layouts.random,
			mobileswitcher: false
		};

		this.switchTax = this.switchTax.bind(this);
	}

	componentDidMount() {
		this.getData();
		console.log(this.props);
	}

	getData() {
		let url;
		if (process.env.NODE_ENV === "production") {
			url = `${this.props.url}/${config.production.api_url}taxtree`;
		} else {
			url = `${this.props.url}/${config.dev.api_url}taxtree`;
		}

		console.log(url);
		axios.get(url).then(response => {
			this.setState({
				data: response.data,
				curdata: response.data[this.props.edicion]
			});
		});
	}

	switchTax(taxonomy) {
		this.setState({ curtax: taxonomy, mobileswitcher: false });
	}

	toggleTaxSwitch() {
		this.setState({ mobileswitcher: !this.state.mobileswitcher });
	}

	cyRef(cy) {
		this.cy = cy;
		cy.elements("*")
			.animate({
				// you can create a collection with edges and nodes for this
				style: { opacity: 0 },
				duration: 200,
				easing: "ease-in-sine"
			})
			.delay(200)
			.animate({
				style: { opacity: 0.2 },
				duration: 200,
				easing: "ease-in-sine"
			})
			.delay(0)
			.animate({
				style: { opacity: 1 },
				duration: 200,
				easing: "ease-in-sine"
			});
		let articulos = cy.elements('node[type="articulo"]');
		let ediciones = cy.elements('node[type="edicion"]');
		let terms = cy.elements('node[type="term"]');
		ediciones.addClass("edicion");
		articulos.addClass("articulo");
		terms.addClass("term");
		cy.on("tap", "node", function(evt) {
			let node = evt.target;
			node.addClass("active");
			if (node.data().link !== undefined) {
				window.location.href = node.data().link;
			}
		});
		cy.on("mouseover", "node", function(evt) {
			cy.elements("node").removeClass("hover");
			let node = evt.target;
			node.addClass("hover");
			let neighbors = cy
				.elements("node#" + node.id())
				.closedNeighborhood();
			neighbors.addClass("hover");
		});
		cy.on("taphold", "node", function(evt) {
			cy.elements("node").removeClass("hover");
			let node = evt.target;
			node.addClass("hover");
			let neighbors = cy
				.elements("node#" + node.id())
				.closedNeighborhood();
			neighbors.addClass("hover");
		});
		cy.on("mouseout", "node", function(evt) {
			cy.elements("node, edge").removeClass("hover");
		});
		cy.on("tapend", "node", function(evt) {
			cy.elements("node, edge").removeClass("hover");
		});
	}

	activeNode(id) {
		setState({ activeNode: id });
	}

	switchLayout(layout) {
		console.log(layout);
		this.setState({
			curlayout: layout
		});
	}

	handleEval() {
		const cy = this.cy;
		const str = this.text.value;
		eval(str);
	}

	searchArticles(nodeid) {
		let results = [];
		this.state.curdata["articulos"].map(articulo => {
			if (articulo.terms[this.state.curtax] !== false) {
				articulo.terms[this.state.curtax].map(term => {
					if (term.term_id === parseInt(nodeid)) {
						results.push(articulo);
					}
				});
			}
		});
		this.setState({
			articles: results
		});
	}

	render() {
		const taxswitcher = (
			<div className="taxswitcherlist">
				{this.state.taxonomies.map(taxonomy => (
					<div
						className={
							this.state.curtax === taxonomy
								? "tax active"
								: "tax default"
						}
						onClick={() => this.switchTax(taxonomy)}
					>
						{taxonomy}
					</div>
				))}
			</div>
		);
		return this.state.data !== null ? (
			<GraphWrapper>
				<Graph
					containerID="cy"
					data={this.state.curdata[this.state.curtax]["elements"]}
					cyRef={cy => {
						this.cyRef(cy);
					}}
					graphStyle={graphStyle}
					layout={this.state.curlayout}
				/>
				<MediaQuery query="(min-device-width: 1024px)">
					<LayoutSwitcher>
						{Object.keys(layouts).map((layout, index) => (
							<div
								className={
									this.state.curlayout.name ===
									layouts[layout].name
										? "switcher active"
										: "switcher"
								}
								onClick={() =>
									this.switchLayout(layouts[layout])
								}
							>
								{layouts[layout].name}
							</div>
						))}
					</LayoutSwitcher>
				</MediaQuery>
				<Horizonte>
					<TaxLabel>
						<div className="label">{this.state.curtax}</div>
					</TaxLabel>
					<MediaQuery query="(min-device-width: 1024px)">
						<TaxSwitcherDesktop>{taxswitcher}</TaxSwitcherDesktop>
					</MediaQuery>
					<MediaQuery query="(max-width: 1023px)">
						<Menumobile onClick={() => this.toggleTaxSwitch()}>
							<span className="plusSign">+</span>
						</Menumobile>
					</MediaQuery>
				</Horizonte>
				{this.state.mobileswitcher === true ? (
					<TaxSwitcherMobile>
						<div className="wrapper">
							{taxswitcher}{" "}
							<p
								className="closebtn"
								onClick={() => this.toggleTaxSwitch()}
							>
								Cerrar
							</p>
							<p className="help" />
						</div>
					</TaxSwitcherMobile>
				) : null}
			</GraphWrapper>
		) : (
			<div className="loading">Cargando</div>
		);
	}
}

export default App;
