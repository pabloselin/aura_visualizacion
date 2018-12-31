import React from "react";
import styled from "styled-components";

const StyledTaxLabel = styled.div`
	position: absolute;
	left: 0;
	bottom: 66px;
	font-size: 48px;
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
		bottom: 90px;
		left: 0;
	}
`;

const TaxLabel = ({ curtax }) => (
	<StyledTaxLabel>
		<div className="label">{curtax}</div>
	</StyledTaxLabel>
);

export default TaxLabel;
