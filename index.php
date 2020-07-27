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

function aura_taxtree() {
	/* Busca todas las taxonomías y devuelve una lista de los contenidos en cada taxonomía separados por números */
	$taxtree = array();

	$taxonomies = get_taxonomies( array(
		'_builtin'  => false,
		'public'    => true
	));
	$ediciones = get_posts( array(
		'post_type' => 'ediciones',
		'numberposts' => -1
	));
	if($taxonomies && $ediciones) {
		foreach($ediciones as $edicion) {
			$articulos_edicion = get_posts(array(
				'post_type' => 'any',
				'post_status' => 'publish',
				'numberposts' => -1,
				'meta_value' => $edicion->ID,
				'meta_key'   => '_aau_edicion'
			));

			if($articulos_edicion) {
				foreach($articulos_edicion as $articulo) {

					foreach($taxonomies as $taxonomy) {

						$terms = get_the_terms( $articulo->ID, $taxonomy );
						$terms_width_edges = array();
						if($terms):
							foreach($terms as $term) {
								$taxtree[$edicion->post_name][$taxonomy]['elements'][] = array(
									'group' => 'edges',
									'data' => array(
										'id' => 'edge-article-' . $term->term_id . '-' . $articulo->ID,
										'source' => $term->term_id,
										'target' => 'articulo-' . $articulo->ID 
									)
								);
								$terms_width_edges[] = $term->term_id;
							}

							$thumb = get_post_thumbnail_id( $articulo->ID );
							$thumbsrc = wp_get_attachment_image_src( $thumb, 'thumbnail' );


							$taxtree[$edicion->post_name][$taxonomy]['elements'][] = array(
								'group' => 'nodes',
								'data' => array(
									'postid' => $articulo->ID,
									'id' => 'articulo-' . $articulo->ID,
									'name' => $articulo->post_title,
									'link'  => get_permalink($articulo->ID),
									'slug'  => $articulo->post_name,
									'type'  => 'articulo',
									'img'   => $thumbsrc
								)
							);

                            endif;//if terms
                        }
                    }
                }
                foreach($taxonomies as $taxonomy) {
                	$taxobj = get_taxonomy( $taxonomy );
                	$terms = get_terms( array('taxonomy' => $taxonomy, 'hide_empty' => true ));
                	$taxtree[$edicion->post_name][$taxonomy]['tax_label'] = $taxobj->label;
                	$taxtree[$edicion->post_name][$taxonomy]['elements'][] = array(
                		'group' => 'nodes',
                		'data'  => array(
                			'name' => $edicion->post_title,
                			'id'   => 'edicion-' . $edicion->post_name,
                			'type' => 'edicion'
                		),
                		'position' => array('x' => 10, 'y' => 10)
                	);
                	foreach($terms as $term) {
                		$termarts = array();

                		$taxtree[$edicion->post_name][$taxonomy]['elements'][] = array(
                			'group' => 'nodes',
                			'data' => array(
                				'name' => $term->name,
                				'slug' => $term->slug,
                				'id'   => $term->term_id,
                				'type' => 'term'
                			)        
                		);
                	}

                }
            }
        }

        return $taxtree;
    }

    function aura_globaltaxtree() {
    	$globaltaxtree = array();

    	$taxonomies = get_taxonomies( array(
    		'_builtin'  => false,
    		'public'    => true
    	));

    	if($taxonomies) {
    		$articulos_edicion = get_posts(array(
    			'post_type' => array('artistas', 'obras', 'arq_imaginarias', 'cronicas_territorio', 'entrevistas', 'visual', 'glosario', 'critica_cultural'),
    			'post_status' => 'publish',
    			'numberposts' => -1,
    		));

    		if($articulos_edicion) {
    			foreach($articulos_edicion as $articulo) {

    				$numero = get_post_meta($articulo->ID, '_aau_edicion', true);

    				foreach($taxonomies as $taxonomy) {

    					$terms = get_the_terms( $articulo->ID, $taxonomy );
    					$terms_width_edges = array();

    					foreach($terms as $term) {
    						$globaltaxtree[$taxonomy]['elements'][] = array(
    							'group' => 'edges',
    							'data' => array(
    								'id' => 'edge-article-' . $term->term_id . '-' . $articulo->ID,
    								'source' => $term->term_id,
    								'target' => 'articulo-' . $articulo->ID,
    								'numero' => $numero
    							)
    						);
    						$terms_width_edges[] = $term->term_id;
    					}

    					$thumb = get_post_thumbnail_id( $articulo->ID );
    					$thumbsrc = wp_get_attachment_image_src( $thumb, 'thumbnail' );


    					$globaltaxtree[$taxonomy]['elements'][] = array(
    						'group' => 'nodes',
    						'data' => array(
    							'postid' => $articulo->ID,
    							'id' => 'articulo-' . $articulo->ID,
    							'name' => $articulo->post_title,
    							'numero' => get_the_title($numero),
    							'numeroID' => $numero,
    							'link'  => get_permalink($articulo->ID),
    							'slug'  => $articulo->post_name,
    							'type'  => 'articulo',
    							'img'   => $thumbsrc
    						)
    					);
    				}
    			}
    		}
    		foreach($taxonomies as $taxonomy) {
    			$taxobj = get_taxonomy( $taxonomy );
    			$terms = get_terms( array('taxonomy' => $taxonomy, 'hide_empty' => true ));
    			$globaltaxtree[$taxonomy]['tax_label'] = $taxobj->label;
    			$globaltaxtree[$taxonomy]['elements'][] = array(
    				'group' => 'nodes',
    				'data'  => array(
    					'name' => $edicion->post_title,
    					'id'   => 'edicion-' . $edicion->post_name,
    					'type' => 'edicion'
    				),
    				'position' => array('x' => 10, 'y' => 10)
    			);
    			foreach($terms as $term) {
    				$termarts = array();

    				$globaltaxtree[$taxonomy]['elements'][] = array(
    					'group' => 'nodes',
    					'data' => array(
    						'name' => $term->name,
    						'slug' => $term->slug,
    						'id'   => $term->term_id,
    						'type' => 'term'
    					)        
    				);
    			}

    		}
    	}

    	return $globaltaxtree;

    }

    function aura_taxtreetransient() {
        // Get any existing copy of our transient data
    	if ( false === ($taxtree = get_transient( 'taxtree' ) ) ) {
            // It wasn't there, so regenerate the data and save the transient
    		$taxtree = aura_taxtree();

    		if('WP_ENV' == 'development') 
    		{
    			$transient_expires = 1;
    		}
    		else {
    			$transient_expires = 12 * HOUR_IN_SECONDS;
    		}

    		set_transient( 'taxtree', $taxtree, $transient_expires );

    	}

    	return $taxtree;
    }

    function aura_globaltaxtreetransient() {
        // Get any existing copy of our transient data
    	if ( false === ($taxtree = get_transient( 'globaltaxtree' ) ) ) {
            // It wasn't there, so regenerate the data and save the transient
    		$taxtree = aura_globaltaxtree();

    		if('WP_ENV' == 'development') 
    		{
    			$transient_expires = 1;
    		}
    		else {
    			$transient_expires = 12 * HOUR_IN_SECONDS;
    		}

    		set_transient( 'globaltaxtree', $taxtree, $transient_expires );

    	}

    	return $taxtree;
    }


    add_action('rest_api_init', function () {
  register_rest_route( 'auraaustral/v1', 'taxtree',array(
                'methods'  => 'GET',
                'callback' => 'aura_taxtreetransient'
      ));
   register_rest_route( 'auraaustral/v1', 'globaltaxtree',array(
                'methods'  => 'GET',
                'callback' => 'aura_globaltaxtreetransient'
      ));
});