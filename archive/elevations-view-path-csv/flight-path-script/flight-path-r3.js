// 2016-07-21 13:55

// flight-path-r3.js

	var defaultFile = '../../elevations/elevations-data-02/elevations_tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';
	var index = 0;
	var indexDefault = 0;;


	map.deltaDefault = 3;

	var flightPath = new THREE.Object3D();
	var lure = new THREE.Object3D();
	var aircraft = new THREE.Object3D();

	flightPath.url = '6-25-2016-1-cooked.csv';
	flightPath.color = 0xff0000;

	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };
	flightPath.points = [ v( 0, 0, 0 ) ];
	flightPath.rotations = [ v( 0, 0, 0 ) ];

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;


	function otherInits() {

	lure.name = 'lure'
	scene.add( lure );

		var loader = new THREE.JSONLoader();
		loader.crossOrigin = 'anonymous';
		loader.load( '21.js', function ( geometry ) {

			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.0001, 0.0001, 0.0001 ) );
			material = new THREE.MeshNormalMaterial( { side: 2 } );
			aircraft = new THREE.Mesh( geometry, material );
			lure.add( aircraft );

		} );

		getFilePathCSV( flightPath );

//controls.autoRotate = false;

	}

	function getFilePathCSV( path ) {

		var xhr, text, waypoints;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', path.url, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			text = xhr.responseText;

			waypoints = text.split( '\n' ).map( function( point ) { return point.split( ',' ).map( parseFloat ); } );

			path.waypoints = waypoints.slice( 1, -1 );

			drawPath( path );

		}

	}

	function drawPath( path ) {

		var scale, geometry, material;

		scene.remove( path.path, path.box );

		path.points = path.waypoints.map( function( p ) { return v( p[ 0 ], p[ 1 ], inpVertical.valueAsNumber * p[ 2 ]  * 0.3048  ); } );
		path.rotations = path.waypoints.map( function( p ) { return v( p[ 3 ] * d2r, p[ 4 ] * d2r, p[ 5 ] * d2r ); } );

		geometry = new THREE.Geometry();
		geometry.vertices = path.points;

		material = new THREE.LineBasicMaterial( { color: path.color } );
		path.path = new THREE.Line( geometry, material);
		path.name = 'flightpath';

		path.box = new THREE.BoxHelper( path.path );
//		path.box.geometry.computeBoundingBox();
		scene.add( path.path, path.box );
		index = indexDefault = 5000;

		geometry.computeBoundingSphere();
		center = geometry.boundingSphere.center;
		latitude = center.z;
		longitude = center.x;

		geometry.computeBoundingBox();
		latMin = geometry.boundingBox.min.y;
		latMax = geometry.boundingBox.max.y;
		lonMin = geometry.boundingBox.min.x;
		lonMax = geometry.boundingBox.max.x;

		menuPlugins.innerHTML =

		'<details open >' +

			'<summary><h3>Flightpath details</h3></summary>' +

			'UL Lat: ' + latMax.toFixed( 4 ) + '&deg;' + b +
			'LR Lat: ' + latMin.toFixed( 4 ) + '&deg;' + b + b +

			'UL Lon: ' + lonMin.toFixed( 4 ) + '&deg;' + b +
			'LR Lon: ' + lonMax.toFixed( 4 ) + '&deg;' + b + b +

			'Center Latitude : ' + center.y.toFixed( 4 ) + '&deg;' + b +
			'Center Longitude: ' + center.x.toFixed( 4 ) + '&deg;' + b + b +

		'</details>';

		animate();

	}


	function setCamera() {

		var cameraPosition;

		map.radius = map.boxHelper.geometry.boundingSphere.radius;

		controls.maxDistance = 3 * map.radius;

//		camera.position.set( 0, 0.005, 0.001 );

		camera.position.set( 0, 0.005, 0.001 );
		lure.add( camera );

//		lure.position.copy( flightPath.points[ 5000 ] );
//		camera.position.copy( lure.position );
//		camera.position.z += 0.02;

	}

	function animate() {

		requestAnimationFrame( animate );
		controls.update();
		stats.update();

		index = ++index >= flightPath.points.length ? indexDefault : index;
		aircraft.rotation.z = flightPath.rotations[ index ].x ;
		lure.position.copy( flightPath.points[ index ] );


		renderer.render( scene, camera );

	}