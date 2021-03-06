import React from "react";
import styled from "styled-components";
import { filter, escapeRegExp } from "lodash";

const TermNavElement = styled.div`
	position: absolute;
	left: -50%;
	top: 52px;
	width: 50%;
	overflow: hidden;
	z-index: 8;
	max-height: 90%;
	height: 90%;
	background-color: rgba(0, 0, 0, 0.8);
	color: white;
	transition: all ease-in 0.4s;
	box-shadow: 0 0 3px #000;
	opacity: 0;
	display: flex;

	&.active {
		left: 0;
		transition: all ease-out 0.3s;
		opacity: 1;
		z-index: 12;
	}

	div.articles,
	div.terms {
	}

	div.articles {
		width: 60%;
		overflow-y: auto;
		padding-bottom: 40px;
		ul {
			margin: 24px 12px 12px 0;
			padding: 0;
		}

		h2 {
			margin: 12px 0 0 24px;
		}
	}

	div.terms {
		width: 40%;
		float: left;
		overflow-y: auto;
		height: 100%;
		margin: 0;
		padding: 0;
		direction: rtl;
		border-right: 1px dashed white;
	}

	div.terms ul {
		margin: 0;
		padding: 0;
	}

	div.terms li {
		direction: ltr;
		padding-right: 12px;
		padding-left: 12px;
		padding-bottom: 6px;
		text-align:right;
	}

	li {
		list-style: none;
		cursor: pointer;
		margin-bottom: 6px;
		border-bottom: 1px dashed transparent;
	}

	li.termtree:hover,
	li.termtree.active {
		border-bottom: 1px dashed #fff;
	}

	li.article {
		padding: 6px 12px 6px 24px;
		border-style: dashed
		border-color: white;
		border-width: 1px 1px 1px 0;
		margin: 12px 0;
		font-family: 'Josefin Sans', sans-serif;
	}
	h3 {
		font-weight: normal;
		font-size: 18px;
		font-family: 'Josefin Sans', sans-serif;
	}
	h2 {
		font-family: 'Josefin Sans', sans-serif;
		font-weight: normal;
	}
	img {
		max-width: 100%;
		margin-bottom: 12px;
	}
	a {
		color: white;
		text-decoration: none;
	}

	@media screen and (max-width:768px) {
		width: 100%;
		top: 0;
		left: -100%;
		height: 100%;
		max-height: 100%;
	}
`;

const Input = styled.input`
	padding: 6px;
	border-radius: 4px;
	margin: 12px;
	border: 1px solid #ccc;
	font-size: 14px;
	direction: ltr;
	max-width: 100%;
	@media screen and (max-width: 768px) {
		max-width: 70%;
	}
`;

const CloseTermNav = styled.span`
	display: block;
	position: absolute;
	bottom: 12px;
	right: 24px;
	border: 1px solid white;
	padding: 6px;
	cursor: pointer;
	background-color: #000;
`;

class TermNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filteredArticles: 0,
			curterm: null,
			searchfield: "",
			filteredTerms: null
		};
	}

	handleTerm(term) {
		let articles = [];
		this.props.edges &&
			this.props.edges.map((edge, key) => {
				if (term.id === edge.source) {
					this.props.articles.map((article, key) => {
						if (article.id === edge.target) {
							articles.push(article);
						}
					});
				}
			});

		this.setState({
			filteredArticles: articles,
			curterm: term.id,
			curterminfo: term
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.curtax !== this.props.curtax) {
			this.setState({
				filteredTerms: null,
				filteredArticles: 0,
				searchfield: ""
			});
		}
	}

	handleSearch(evt) {
		console.log(evt.target.value);
		let value = evt.target.value;
		const re = new RegExp(escapeRegExp(value), "i");
		const isMatch = result => re.test(result.name);
		const match = filter(this.props.terms, isMatch);
		this.setState({
			searchfield: value,
			filteredTerms: match
		});
	}

	render() {
		return (
			<div>
				<TermNavElement className={`${this.props.active && "active"}`}>
					{this.props.terms && (
						<div className="terms">
							<ul>
								<Input
									onChange={this.handleSearch.bind(this)}
									placeholder={`Buscar ${
										this.props.curtax
									} ...`}
									value={this.state.searchfield}
								/>
								{this.state.filteredTerms !== null
									? this.state.filteredTerms.map(
											(term, key) => (
												<li
													className={`${this.state
														.curterm === term.id &&
														"active"} termtree`}
													onClick={this.handleTerm.bind(
														this,
														term
													)}
													key={key}
												>
													{term.name}
												</li>
											)
									  )
									: this.props.terms.map((term, key) => (
											<li
												className={`${this.state
													.curterm === term.id &&
													"active"} termtree`}
												onClick={this.handleTerm.bind(
													this,
													term
												)}
												key={key}
											>
												{term.name}
											</li>
									  ))}
							</ul>
						</div>
					)}
					<div className="articles">
						<h2>
							{this.state.curterminfo &&
								this.state.curterminfo.name}
						</h2>
						<ul>
							{this.state.filteredArticles.length >= 1 ? (
								this.state.filteredArticles.map(
									(article, key) => (
										<li className="article" key={key}>
											<a href={article.link}>
												<img
													src={article.img[0]}
													width={article.img[1]}
													height={article.img[2]}
													alt={article.title}
												/>
												<h3>{article.name}</h3>
											</a>
										</li>
									)
								)
							) : (
								<li className="article">
									No se encontraron artículos relacionados,
									puedes seleccionar uno de los{" "}
									{this.props.curtax} de la izquierda ...
								</li>
							)}
						</ul>
						<CloseTermNav onClick={this.props.toggleTermNav}>
							X [cerrar]
						</CloseTermNav>
					</div>
				</TermNavElement>
			</div>
		);
	}
}

export default TermNav;
