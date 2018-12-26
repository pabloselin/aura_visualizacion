const config = {
	dev: {
		base_url: "http://auraaustral.local/",
		api_url: "wp-json/auraaustral/v1/"
	},
	production: {
		base_url: "https://auraaustral.cl/",
		api_url: "wp-json/auraaustral/v1/"
	},
	staging: {
		base_url: "https://dev.auraaustral.cl",
		api_url: "wp-json/auraaustral/v1"
	}
};

export default config;