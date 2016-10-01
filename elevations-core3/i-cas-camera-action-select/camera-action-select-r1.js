
	var CAS = CAS || {};

	CAS.marker = 'Marker';

	CAS.offsetStart = 0;
	CAS.offsetEnd = 1;

//		if ( SELselFiles.selectedIndex === 1 ) { index = CAS.offsetStart = 0.32; CAS.offsetEnd = 0.39; }
//		if ( SELselFiles.selectedIndex === 3 ) { index = CAS.offsetStart = 0.25; CAS.offsetEnd = 0.76; }

	CAS.actor = new THREE.Object3D();
	CAS.cameraPoints = 25;
	CAS.zoomScale = 1;
	CAS.actorScale = 1;

	var point = 0;
	var index = 0;
	var delta = 1;

	var motion = false;
	var follow = false;

	var origin = v( 0, 0, 0 );
	CAS.center = origin;
	var target = origin;

	CAS.cameraOffsetChase = v( 50 * CAS.zoomScale, 50 * CAS.zoomScale, 50 * CAS.zoomScale );
	CAS.cameraOffsetInside = v( 0 * CAS.zoomScale, 20 * CAS.zoomScale, 0 * CAS.zoomScale );
	CAS.cameraOffsetTrack = v( -80 * CAS.zoomScale, 10 * CAS.zoomScale, 10 * CAS.zoomScale );
	CAS.cameraOffsetWorld = v( 80 * CAS.zoomScale, 80 * CAS.zoomScale, 80 * CAS.zoomScale );


// prevent default animate
//	function animate() {}

	CAS.getMenuDetailsCameraActions = function() {

		var menuDetailsCameraActions =

			'<details id=detailsMarkerActions open>' +

				'<summary id=summaryCameraActions ><h3>' + CAS.marker + ' settings</h3></summary>' +

// slide to move actor to desired position

				'<p><input type=checkbox id=CASchkMotion onclick=motion=!motion checked >' + CAS.marker +  ' <i>en route</i></p>' +

				'<p>' +
					CAS.marker + ' speed: <output id=CHKoutSpeed >' + CAS.cameraPoints + '</output><br>' +
					'<input type=range id=CASinpSpeed min=0 max=100 step=1 value=' + CAS.cameraPoints + 
						' oninput=CHKoutSpeed.value=CAS.cameraPoints=this.valueAsNumber title="0 to 10: OK" >' +
				'</p>' +

			'</details>' +

			'<details id=detailsCameraActions open>' +

				'<summary id=summaryCameraActions ><h3>Camera settings</h3></summary>' +

				'<p><button onclick=CAS.cameraChase(); >camera chase</button><br>' +
					'<small>Camera fixed a distance from actor, follows actor position and rotation</small>' +
				'</p>' +

				'<p><button onclick=CAS.cameraInside(); >camera inside</button><br>' +
					'<small>Camera fixed inside actor, follows a point just ahead of the actor</small>' +
				'</p>' +

				'<p><button onclick=CAS.cameraTrack(); >camera track</button><br>' +
					'<small>Camera fixed at position on ground, follows actor</small>' +
				'</p>' +

				'<p><button onclick=CAS.cameraWorld(); >camera world</button><br>' +
					'<small>Camera fixed at position in the air, follows nothing</small></p>' + b +

			'</details>';


		return menuDetailsCameraActions;

	}





	CAS.cameraChase = function() {

		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 20;
		CAS.actor.add( THR.camera );
		THR.camera.position.copy( CAS.cameraOffsetChase );
		target = origin.clone();
		THR.controls.target.copy( target.clone() );
		follow = true;

	}


	CAS.cameraInside = function() {

		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 10;
		CAS.actor.mesh.add( THR.camera );
		THR.camera.position.copy( origin.clone().add( CAS.cameraOffsetInside ) );
		target = origin.clone();
		THR.controls.target.copy( target );
		follow = true;

	}


	CAS.cameraTrack = function() {

		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 25;
		THR.scene.add( THR.camera );

		if ( MAP.mesh ) {

			THR.viewObject( MAP.mesh );

		} else {

			THR.camera.position.copy( origin.clone().add( CAS.cameraOffsetTrack ) );

		}

		THR.controls.target.copy( CAS.center.clone() );
		target = CAS.actor.position;
		THR.controls.target.copy( target );
		follow = true;

	}


	CAS.cameraWorld = function() {

		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 25;
		THR.scene.add( THR.camera );

		if ( MAP.mesh !== undefined ) {

			THR.viewObject( MAP.mesh );

		} else {

			THR.camera.position.copy( CAS.cameraOffsetWorld );

		}
		target = CAS.center.clone();
		THR.controls.target.copy( target );
		follow = false;

	}


