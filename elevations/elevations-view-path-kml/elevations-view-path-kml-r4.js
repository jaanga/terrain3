// 2016-08-18 ~ R4

	var defaultFile = '../elevations-data-kml/7mile_ski_trail_13_1688_3105_3_3_90_90_.txt';

	var searchInFolder = 'elevations-data-kml/';
	var urlBase = '../../elevations/' + searchInFolder;

	var path;

	var aircraft = {};
	aircraft.file = 'https://fgx.github.io/fgx-aircraft/data/seymour/seymour.js';

	var segments = 20;
	var points = 200;
	var cameraPoints = 2000;
	var zoomScale = 0.1;

	var actor;
	var curve;
	var target;

	var center;
	var index = 0;
	var motion = false;

	var v = function ( x, y, z ){ return new THREE.Vector3( x, y, z ); };


// prevent default from happening
//	function setCamera(){}
	function animate(){}


	function postInits() {

		setMenuDetailsPath();
		setMenuDetailsCameraActions();

		actor = new THREE.Object3D();
		actor.position.copy( map.center );
		scene.add( actor );

		getAircraftMesh();

//		geometry = new THREE.BoxGeometry( 0.01 * zoomScale, 0.01 * zoomScale, 0.01 * zoomScale );
//		material = new THREE.MeshNormalMaterial();
//		actorMesh = new THREE.Mesh( geometry, material );

		path = new THREE.Object3D();

		if ( !place.points ) {

			getFilePathKML();

		} else {

			drawPath();

		}

//		animate();
		animatePlus();

// nope
//		selFiles.selectedIndex = 1;

	}

	function getAircraftMesh() {

		var pi05 = 0.5 * Math.PI;
		var loader = new THREE.JSONLoader();
		loader.crossOrigin = 'anonymous';
		loader.load( aircraft.file, function ( geometry ) {

			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.0001, 0.0001, 0.0001 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0.0008 ) );
			material = new THREE.MeshNormalMaterial( { side: 2 } );
			aircraft.mesh = new THREE.Mesh( geometry, material );

			scene.add( aircraft.mesh );
			motion = true;

		} );

	}


	function setMenuDetailsPath() {

		menuDetailsPath.innerHTML =

			'<details open>' +

				'<summary><h3>Path</h3></summary>' +

				'<p>' +
//					'<button onclick=initElevations(); >Get Elevations</button> &nbsp; ' +
					'<button onclick=saveFile(); >Save Elevations to File</button>' +
				'</p>' +

			'</details>' +

		b;

	}

	function setMenuDetailsCameraActions() {

		menuDetailsCameraActions.innerHTML =

			'<details open>' +

				'<summary><h3>camera actions</h3></summary>' +

				'<p><input type=checkbox onclick=motion=!motion checked > motion</p>' +

				'<p>' +
					'Camera positions: <output id=outSpeed >' + cameraPoints + '</output><br>' +
					'<input type=range id=inpSpeed min=200 max=5000 step=100 value=' + cameraPoints + ' oninput=outSpeed.value=cameraPoints=this.valueAsNumber title="0 to 10: OK" >' +
				'</p>' +


				'<p><button onclick=setCameraChase(); >camera chase</button><br>' +
					'Camera fixed a distance from actor, follows actor position and rotation' +
				'</p>' +

				'<p><button onclick=setCameraInside(); >camera inside</button><br>' +
					'Camera fixed inside actor, follows a point just ahead of the actor' +
				'</p>' +

				'<p><button onclick=setCameraTrack(); >camera track</button><br>' +
					'Camera fixed at position on ground, follows actor</p>' +

				'<p><button onclick=setCameraWorld(); >camera world</button><br>' +
					'Camera fixed at position in the air, follows nothing</p>' +

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

		var xhr, response, xmlParse, text, points;

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
			ppoints = [];
			for ( var i = 0; i < lines.length; i++ ) {
				line = lines[ i ];
				point = line.split( ',' ).map( parseFloat );
				ppoints = ppoints.concat( point );

			} 

//			points.map ( function( point ) { return point.split( ',' ); } );

//.
//				map( function( point ) { 
//					return new THREE.Vector3().fromArray( 
//						point.split( ',' ).map( parseFloat ) ); 
//				} );

			place.points = ppoints.slice( 0, -1 );


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

// console.log( 'pathp', path.points  );
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

		curve = new THREE.CatmullRomCurve3( geometry.vertices );

		path.box = new THREE.BoxHelper( path.path );

		scene.add( path.path, path.box );

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

			'Center Latitude : ' + path.center.y.toFixed( 4 ) + '&deg;' + b +
			'Center Longitude: ' + path.center.x.toFixed( 4 ) + '&deg;' + b +
		b;

	}


	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var pl, blob, a;

		pl = JSON.stringify( place );
		blob = new Blob( [ pl ] );

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = place.fileName;
		a.click();

//		delete a;

	}

// cameras


	function setCameraChase() {

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 200 );
		camera.up.set( 0, 0, 1 );
		camera.position.set( 0, 0.005, 0.005 );

		actor.add( camera );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1;

		target = undefined;
		aircraft.mesh.scale.set( 1, 1, 1 );

	}

	function setCameraInside() {

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 200 );
		camera.up.set( 0, 0, 1 );
		camera.position.set( 0, 0.008, 0.005 );

		aircraft.mesh.add( camera );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1;

		target = undefined;
		aircraft.mesh.scale.set( 0.001, 0.001, 0.001 );

	}

	function setCameraTrack() {

		var setCameraPosition;

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.up.set( 0, 0, 1 );
		cameraPosition = 0.7 * path.radius;

		camera.position.copy( path.center ).add( v( -cameraPosition, 0, cameraPosition ) );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.copy( aircraft.mesh.position );
		controls.maxDistance = 5 * path.radius;

		target = aircraft.mesh.position;
		controls.autoRotate = true;

		aircraft.mesh.scale.set( 2, 2, 2 );

	}


	function setCameraWorld() {

		var setCameraPosition;

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00001, 2000 );
		camera.up.set( 0, 0, 1 );
		cameraPosition = 0.7 * path.radius;
		camera.position.copy( path.center ).add( v( 0, -cameraPosition, cameraPosition ) );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.copy( path.center );
		controls.maxDistance = 5 * path.radius;
		controls.autoRotate = true;

		target = undefined;
		aircraft.mesh.scale.set( 2, 2, 2 );

	}


	function animatePlus() {

		var point;

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( animatePlus );

		if ( !motion || !curve || !aircraft.mesh ) { return; }

		index += 1 / cameraPoints;

		point = Math.abs( Math.sin( index ) );

		actor.position.copy( curve.getPoint( point ) );

		aircraft.mesh.position.copy( curve.getPoint( point ) );
		aircraft.mesh.rotation.setFromVector3( curve.getTangent( point ) );

		if ( target ) { controls.target.copy( target ); }

	}


