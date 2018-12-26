<?php
/*
Plugin Name: Visualizacion Aura austral
Plugin URI: https://auraaustral.cl
Description: Muestra una visualización de contenidos en Aura Austral
Version: 0.1.0
Author: A Pie
Author URI: http://apie.cl
Text Domain: aau
*/

add_action('wp_enqueue_scripts', function() {
	wp_enqueue_script( 'aura_vis', plugin_dir_url( __FILE__ ) . 'aura_vis.js' , array('sage/main.js', 'jquery'), '0.1.0', false );
	wp_localize_script( 'aura_vis', 'aura_vis', array(
		'bundle_url' => plugin_dir_url( __FILE__ ) . 'dist/main.js'
	) );
});