// just in case


	CAS.getActorTorusKnot = function() {

		var geometry, material, mesh;

		CAS.actor = new THREE.Object3D();

		geometry = new THREE.TorusKnotGeometry( 5 * CAS.actorScale, 1 * CAS.actorScale, 80 );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		CAS.actor.add( mesh );
		CAS.actor.mesh = mesh;

		scene.add( CAS.actor );

	}


	CAS.getActorCylinder = function() {

		var geometry, material, mesh;

		CAS.actor = new THREE.Object3D();

		geometry = new THREE.CylinderGeometry( 2 * CAS.actorScale, 5 * CAS.actorScale, 1 * CAS.actorScale, 20 );
//		geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 0.1, 1 ) );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		CAS.actor.add( mesh );

		CAS.actor.mesh = mesh;

		geometry = new THREE.BoxGeometry( 1 * CAS.actorScale, 2 * CAS.actorScale, 3 * CAS.actorScale );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0 * CAS.actorScale, 2 * CAS.actorScale, 3 * CAS.actorScale ) );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		CAS.actor.add( mesh );

		THR.scene.add( CAS.actor );

	}


	CAS.getActorBitmap = function( bitmap ) {

		var loader, geometry, material, mesh;

		CAS.actor = new THREE.Object3D();

		loader = new THREE.TextureLoader();
		loader.crossOrigin = '';
		texture = loader.load( bitmap || '../bitmaps/j.gif' );

		texture.minFilter = texture.magFilter = THREE.NearestFilter;
//		texture.needsUpdate = true;
//		geometry = new THREE.BoxGeometry( 1 * CAS.actorScale, 3 * CAS.actorScale, 1 * CAS.actorScale );
		geometry = new THREE.PlaneBufferGeometry( 3 * CAS.actorScale, 3 * CAS.actorScale );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationY( -pi05 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0 * CAS.actorScale, 2 * CAS.actorScale, 0 * CAS.actorScale ) );

		material = new THREE.MeshBasicMaterial( {  map: texture, side: THREE.DoubleSide, transparent: true } );
//		material = new THREE.MeshNormalMaterial();

		mesh = new THREE.Mesh( geometry, material );

		CAS.actor.add( mesh );
		CAS.actor.mesh = mesh;

		THR.scene.add( CAS.actor );

	}

	CAS.getActorJSON = function( url ) {

		var loader, geometry, material, mesh;

		CAS.actor = new THREE.Object3D();
		CAS.actor.file = url || 'https://fgx.github.io/fgx-aircraft/data/c172p/c172p.js';

		var loader = new THREE.JSONLoader();
		loader.crossOrigin = 'anonymous';
		loader.load( CAS.actor.file, function ( geometry ) {

//			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeRotationY( -pi05 ) );
			geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.001, 0.001, 0.001 ) );
			material = new THREE.MeshNormalMaterial( { side: 2 } );
			mesh = new THREE.Mesh( geometry, material );

			CAS.actor.add( mesh );
			CAS.actor.mesh = mesh;

		} );

		THR.scene.add( CAS.actor );

	}


	CAS.getNicePath = function( scale ) {

		var segments = 20;
		var points = 500;
		var vertices, curve;
		var geometry, material, line;

		scale = scale || 30;
		vertices = [];

		for ( var i = 0; i < 2 * segments * Math.PI; i++ ) {

			vertices.push( v( scale * sin( i * 7 / segments ), scale * cos( i * 3 / segments  ), scale * sin( i * 2 / segments  ) ) );

		}

		CAS.curve = new THREE.CatmullRomCurve3( vertices );
		CAS.curve.closed = true;

		geometry = new THREE.Geometry();
		geometry.vertices = CAS.curve.getPoints( points );

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

		line = new THREE.Line( geometry, material );

		return line;

	}



	CAS.animatePlusLookAt = function() {

		var point, dd;

		THR.stats.update();

		THR.controls.update();

		THR.renderer.render( THR.scene, THR.camera );

		requestAnimationFrame( CAS.animatePlusLookAt );

		if ( !motion ) { return; }

		dd = CAS.cameraPoints / 250000;

		index += dd;

		index = index <= CAS.offsetEnd ? index : dd + CAS.offsetStart;

		CAS.actor.position.copy( CAS.curve.getPoint( index - dd ) );

		CAS.actor.lookAt( CAS.curve.getPoint( index ) );

		if ( follow === true ) {

			THR.controls.target.copy( target );

		}

	}
