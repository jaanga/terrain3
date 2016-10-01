// 2016-08-18 ~ R4

//	var defaultFile = '../elevations-data-kml/7mile_ski_trail_13_1688_3105_3_3_90_90_.txt';

	var searchInFolder = 'elevations-data-kml/';
	var urlBase = '../../elevations-data/' + searchInFolder;

	var path;
	var points = 200;
	var zoomScale = 0.1;

	function postInits() {

		getActor();

		path = new THREE.Object3D();

		if ( !place.points ) {

			getFilePathKML();

		} else {

			drawPath();

			cameraWorld();
			motion = true;

		}

	}

	function getMenuDetailsPath() {

		menuDetailsPath =

			'<details open>' +

				'<summary><h3>Path</h3></summary>' +

				'<p>' +
//					'<button onclick=initElevations(); >Get Elevations</button> &nbsp; ' +
					'<button onclick=saveFile(); >Save Elevations to File</button>' +
				'</p>' +

			'</details>' +

		b;

		return menuDetailsPath;

	}


	function getFilePathKML() {

		var xhr, response, xmlParse, text, coordinates;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', place.kmlFile, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml" );

			text = xmlParse.getElementsByTagName( "coordinates" )[ 0 ];
			text = text.textContent;

			lines = text.split( '\n' ); //
			coordinates = [];

			for ( var i = 0; i < lines.length; i++ ) {
				line = lines[ i ];
				point = line.split( ',' ).map( parseFloat );
				coordinates = coordinates.concat( point );

			} 

//			points.map ( function( point ) { return point.split( ',' ); } );

//.
//				map( function( point ) { 
//					return new THREE.Vector3().fromArray( 
//						point.split( ',' ).map( parseFloat ) ); 
//				} );

			place.points = coordinates.slice( 0, -3 );


			var raycaster, up;

			raycaster = new THREE.Raycaster();
			up = v( 0, 0, 1 );

			map.mesh.updateMatrixWorld();

			var pp = place.points;
			for ( var i = 0; i < place.points.length; i += 3 ) {

				raycaster.set( v( pp[ i ], pp[ i + 1], pp[ i + 2] ), up, 0, 2 );
				collisions = raycaster.intersectObject( map.mesh );

				pp[ i + 2 ] = collisions.length ? collisions[ 0 ].distance : 0 ;

			}

//console.log( '', place.points );
console.time( 't1' );

			drawPath();

			cameraWorld();

			motion = true;

		}

	}


	function drawPath() {

		var scale, geometry, material;
		var spline;

		path.points = [];
		path.path = [];

		var pp = place.points;
		for ( var i = 0; i < place.points.length; ) {

			path.points.push( v( pp[ i++ ], pp[ i++ ], pp[ i++ ] ) )

		} 

//console.log( 'pathp', path.points  );
//		path.points = place.points; // .map( function( p ) { return v( p[ 0 ], p[ 1 ], map.verticalScale * p[ 2 ]  * 0.3048  ); } );

		spline = new THREE.CatmullRomCurve3( path.points );

		geometry = new THREE.Geometry();
		geometry.vertices = spline.getPoints( points );

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		path.path = new THREE.Line( geometry, material);
		path.name = 'path';


		geometry.computeBoundingSphere();
		path.center = geometry.boundingSphere.center;
		path.radius = 2 * geometry.boundingSphere.radius;

		path.box = new THREE.BoxHelper( path.path );

		scene.add( path.path, path.box );

		geometry.computeBoundingBox();
		latMin = geometry.boundingBox.min.y;
		latMax = geometry.boundingBox.max.y;
		lonMin = geometry.boundingBox.min.x;
		lonMax = geometry.boundingBox.max.x;

		menuPlugins.innerHTML =
			'UL Lat: ' + latMax.toFixed( 4 ) + '&deg;' + b +
			'LR Lat: ' + latMin.toFixed( 4 ) + '&deg;' + b + b +

			'UL Lon: ' + lonMin.toFixed( 4 ) + '&deg;' + b +
			'LR Lon: ' + lonMax.toFixed( 4 ) + '&deg;' + b + b +

			'Center Latitude : ' + path.center.y.toFixed( 4 ) + '&deg;' + b +
			'Center Longitude: ' + path.center.x.toFixed( 4 ) + '&deg;' + b +
		b;

		curve = new THREE.CatmullRomCurve3( geometry.vertices );
		center = path.center.clone();

	}


	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var pl, blob, a;

		pl = JSON.stringify( place );
		pl = pl.replace ( /,\"/g, ',\n"' );
		blob = new Blob( [ pl ] );

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = place.fileName;
		a.click();

//		delete a;

	}
