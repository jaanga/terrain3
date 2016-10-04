
// shortcuts

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;

	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

	var sin = Math.sin;
	var cos = Math.cos;
	var abs = Math.abs;
	var ran = Math.random;

//

	var THR = THR || {};

	THR.cameraNear = 0.001;
	THR.cameraFar = COR.zoom < 9 ? 2 : 3;

	THR.getThreeJS = function() {

		var ground, gridHelper, axisHelper;
		var geometry, material;

		THR.stats = new Stats();
		THR.stats.domElement.style.cssText = 'position: absolute; right: 0; top: 0;' ;
		document.body.appendChild( THR.stats.domElement );
		THR.stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

		THR.renderer = new THREE.WebGLRenderer( {  alpha: 1, antialias: true }  );
		THR.renderer.setClearColor( COR.defaults.backgroundColor );
//		THR.renderer.setPixelRatio( window.devicePixelRatio );
		THR.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( THR.renderer.domElement );

		THR.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, THR.cameraNear, THR.cameraFar );
		THR.camera.position.set( 100, 100, 100 );

		THR.controls = new THREE.OrbitControls( THR.camera, THR.renderer.domElement );
		THR.controls.maxDistance = 800;
//		THR.controls.autoRotate = true;

		THR.scene = new THREE.Scene();

		window.addEventListener( 'resize', THR.onWindowResize, false );

// assets

		THR.moreThreejsInits()

	}


	THR.moreThreejsInits = function() {};


	THR.viewObject = function( mesh ) {

		var cameraPosition;

		mesh.updateMatrixWorld();
		mesh.geometry.computeBoundingSphere();

		THR.radius = mesh.geometry.boundingSphere.radius;
		THR.center = mesh.position.clone().add( mesh.geometry.boundingSphere.center );

		THR.controls.target.copy( THR.center );
		THR.controls.maxDistance = 3 * THR.radius;

		cameraPosition = 1 * THR.radius;
		THR.camera.position.copy( THR.center.clone() ).add( v( 0, cameraPosition, cameraPosition ) );

	}



	THR.toggleFog = function( checked ) {

		if ( checked === true ) {

//			THR.scene.fog = new THREE.Fog( 0x7ec0ee, COR.place.fogNear, COR.place.fogFar );
			THR.scene.fog = new THREE.Fog( COR.defaults.backgroundColor, 2 * THR.radius, 4 * THR.radius );

		} else {

			THR.scene.fog.near = 5000 ;
			THR.scene.fog.far = 5000 ;

		}

	}


// 		window.addEventListener( 'keyup', THR.onKeyUp, false );

	THR.onKeyUp = function ( event ) {

//console.log( 'key', event.keyCode );

//		controls.enableKeys = false;

		event.preventDefault();

		switch( event.keyCode ) {

			case 32: THR.controls.autoRotate = !THR.controls.autoRotate;  break; // space bar

//			case 32: TERchkRotate.click();  break; // space bar

		}

	}



	THR.onWindowResize = function() {

		THR.camera.aspect = window.innerWidth / window.innerHeight;
		THR.camera.updateProjectionMatrix();

		THR.renderer.setSize( window.innerWidth, window.innerHeight );

		THR.stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

	}



	THR.animate = function() {

		THR.stats.update();

		THR.controls.update();

		THR.renderer.render( THR.scene, THR.camera );

		requestAnimationFrame( THR.animate );

	}


// utilities

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
