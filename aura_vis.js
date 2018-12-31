console.log("visualizacion cargada");

jQuery(document).ready(function($) {
	$.getScript(aura_vis.bundle_url, function(data, textStatus, jqxhr) {
				console.log("script loaded");
			}),
		3000
});
