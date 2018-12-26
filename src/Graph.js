import React, { Component } from "react";
import { ReactCytoscape } from "react-cytoscape";

class Graph extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ReactCytoscape
					containerID="cy"
					elements={this.props.data}
					cyRef={this.props.cyRef}
					cytoscapeOptions={{
						wheelSensitivity: 0.2,
						minZoom: 0.7,
						maxZoom: 1.4,
						animationEasing: "ease-in",
						animationDuration: 500
					}}
					layout={this.props.layout}
					style={this.props.graphStyle}
				/>
			)
	}
}

export default Graph;