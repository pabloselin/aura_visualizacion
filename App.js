import React, { Component } from "react";
import axios from "axios";
import TaxLayer from "./TaxLayer";
import Graph from "./Graph";
import styled from "styled-components";
import config from "./config";

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

const TaxSwitcher = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 2;
	.tax {
		cursor: pointer;
		color: white;
		display: inline-block;
		padding: 4px;
	}
	.active {
		font-weight: bold;
		background-color: #555;
	}
`;

const LayoutSwitcher = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	color: white;
	z-index: 2;
	display: none;
`;

//Graph Style Array NOT Styled component

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
			"background-color": "white",
			"font-family": "Josefin Sans",
			"font-weight": 400,
			width: "16px",
			height: "16px",
			"font-size": "13px",
			color: "white",
			"text-max-width": "260px",
			"text-wrap": "wrap",
			"text-background-color": "#000",
			"text-background-opacity": 1,
			//"text-background-padding": "12px",
			"text-background-shape": "roundrectangle",
			"text-valign": "bottom",
			"transition-property": "background-color"
		}
	},
	{
		selector: "edge",
		style: {
			//display: "none",
			width: "0.5px",
			color: "rgba(255,255,255, 0.6)",
			"line-style": "dashed",
			"line-color": "white",
			"line-dash-pattern": [6, 10]
		}
	},
	{
		selector: "node.selected",
		style: {
			"background-color": "#333",
			"border-color": "white"
		}
	},
	{
		selector: "node.hover",
		style: {
			"background-color": "#333",
			"border-color": "white"
		}
	},
	{
		selector: "node.articulo",
		style: {
			"background-color": "black",
			"background-image": "data(img)",
			"border-width": "1px",
			"border-color": "white",
			width: "32px",
			height: "32px",
			label: "data(name)"
		}
	},
	{
		selector: "node.term.hover",
		style: {
			label: "data(name)",
			"border-width": "1px",
			"border-color": "white"
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
			curlayout: {
				name: "breadthfirst",
				fit: true,
				circle: true,
				padding: 10,
				nodeDimensionsIncludeLabels: false
			}
		};

		this.switchTax = this.switchTax.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		let url = `${config.dev.base_url + config.dev.api_url}taxtree`;
		console.log(url);
		axios.get(url).then(response => {
			this.setState({
				data: response.data,
				curdata: response.data.azul
			});
		});
	}

	switchTax(taxonomy) {
		this.setState({ curtax: taxonomy });
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
		cy.on("mouseout", "node", function(evt) {
			cy.elements("node").removeClass("hover");
		});
	}

	activeNode(id) {
		setState({ activeNode: id });
	}

	switchLayout(layout) {
		this.setState({
			curlayout: {
				name: "grid",
				fit: true,
				circle: true,
				padding: 10,
				nodeDimensionsIncludeLabels: false
			}
		})
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
				<TaxSwitcher>
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
				</TaxSwitcher>
				{this.state.articles !== null ? (
					<ActiveNodeZone>
						<h1>Articles</h1>
						{this.state.articles.map((article, key) => (
							<h2 key={key}>
								<a href={article.link}>{article.title}</a>
							</h2>
						))}
					</ActiveNodeZone>
				) : null}
				<LayoutSwitcher>
					<div
						className="switch-1"
						onClick={() => this.switchLayout("grid")}
					>
						1
					</div>
					<div
						className="switch-2"
						onClick={() => this.switchLayout("circle")}
					>
						2
					</div>
					<div
						className="switch-3"
						onClick={() => this.switchLayout("random")}
					>
						3
					</div>
					<div
						className="switch-4"
						onClick={() => this.switchLayout("breadthfirst")}
					>
						4
					</div>
					<div
						className="switch-5"
						onClick={() => this.switchLayout("concentric")}
					>
						5
					</div>
				</LayoutSwitcher>
			</GraphWrapper>
		) : (
			<div className="loading">Cargando</div>
		);
	}
}

export default App;
