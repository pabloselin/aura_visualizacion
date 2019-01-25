import React, { Component } from "react";
import axios from "axios";
import MediaQuery from "react-responsive";
import Graph from "./Graph";
import TaxLabel from "./components/TaxLabel";
import TermNav from "./components/TermNav";
import styled from "styled-components";
import config from "../config";
import layouts from "./layouts";
import Breadthfirst from "./svg/breadthfirst.svg";
import concentric from "./svg/concentric.svg";
import cose from "./svg/cose.svg";
import grid from "./svg/grid.svg";
import random from "./svg/random.svg";
import SVG from "react-inlinesvg";

const GraphWrapper = styled.div`
	font-family: "Josefin Sans", sans-serif;
	overflow: hidden;
	background-color: transparent;
	background-size: cover;
	position: relative;
	height: 100%;
	max-height: 100vh;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	#cy {
		height: 90vh;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		overflow: hidden;
	}
	.__________cytoscape_container {
		height: 70vh;
		width: 100%;
		min-height: 600px;
		z-index: 2;
		margin-top: 42px;
		cursor: crosshair;
		@media screen and (max-width: 768px) {
			height: 100vh;
		}
	}
`;

const ZoomSwitcher = styled.div`
	font-size: 24px;
	color: #333;
	z-index: 10;
	position: absolute;
	left: 0;
	top: 0;
	span {
		background-color: white;
		padding: 0 6px;
		text-align: center;
		display: inline-block;
		cursor: pointer;
		margin-right: 6px;
		width: 24px;
		line-height: 26px;
		&:hover {
			background-color: #000;
			color: white;
		}
	}
`;

const TaxSwitcherDesktop = styled.div`
	.taxswitcherlist {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		text-align: center;
		.tax {
			cursor: pointer;
			color: white;
			display: inline-block;
			padding: 4px;
			border-bottom: 1px solid white;
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
			z-index: 12;
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
	top: 0;
	right: 0;
	color: white;
	z-index: 10;
	.switcher {
		cursor: pointer;
		display: inline-block;
		padding: 8px;
		background-color: #333;
		margin: 6px;
		border-radius: 50%;
		font-size: 10px;
		line-height: 5px;
		&.active,
		&:hover {
			background-color: white;
			color: #333;
		}
	}
`;

const Horizonte = styled.div`
	position: absolute;
	bottom: -95px;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	border-top: 2px solid white;
	border-radius: 50%;
	height: 175px;
	z-index: 3;
`;

