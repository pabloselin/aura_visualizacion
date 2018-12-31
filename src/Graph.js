import React, { Component } from "react";
import graphStyle from "./graphStyle";
import CytoscapeComponent from "react-cytoscapejs";
import popper from "cytoscape-popper";

class Graph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNode: null,
			_handleCyCalled: false,
			layoutChange: false
		};
	}

	handleCy = cy => {
		if (cy === this._cy && this.state._handleCyCalled) {
			return;
		}

		this._cy = cy;
		window.cy = cy;
		this.setState({ _handleCyCalled: true });

		let articulos = cy.elements('node[type="articulo"]');
		let ediciones = cy.elements('node[type="edicion"]');
		let terms = cy.elements('node[type="term"]');
		ediciones.addClass("edicion");
		articulos.addClass("articulo");
		terms.addClass("term");

		cy.on("tap", "node", event => {
			let node = event.target;
			node.addClass("active");
			// if (node.data().link !== undefined) {
			// 	window.location.href = node.data().link;
			// }
			this.setState({ activeNode: node.data() });
		});

		cy.on("mouseover", "node", event => {
			cy.elements("node").removeClass("hover");
			let node = event.target;
			let nodeid = node.id();

			node.addClass("hover");
			let neighbors = cy.elements("node#" + nodeid).closedNeighborhood();
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

		if (this.state.layoutChange === true) {
			let layout = cy.layout(this.props.layout);
			this.setState({ layoutChange: false });
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.props.layout !== prevProps.layout) {
			console.log("layout change");
		}
		if (this.props.data !== prevProps.data) {
			this._cy = cy;
			window.cy = cy;
			let articulos = cy.elements('node[type="articulo"]');
			let ediciones = cy.elements('node[type="edicion"]');
			let terms = cy.elements('node[type="term"]');
			ediciones.addClass("edicion");
			articulos.addClass("articulo");
			terms.addClass("term");
			let layout = cy.layout(this.props.layout);
			cy.zoom(this.props.layout.zoom);
			layout.run();
		}
		if(this.props.zoom !== prevProps.zoom) {
			this._cy = cy;
			window.cy = cy;
			cy.zoom(this.props.zoom);
		}
	}

	render() {
		return (
			<CytoscapeComponent
				containerID="cy"
				elements={CytoscapeComponent.normalizeElements(this.props.data)}
				cy={this.handleCy}
				minZoom={0.1}
				maxZoom={2}
				zoom={1}
				layout={this.props.layout}
				stylesheet={graphStyle}
				zoomingEnabled={true}
				userZoomingEnabled={false}
			/>
		);
	}
}

export default Graph;
