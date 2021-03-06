//Graph Style Array NOT Styled component

const nodeColor = "#fff";

const graphStyle = [
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
			"border-color": "#333",
			"border-width": "1px",
			"text-max-width": "200px",
			"text-wrap": "wrap",
			"text-background-color": "black",
			"text-background-opacity": 1,
			"text-background-padding": "2px",
			"text-background-shape": "rectangle",
			"text-valign": "center",
			"transition-property": "background-color"
		}
	},
	{
		selector: "node#cursor",
		style: {
			"background-color": "red",
			width: "12px",
			height: "12px",
			color: "red"
		}
	},
	{
		selector: "edge",
		style: {
			width: "0",
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
			width: "1px",
			"line-style": "dashed",
			"line-color": "rgba(200,200,200, 0.2)"
		}
	},
	{
		selector: "edge.active",
		style: {
			width: "1.5px",
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
		selector: "node.hover, node.active",
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
			"background-fit": "cover",
			"border-width": "1px",
			"border-color": nodeColor,
			width: "32px",
			height: "48px",
			shape: "rectangle",
			"text-margin-y": "10px",
			"text-valign": "bottom",
			"text-background-color": "#fff",
			color: "#000"
		}
	},
	{
		selector: "node.articulo.hover, node.articulo.active",
		style: {
			label: "data(name)",
			"z-compound-depth": "top"
		}
	},
	{
		selector: "node.term",
		style: {
			"text-max-width": "120px",
			"text-wrap": "ellipsis",
			"text-valign": "bottom",
			"text-halign": "center",
			"text-margin-y": "4px"
		}
	},
	{
		selector: "node.term.hover, node.term.active",
		style: {
			label: "data(name)",
			"border-width": "1px",
			"border-color": nodeColor,
			"text-wrap": "none"
		}
	}
];

export default graphStyle;