const Menumobile = styled.div`
	text-align: center;
	position: absolute;
	bottom: 0;
	width: 100%;
	z-index: 10;
	display: flex;
	justify-content: center;
	span.plusSign {
		display: block;
		width: 60px;
		line-height: 60px;
		display: block;
		color: white;
		font-family: "Josefin Sans";
		font-size: 54px;
	}
	span.info {
		font-size: 36px;
		width: 60px;
		line-height: 67px;
		display: block;
		color: white;
		font-weight: bold;
		font-family: "Josefin Sans";
	}
`;

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
			mobileswitcher: false,
			zoom: 1,
			navActive: false,
			toggleTermNav: false
		};

		this.switchTax = this.switchTax.bind(this);
		this.toggleTermNav = this.toggleTermNav.bind(this);
		//this.handleTerm = this.handleTerm.bind(this);
	}

	componentDidMount() {
		let isglobal = this.props.isglobal == "true";
		if (isglobal === true) {
			this.getDataGlobal();
		} else {
			this.getData();
		}
	}

	getDataGlobal() {
		let url;
		if (process.env.NODE_ENV === "production") {
			url = `${this.props.url}/${config.production.api_url}globaltaxtree`;
		} else {
			url = `${this.props.url}/${config.dev.api_url}globaltaxtree`;
		}
		axios.get(url).then(response => {
			this.setState({
				data: response.data,
				curdata: response.data
			});
			this.buildTermList(this.state.curtax);
		});
	}

	getData() {
		let url;
		if (process.env.NODE_ENV === "production") {
			url = `${this.props.url}/${config.production.api_url}taxtree`;
		} else {
			url = `${this.props.url}/${config.dev.api_url}taxtree`;
		}
		axios.get(url).then(response => {
			this.setState({
				data: response.data,
				curdata: response.data[this.props.edicion]
			});
			this.buildTermList(this.state.curtax);
		});
	}

	switchTax(taxonomy) {
		this.setState({ curtax: taxonomy, mobileswitcher: false });
		this.buildTermList(taxonomy);
	}

	toggleTermNav() {
		this.setState({ toggleTermNav: !this.state.toggleTermNav });
	}

	toggleTaxSwitch() {
		this.setState({ mobileswitcher: !this.state.mobileswitcher });
	}

	activeNode(id) {
		setState({ activeNode: id });
	}

	switchLayout(layout) {
		this.setState({
			curlayout: layout
		});
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

	zoomGraph(zoomFactor) {
		this.setState({
			zoom:
				this.state.zoom >= 0
					? this.state.zoom + zoomFactor
					: this.state.zoom
		});
	}

	buildTermList(taxonomy) {
		let terms = [];
		let articles = [];
		let edges = [];
		{
			this.state.curdata[taxonomy]["elements"].map(term => {
				if (term.data.type === "term") {
					terms.push(term.data);
				} else if (term.data.type === "articulo") {
					articles.push(term.data);
				} else if (term.group === "edges") {
					edges.push(term.data);
				}
			});
		}
		this.setState({ terms, articles, edges });
	}

	render() {
		const taxswitcher = (
			<div className="taxswitcherlist">
				{this.state.taxonomies.map(taxonomy => (
					<div
						key={taxonomy}
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
			<div>
				<GraphWrapper>
					{this.state.mobileswitcher === true ? (
						<TaxSwitcherMobile>
							<div className="wrapper">
								{taxswitcher}{" "}
								<p
									className="closebtn"
									onClick={() => this.toggleTaxSwitch()}
								>
									x [cerrar]
								</p>
								<p className="help" />
							</div>
						</TaxSwitcherMobile>
					) : null}
					<MediaQuery query="(min-device-width: 1024px)">
						<TaxSwitcherDesktop>
							{taxswitcher}
							<LayoutSwitcher>
								{Object.keys(layouts).map((layout, index) => (
									<div
										key={`layout-${index}`}
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
										{index + 1}
									</div>
								))}
							</LayoutSwitcher>
							<ZoomSwitcher>
								<span
									className="info"
									onClick={this.toggleTermNav}
								>
									i
								</span>
								<span
									className="zoomPlus"
									onClick={() => this.zoomGraph(0.1)}
								>
									+
								</span>
								<span
									className="zoomMinus"
									onClick={() => this.zoomGraph(-0.1)}
								>
									-
								</span>
							</ZoomSwitcher>
						</TaxSwitcherDesktop>
					</MediaQuery>
					<MediaQuery query="(max-width: 1023px)">
						<Menumobile>
							<span
								className="plusSign"
								onClick={() => this.toggleTaxSwitch()}
							>
								+
							</span>
							<span className="info" onClick={this.toggleTermNav}>
								i
							</span>
						</Menumobile>
					</MediaQuery>
					<Graph
						containerID="cy"
						data={this.state.curdata[this.state.curtax]["elements"]}
						layout={this.state.curlayout}
						zoom={this.state.zoom}
					/>
					<Horizonte>
						<TaxLabel curtax={this.state.curtax} />
					</Horizonte>
					<TermNav
						active={this.state.toggleTermNav}
						curtax={this.state.curtax}
						terms={this.state.terms}
						articles={this.state.articles}
						edges={this.state.edges}
						toggleTermNav={this.toggleTermNav}
					/>
				</GraphWrapper>
			</div>
		) : (
			<div className="loading">Cargando</div>
		);
	}
}

export default App;
