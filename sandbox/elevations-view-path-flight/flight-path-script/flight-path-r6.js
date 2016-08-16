// 2016-08-08

// flight-path-r6.js


	var searchInFolder = 'elevations-airports-01/';
	var urlBase = '../../elevations/' + searchInFolder;

//	var defaultFile = urlBase + 'vnlkl_12_3033_1718_3_4_510_680_.txt';

	var index = 0;
	var indexDefault;

	var deltaDefault = 2;

	var path = new THREE.Object3D();
	var target;

	var aircraft = {};
	aircraft.file = 'https://fgx.github.io/fgx-aircraft/data/c172p/c172p.js';

	var pointer;

	path.url = '../../data-path-csv/6-25-2016-1-cooked.csv';
	path.color = 0xff0000;

	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

	path.points = [];
	path.rotations = [];

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;


	function otherInits() {

		if ( !target ) {

			target = new THREE.Object3D();
			target.name = 'target'
			scene.add( target );

			var loader = new THREE.JSONLoader();
			loader.crossOrigin = 'anonymous';
			loader.load( aircraft.file, function ( geometry ) {

				geometry.applyMatrix( new THREE.Matrix4().makeRotationX( pi05 ) );
				geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -pi05 ) );
				geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.0001, 0.0001, 0.0001 ) );
				material = new THREE.MeshNormalMaterial( { side: 2 } );
				aircraft.mesh = new THREE.Mesh( geometry, material );
				target.add( aircraft.mesh );

			} );

		}

		getFilePathCSV();

controls.autoRotate = false;

	}


	function setMenu() {

		menuPlugins.innerHTML +=

		'<details open >' +
			'<summary><h3>Flight</h3></summary>' +
			'<p><input id=inpFly type=checkbox > Flying</p>' +
			'<p><button onclick=setCameraWorld(); >Camera World</button> <button onclick=setCameraChase() >Camera Chase</button></p>' +
		'</details>' +

		'<details open >' +
			'<summary><h3>Flight details</h3></summary>' +
			'<div id=menuFlightData >data here</div>' +
		'</details>' +

		'<details >' +
			'<summary><h3>Flightpath details</h3></summary>' +
			'<div id=menuFlightPathData ></div>' +
		'</details>';

	}


	function getFilePathCSV() {

		var xhr, text, waypoints;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', map.csvFiles[ 0 ], true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			text = xhr.responseText;

			waypoints = text.split( '\n' ).map( function( point ) { return point.split( ',' ).map( parseFloat ); } );

			path.waypoints = waypoints.slice( 1, -1 );

			indexDefault = map.indexDefault[ 0 ];

			drawPath( path );

		}

	}


	function drawPath() {

		var scale, geometry, material;

		scene.remove( path.path, path.box );

		path.points = path.waypoints.map( function( p ) { return v( p[ 0 ], p[ 1 ], map.verticalScale * p[ 2 ]  * 0.3048  ); } );
		path.rotations = path.waypoints.map( function( p ) { return v( p[ 3 ] * - d2r, p[ 4 ], p[ 5 ] ); } );

		geometry = new THREE.Geometry();
		geometry.vertices = path.points;

		material = new THREE.LineBasicMaterial( { color: path.color } );
		path.path = new THREE.Line( geometry, material);
		path.name = 'flightpath';

		path.box = new THREE.BoxHelper( path.path );
//		path.box.geometry.computeBoundingBox();
		scene.add( path.path, path.box );
		index = indexDefault;

		geometry.computeBoundingSphere();
		center = geometry.boundingSphere.center;
		latitude = center.z;
		longitude = center.x;

		geometry.computeBoundingBox();
		latMin = geometry.boundingBox.min.y;
		latMax = geometry.boundingBox.max.y;
		lonMin = geometry.boundingBox.min.x;
		lonMax = geometry.boundingBox.max.x;

		menuFlightPathData.innerHTML =
			'UL Lat: ' + latMax.toFixed( 4 ) + '&deg;' + b +
			'LR Lat: ' + latMin.toFixed( 4 ) + '&deg;' + b + b +

			'UL Lon: ' + lonMin.toFixed( 4 ) + '&deg;' + b +
			'LR Lon: ' + lonMax.toFixed( 4 ) + '&deg;' + b + b +

			'Center Latitude : ' + center.y.toFixed( 4 ) + '&deg;' + b +
			'Center Longitude: ' + center.x.toFixed( 4 ) + '&deg;' + b +
		b;

		setCameraFP();

		inpFly.checked = true;

	}

// prevent default from happening

	function setCamera(){};

	function setCameraFP() {

//		geometry = new THREE.BoxGeometry( 0.0003, 0.0003, 0.0003 );
		geometry = new THREE.CylinderGeometry( 0, 0.0001, 0.0008, 3, 1 );
		material = new THREE.MeshNormalMaterial( { opacity: 0.5, side: 2, transparent: true } );
		pointer = new THREE.Mesh( geometry, material );
		pointer.position.set( 0.002, 0.0012, -0.005 );
		camera.add( pointer );

		map.radius = map.boxHelper.geometry.boundingSphere.radius;
		controls.maxDistance = 3 * map.radius;

		camera.position.set( 0, -0.005, 0.002 );
		target.add( camera );

	}

	function setCameraChase() {

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.position.set( 0.01, 0.01, 0.01 );
		camera.up.set( 0, 0, 1 );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1;

		setCameraFP();

		aircraft.mesh.scale.set( 1, 1, 1 );

	}

	function setCameraWorld() {

		var cameraPosition;

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.position.set( 0.01, 0.01, 0.01 );
		camera.up.set( 0, 0, 1 );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1;

		map.radius = map.boxHelper.geometry.boundingSphere.radius;

		controls.target.copy( map.boxHelper.geometry.boundingSphere.center );
		controls.maxDistance = 3 * map.radius;
		controls.autoRotate = true;

		cameraPosition = 0.7 * map.radius;
		camera.position.copy( map.boxHelper.geometry.boundingSphere.center ).add( v( 0, -cameraPosition, cameraPosition ) );

		aircraft.mesh.scale.set( 10, 10, 10 );


	}

	function animate() {

		requestAnimationFrame( animate );

		stats.update();

		renderer.render( scene, camera );

		controls.update();


		if ( !aircraft.mesh || !inpFly.checked ) { return; }

		index = index++ >= path.points.length ? indexDefault : index;

		aircraft.mesh.rotation.z = path.rotations[ index ].x;
		pointer.rotation.z = path.rotations[ index ].x;
		target.position.copy( path.points[ index ] );

		menuFlightData.innerHTML =

			'waypoint Deg: ' + ( path.waypoints[ index][ 3 ] ) + b + b +

			'heading Rad: ' + ( aircraft.mesh.rotation.z ).toFixed( 2 ) + b +
			'heading Deg: ' + ( aircraft.mesh.rotation.z * r2d ).toFixed() + b +

		b;

	}
