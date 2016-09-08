

	var MAP = {};

	THR.moreThreejsInits = function() { 

		getMapGeometry() 

	};


	function getMapGeometry() {

		var vertices;

		script = document.body.appendChild( document.createElement( 'script' ) );

		script.onload = callback;
		script.src = '../../data-path-csv/san-francisco_10_163_394_3_3_450_450_.js';

		function callback() {

			THR.renderer.setClearColor( COR.place.backgroundColor );
			THR.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.001, 1000 );
			THR.camera.position.set( 100, 100, 100 );
			THR.controls = new THREE.OrbitControls( THR.camera, THR.renderer.domElement );


	//		MAP.geometry = new THREE.PlaneBufferGeometry( MAP.deltaLonTile * place.tilesX, map.deltaLatTile * place.tilesY, place.samplesX - 1, place.samplesY - 1 );
			MAP.geometry = new THREE.PlaneBufferGeometry( place.latitudeDelta, place.latitudeDelta, 449, 449 );

			vertices = MAP.geometry.attributes.position.array;

			for ( var i = 2, j = 0; j < place.elevations.length; i += 3, j++ ) {

				vertices[ i ] = place.elevations[ j ];

			}

			MAP.geometry.applyMatrix( new THREE.Matrix4().makeScale( place.latitudeDelta, place.latitudeDelta, place.verticalScale * place.latitudeDelta / 111111 ) );

			MAP.geometry.computeFaceNormals();
			MAP.geometry.computeVertexNormals();
			MAP.geometry.computeBoundingBox();

			MAP.material = new THREE.MeshNormalMaterial( { side: 2 } );

			MAP.mesh = new THREE.Mesh( MAP.geometry, MAP.material );
			MAP.mesh.name = place.origin;

// comment out next line to get marker at proper location
			MAP.mesh.position.set( place.longitudeCenter, place.latitudeCenter, 0 );
			MAP.mesh.updateMatrixWorld();

			MAP.boxHelper = new THREE.BoxHelper( MAP.mesh, 0xff0000 );
			MAP.boxHelper.name = 'boxHelper';
			THR.scene.add( MAP.boxHelper );
//			MAP.boxHelper.visible = false;

			THR.scene.add( MAP.mesh );

/*
			particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
			particle = new THREE.Sprite( particleMaterial );
			particle.scale.x = particle.scale.y = 0.01 * scale;
			THR.scene.add( particle );
*/

			setCamera();

		}

	}


	function setCamera() {

		var cameraPosition;

//		MAP.mesh.geometry.computeBoundingSphere();
		MAP.radius = MAP.boxHelper.geometry.boundingSphere.radius;
		MAP.center = MAP.boxHelper.geometry.boundingSphere.center;

		THR.controls.target.copy( MAP.center );
//		THR.controls.maxDistance = 3 * MAP.radius;
//		THR.controls.autoRotate = true;

		cameraPosition = 0.7 * MAP.radius;
		THR.camera.position.copy( MAP.center.clone() ).add( v( 0, -cameraPosition, cameraPosition ) );

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

		material = new THREE.MeshBasicMaterial( {  MAP: texture, side: THREE.DoubleSide, transparent: true } );

		mesh = new THREE.Mesh( geometry, material );

		obj.add( mesh );
		obj.mesh = mesh;

		return obj;

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
