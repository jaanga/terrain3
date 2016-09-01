
	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;

	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

	var sin = Math.sin;
	var cos = Math.cos;
	var abs = Math.abs;
	var ran = Math.random;

	var map = {};

	var stats, renderer, scene, camera, controls, mesh;
	var ground, gridHelper, axisHelper;

	function getThreeJS() {

		var geometry, material;

		stats = new Stats();
		stats.domElement.style.cssText = 'position: absolute; right: 0; top: 0;' ;
		document.body.appendChild( stats.domElement );
		stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

		renderer = new THREE.WebGLRenderer( {  alpha: 1, antialias: true }  );
//		renderer.setClearColor( 0xf0f0f0 );
//		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.00000001, 100 );
		camera.position.set( 100, 100, 100 );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
//		controls.maxDistance = 800;
//		controls.autoRotate = true;

		scene = new THREE.Scene();

		window.addEventListener( 'resize', onWindowResize, false );


// helpers

		geometry = new THREE.BoxGeometry( 100, 2, 100 );
		material = new THREE.MeshNormalMaterial();
		ground = new THREE.Mesh( geometry, material );
		ground.position.set( 0, -31, 0 );
		scene.add( ground );

		gridHelper  = new THREE.GridHelper( 50, 10 );
		gridHelper.position.set( 0, -30, 0 );
		scene.add( gridHelper );

		axisHelper = new THREE.AxisHelper( 50 );
		scene.add( axisHelper );

// assets



	}


	function getMapGeometry() {

		var vertices;

		script = document.body.appendChild( document.createElement( 'script' ) );

		script.onload = callback;
		script.src = '../../data-path-csv/san-francisco_10_163_394_3_3_450_450_.js';

		function callback() {

			renderer.setClearColor( place.backgroundColor );

	//		map.geometry = new THREE.PlaneBufferGeometry( map.deltaLonTile * place.tilesX, map.deltaLatTile * place.tilesY, place.samplesX - 1, place.samplesY - 1 );
			map.geometry = new THREE.PlaneBufferGeometry( place.latitudeDelta, place.latitudeDelta, 449, 449 );

			vertices = map.geometry.attributes.position.array;

			for ( var i = 2, j = 0; j < place.elevations.length; i += 3, j++ ) {

				vertices[ i ] = place.elevations[ j ];

			}

			map.geometry.applyMatrix( new THREE.Matrix4().makeScale( place.latitudeDelta, place.latitudeDelta, place.verticalScale * place.latitudeDelta / 111111 ) );

			map.geometry.computeFaceNormals();
			map.geometry.computeVertexNormals();
			map.geometry.computeBoundingBox();

			map.material = new THREE.MeshNormalMaterial( { side: 2 } );

			map.mesh = new THREE.Mesh( map.geometry, map.material );
			map.mesh.name = place.origin;

// comment out next line to get marker at proper location
			map.mesh.position.set( place.longitudeCenter, place.latitudeCenter, 0 );
			map.mesh.updateMatrixWorld();

			map.boxHelper = new THREE.BoxHelper( map.mesh, 0xff0000 );
			map.boxHelper.name = 'boxHelper';
			scene.add( map.boxHelper );
//			map.boxHelper.visible = false;

			scene.add( map.mesh );

/*
			particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
			particle = new THREE.Sprite( particleMaterial );
			particle.scale.x = particle.scale.y = 0.01 * scale;
			scene.add( particle );
*/
			setCamera();

			getMoreInits();

		}

	}


	function getMoreInits() {}


	function setCamera() {

		var cameraPosition;

//		map.mesh.geometry.computeBoundingSphere();
		map.radius = map.boxHelper.geometry.boundingSphere.radius;
		map.center = map.boxHelper.geometry.boundingSphere.center;

		controls.target.copy( map.center );
//		controls.maxDistance = 3 * map.radius;
//		controls.autoRotate = true;

		cameraPosition = 0.7 * map.radius;
		camera.position.copy( map.center.clone() ).add( v( 0, -cameraPosition, cameraPosition ) );

	}


	function getActorBitmapCoreThreejs( bitmap ) {

		var loader, texture, geometry, material, mesh;

		obj = new THREE.Object3D();

		loader = new THREE.TextureLoader();
		loader.crossOrigin = '';
		texture = loader.load( bitmap || '../../bitmaps/j.gif' );

		texture.minFilter = texture.magFilter = THREE.NearestFilter;
//		texture.needsUpdate = true;

		geometry = new THREE.PlaneBufferGeometry( 1, 1 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05 ) );

		material = new THREE.MeshBasicMaterial( {  map: texture, side: THREE.DoubleSide, transparent: true } );

		mesh = new THREE.Mesh( geometry, material );

		obj.add( mesh );
		obj.mesh = mesh;

		return obj;

	}


	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

	}


// utils

// Source http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29

	function lon2tile( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}

	function lat2tile( lat, zoom ) {

		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}

	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {

		var n = pi - 2 * pi * y / Math.pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));

	}


	function animate() {

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( animate );

	}