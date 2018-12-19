import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Text, Arc, Group, Circle } from "react-konva";

class TaxLayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			angle: 180 / this.props.tax.terms.length,
			curangle: 0,
			xArc: 400,
			yArc: 700,
			arcAngle: 180,
			innerRadiusArc: 200,
			outerRadiusArc: 205
		};
	}

	angleDist(key) {
		// this.setState({
		// 	curangle: 0
		// });
		//return this.state.curangle;
		return this.state.angle * key;
	}

	arcPosX(key) {
		let prepos = (Math.PI / 180) * key * 3.1;
		let pos = Math.cos(prepos);
		let updatepos = pos * this.state.outerRadiusArc;
		return updatepos;
	}

	arcPosY(key) {
		let prepos = (Math.PI / 180) * key * 3.1;
		let pos = Math.sin(prepos);
		let updatepos = pos * this.state.outerRadiusArc;
		return updatepos;
	}

	componentDidMount() {}

	render() {
		return (
			<div>
				<Stage draggable={true} width={800} height={600}>
					<Layer>
						<Group rotation={0}>
							{this.props.tax.terms.map((term, key) => (
								<Group>
									<Text
										key={key}
										x={this.arcPosX(key)}
										y={this.arcPosY(key)}
										className="taxitem"
										text={term.name}
										rotation={this.angleDist(key)}
									/>
									<Circle
										radius={3}
										fill="red"
										x={this.arcPosX(key)}
										y={this.arcPosY(key)}
									/>
								</Group>
							))}
						</Group>
						<Arc
							x={this.state.xArc}
							y={this.state.yArc}
							angle={this.state.arcAngle}
							innerRadius={this.state.innerRadiusArc}
							outerRadius={this.state.outerRadiusArc}
							stroke="red"
							strokeWidth={1}
							rotation={180}
						/>
					</Layer>
				</Stage>
			</div>
		);
	}
}

export default TaxLayer;
