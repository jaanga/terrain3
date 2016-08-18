


	var start = null;

	var searchInFolder = 'elevations-data-kml/';
	var urlBase = '../../elevations/' + searchInFolder;

	var path = new THREE.Object3D();

	var aircraft = {};
	aircraft.file = 'https://fgx.github.io/fgx-aircraft/data/seymour/seymour.js';

	var index = 0;
	var indexDefault = 0;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;



	function otherInits() {

		path = new THREE.Object3D();

		setMenu();


		inpFly.checked = false;



		geometry = new THREE.CylinderGeometry( 0, 0.0001, 0.0008, 3, 1 );
		material = new THREE.MeshNormalMaterial( { opacity: 0.5, side: 2, transparent: true } );
		pointer = new THREE.Mesh( geometry, material );
		pointer.position.set( 0.002, 0.0012, -0.005 );

		target = new THREE.Object3D();
		target.name = 'target'
		scene.add( target );

		var loader = new THREE.JSONLoader();
		loader.crossOrigin = 'anonymous';
		loader.load( aircraft.file, function ( geometry ) {

			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.000005, 0.000005, 0.000005 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0.0002 ) );
			material = new THREE.MeshNormalMaterial( { side: 2 } );
			aircraft.mesh = new THREE.Mesh( geometry, material );
			target.add( aircraft.mesh );



		} );

		getFilePathKML();

//controls.autoRotate = false;

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

	function getFilePathKML() {

//		var xhr, text, waypoints;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', map.kmlFile, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			text = xhr.responseText;

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml");

			text = xmlParse.getElementsByTagName( "coordinates" )[0];
			text = text.textContent;

			points = text.split( '\n' ).
				map( function( point ) { 
					return new THREE.Vector3().fromArray( 
						point.split( ',' ).map( parseFloat ) ); 
				} );

			map.points = points.slice( 0, -1 );

//			drawPath();

		}

	}


	function drawPath() {

		var scale, geometry, material;
		var raycaster, up;

		scene.remove( path.path, path.box );


		raycaster = new THREE.Raycaster();
		up = v( 0, 0, 1 );

		map.mesh.updateMatrixWorld();

console.time( 't1' );

		for ( var i = 0; i < map.points.length; i++ ) {

			raycaster.set( map.points[ i ], up, 0, 1 );
			collisions = raycaster.intersectObject( map.mesh );

//if ( i < 10 ) console.log( '', collisions );

			map.points[ i ].z = collisions.length ? collisions[ 0 ].distance : 0 ;

		}

console.timeEnd( 't1' );


		path.points = map.points; // .map( function( p ) { return v( p[ 0 ], p[ 1 ], map.verticalScale * p[ 2 ]  * 0.3048  ); } );
//		path.rotations = path.waypoints.map( function( p ) { return v( p[ 3 ] * - d2r, p[ 4 ], p[ 5 ] ); } );

		geometry = new THREE.Geometry();
		geometry.vertices = path.points;

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
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

		inpFly.checked = true;

		setCameraWorld();
//		setCameraChase();

		camera.add( pointer );

	}


// prevent default from happening
	function setCamera(){};

	function setCameraChase() {

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.position.set( 0, 0.005, 0.005 );
		camera.up.set( 0, 0, 1 );
		target.add( camera );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1;

		aircraft.mesh.scale.set( 1, 1, 1 );

	}

	function setCameraWorld() {

		var cameraPosition;
		map.radius = 2 * path.box.geometry.boundingSphere.radius;

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.position.set( 0.01, 0.01, 0.01 );
		camera.up.set( 0, 0, 1 );
		cameraPosition = 0.7 * map.radius;
		camera.position.copy( path.box.geometry.boundingSphere.center ).add( v( 0, -cameraPosition, cameraPosition ) );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.copy( path.box.geometry.boundingSphere.center );
		controls.maxDistance = 5 * map.radius;
		controls.autoRotate = true;

		aircraft.mesh.scale.set( 10, 10, 10 );

	}

	function animate( timestamp ) {

		requestAnimationFrame( animate );

		if ( !start ) { start = timestamp; }

		var progress = timestamp - start;

//	element.style.left = Math.min(progress/10, 200) + "px";



//			requestAnimationFrame( animate );



		stats.update();

		renderer.render( scene, camera );

		controls.update();


		if ( progress < 200 ) { return; }

		start = null;

		if ( !aircraft.mesh ) { return; }

		if ( map.mesh && map.points && !path.points ) {

			drawPath();

		}

		if ( !inpFly.checked ) { return; }

		index = index++ >= path.points.length - 1 ? indexDefault : index;

//		aircraft.mesh.rotation.z = path.rotations[ index ].x;
//		pointer.rotation.z = path.rotations[ index ].x;
		target.position.copy( path.points[ index ] );

		menuFlightData.innerHTML =

//			'waypoint Deg: ' + ( path.waypoints[ index][ 3 ] ) + b + b +

//			'heading Rad: ' + ( aircraft.mesh.rotation.z ).toFixed( 2 ) + b +
//			'heading Deg: ' + ( aircraft.mesh.rotation.z * r2d ).toFixed() + b +

		b;

	}
