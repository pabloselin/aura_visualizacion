import React, { Component } from "react";
import graphStyle from "./graphStyle";
import ReactCytoscape from "react-cytoscapejs";
import popper from "cytoscape-popper";

class Graph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNode: null
		};
	}

	cyRef(cy) {
		this.cy = cy;
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

	handleEval() {
		const cy = this.cy;
		const str = this.text.value;
		eval(str);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.layout !== prevProps.layout) {
			console.log("layout change");
		}
		if (this.props.data !== prevProps.data) {
			console.log("data change");
			let layout = this.cy.layout(this.props.layout);
			layout.run();
		}
	}

	render() {
		return (
			<ReactCytoscape
				containerID="cy"
				elements={ReactCytoscape.normalizeElements(this.props.data)}
				cy={cy => {
					this.cyRef(cy);
				}}
				wheelSensitivity={0.2}
				minZoom={0.7}
				maxZoom={1.4}
				layout={this.props.layout}
				stylesheet={graphStyle}
			/>
		);
	}
}

export default Graph;
