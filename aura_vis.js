console.log("visualizacion cargada");

jQuery(document).ready(function($) {
	var viswrap = $(".visualizacion_wrapper");
	$(".visualizacion_trigger").on("click", function() {
		viswrap.addClass("active");
		console.log('viswrap');
		window.setTimeout(
			$.getScript(aura_vis.bundle_url, function(data, textStatus, jqxhr) {
				console.log("script loaded");
			}),
			3000
		);
	});
	$(".visualizacion_close").on("click", function() {
		viswrap.removeClass("active");
	});
});
