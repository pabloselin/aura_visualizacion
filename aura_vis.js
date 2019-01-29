console.log("visualizacion cargada");

jQuery(document).ready(function($) {
	var isLoaded = false;
	$('.ver-vis').on('click', function() {
		if(isLoaded === false) {
			$.getScript(aura_vis.bundle_url, function(data, textStatus, jqxhr) {
				isLoaded = true;
			}, 0)
			$('#aura_visualizacion').addClass('active');
			$('.toggle-vis').toggleClass('firstToggle');
		} else {
			$('#aura_visualizacion').slideToggle().toggleClass('active');
			$('.toggle-vis').removeClass('firstToggle').toggleClass('onToggle');
		}
	});
});
