
//	SEL.defaultFile = '../../sandbox/elevations-view-oakland-gran-fondo/oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';

	var KML = KML || {};


	KML.drawPath = function() {

//		var geometry, material, pp, points;
		var place = COR.place;

		THR.scene.remove( THR.line, THR.line2, THR.line3 );

		if ( !place.points ) { return; }
 
		pp = place.points;
		points = [];

		for ( var i = 0; i < place.points.length; i +=3 ) {

			points.push( v( pp[ i ], pp[ i + 2 ] * place.verticalScale / 111111, -pp[ i + 1 ] ) );

		} 

/*
		var raycaster, up;

		raycaster = new THREE.Raycaster();
		up = v( 0, 0, 1 );

		MAP.mesh.updateMatrixWorld();

//		var pp = place.points;

		for ( var i = 0; i < points.length; i += 3 ) {

			raycaster.set( v( points[ i ], 0, points[ i + 2 ] ), up, 0, 2 );
			collisions = raycaster.intersectObject( MAP.mesh );

			points[ i + 2 ] = collisions.length ? collisions[ 0 ].distance : 0 ;

		}
*/


		geometry = new THREE.Geometry();
		geometry.vertices = points;

		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
		THR.line = new THREE.Line( geometry, material);
		THR.line.name = 'path';

		THR.scene.add( THR.line );

		THR.curve1 = new THREE.CatmullRomCurve3( THR.line.geometry.vertices );
		THR.curve1.closed = false;

		spacedPoints = THR.curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;

		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//		THR.line2 = new THREE.Line( geometry, material );
		THR.line2 = getMeshLine( spacedPoints, 0x00ff00, 0.0005 );

		THR.line2.updateMatrixWorld();
		THR.scene.add( THR.line2 );

		THR.curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices = THR.curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		THR.line3 = new THREE.Line( geometry, material );
//		THR.line3 = getMeshLine( spacedPoints, 0x00ff00, 0.01 );

		THR.line3.updateMatrixWorld();

		THR.scene.add( THR.line3 );

		THR.curve3 = new THREE.CatmullRomCurve3( THR.line3.geometry.vertices  );

		CAS.curve = THR.curve3;

//		motion = true;

	}



	KML.getFile = function( url ) {

//		var xhr, response, xmlParse, text, lines, coordinates;

		KML.openKML( url ) 

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml" );

			text = xmlParse.getElementsByTagName( "coordinates" )[ 0 ];
			text = text.textContent;


			text = text.replace( / /g, ',' ); 
			text = text.replace( /\n/g, ',' ); 

//			lines = text.split( '\n' ); //
			lines = text.split( ',' ); //
			coordinates = [];


			for ( var i = 0; i < lines.length; i++ ) {

				line = lines[ i ];
//				point = line.split( ',' ).map( parseFloat );
//				coordinates = coordinates.concat( point );

				coord = parseFloat( line );
				if ( isNaN( coord ) ) { continue; }
				coordinates.push( coord );

			} 


			COR.place.points = coordinates; //.slice( 0,  );

pp = COR.place.points;
console.log( '', pp.slice( 0, 10 ) );

		}

	}

	KML.openKML = function( url ) {

// https://developers.google.com/maps/documentation/javascript/examples/layer-kml

		var kmlLayer;
		var place = COR.place;

		place.kmlFile = url;
		place.vicinity = place.origin = url.split( '/' ).pop().slice( 0, - SEL.extension.length );

		kmlLayer = new google.maps.KmlLayer( {

			url: url,
			map: googleMap.map

		} );

		googleMap.map.addListener( 'center_changed', function(  ) {

//console.log( '', googleMap.map.center.lat(), googleMap.map.center.lng() );

			googleMap.clearAll();

			place.latitude = googleMap.map.center.lat();

			place.longitude = googleMap.map.center.lng();

			CLK.onClickGoogleMap();

        } );

	}
