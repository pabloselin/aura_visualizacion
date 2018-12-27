import React, { Component } from "react";
import axios from "axios";
import MediaQuery from "react-responsive";
import Graph from "./Graph";
import TaxLabel from "./components/TaxLabel";
import styled from "styled-components";
import config from "../config";
import layouts from "./layouts";

const GraphWrapper = styled.div`
	font-family: "Josefin Sans", sans-serif;
	height: 100vh;
	width: 100%;
	overflow: hidden;
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
	#cy {
		height: 90vh;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
	.__________cytoscape_container {
		height: 100vh;
		width: 100%;
		z-index: 2;
	}
`;

const TaxSwitcherDesktop = styled.div`
	.taxswitcherlist {
		position: absolute;
		bottom: 60px;
		right: 24px;
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
				<Graph
					containerID="cy"
					data={this.state.curdata[this.state.curtax]["elements"]}
					layout={this.state.curlayout}
				/>
				<MediaQuery query="(min-device-width: 1024px)">
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
								{layouts[layout].name}
							</div>
						))}
					</LayoutSwitcher>
				</MediaQuery>
				<Horizonte>
					<TaxLabel curtax={this.state.curtax} />
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
