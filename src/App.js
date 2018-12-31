import React, { Component } from "react";
import axios from "axios";
import MediaQuery from "react-responsive";
import Graph from "./Graph";
import TaxLabel from "./components/TaxLabel";
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
	//background-image: url(https://auraaustral.cl/wp-content/uploads/2018/09/20160607_104046-1920x1080.jpg);
	background-size: cover;
	position: relative;
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
	}
	.__________cytoscape_container {
		height: 70vh;
		width: 100%;
		min-height: 600px;
		z-index: 2;
		margin-top: 24px;
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
		background-color:white;
		padding: 0 6px;
		text-align: center;
		display: inline-block;
		cursor: pointer;
		margin-right: 6px;
		width: 16px;
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
		&.active, &:hover {
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
	span.plusSign {
		margin: 0 auto;
		font-size: 32px;
		display: block;
		width: 60px;
		line-height: 60px;
		display: block;
		color: white;
		font-family: "Josefin Sans";
		font-size: 96px;
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
			zoom: 1
		};

		this.switchTax = this.switchTax.bind(this);
	}

	componentDidMount() {
		this.getData();
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
		});
	}

	switchTax(taxonomy) {
		this.setState({ curtax: taxonomy, mobileswitcher: false });
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
			zoom: this.state.zoom + zoomFactor
		})
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
			<GraphWrapper>
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
								>{index + 1}</div>
							))}
						</LayoutSwitcher>
						<ZoomSwitcher>
							<span className="zoomPlus" onClick={()=> this.zoomGraph(0.2)}>+</span>
							<span className="zoomMinus" onClick={() => this.zoomGraph(-0.2)}>-</span>
						</ZoomSwitcher>
					</TaxSwitcherDesktop>
				</MediaQuery>
				<MediaQuery query="(max-width: 1023px)">
					<Menumobile onClick={() => this.toggleTaxSwitch()}>
						<span className="plusSign">+</span>
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
			</GraphWrapper>
		) : (
			<div className="loading">Cargando</div>
		);
	}
}

export default App;
