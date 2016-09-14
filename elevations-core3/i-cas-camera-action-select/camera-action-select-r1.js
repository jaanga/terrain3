
	var CAS = CAS || {};

	CAS.onLoad = function() {

		return CAS.getMenuDetailsCameraActions();

	};


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

			'<details open>' +

				'<summary><h3>Ride settings</h3></summary>' +

// slide to move actor to desired position


				'<p><input type=checkbox id=CASchkMotion onclick=motion=!motion checked >Cyclist <i>en route</i></p>' +

				'<p>' +
					'Cyclist speed: <output id=CHKoutSpeed >' + CAS.cameraPoints + '</output><br>' +
					'<input type=range id=CASinpSpeed min=0 max=100 step=1 value=' + CAS.cameraPoints + 
						' oninput=CHKoutSpeed.value=CAS.cameraPoints=this.valueAsNumber title="0 to 10: OK" >' +
				'</p>' +


				'<p><button onclick=CAS.cameraChase(); >camera chase</button><br>' +
					'Camera fixed a distance from actor, follows actor position and rotation' +
				'</p>' +

				'<p><button onclick=CAS.cameraInside(); >camera inside</button><br>' +
					'Camera fixed inside actor, follows a point just ahead of the actor' +
				'</p>' +

				'<p><button onclick=CAS.cameraTrack(); >camera track</button><br>' +
					'Camera fixed at position on ground, follows actor</p>' +

				'<p><button onclick=CAS.cameraWorld(); >camera world</button><br>' +
					'Camera fixed at position in the air, follows nothing</p>' +

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

		CAS.offsetStart = 0;
		CAS.offsetEnd = 1;

		if ( SELselFiles.selectedIndex === 1 ) { index = CAS.offsetStart = 0.32; CAS.offsetEnd = 0.39; }
		if ( SELselFiles.selectedIndex === 3 ) { index = CAS.offsetStart = 0.25; CAS.offsetEnd = 0.76; }


		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 25;
		THR.scene.add( THR.camera );

		THR.viewObject( MAP.mesh );

//		THR.camera.position.copy( origin.clone().add( CAS.cameraOffsetTrack ) );
		THR.controls.target.copy( CAS.center.clone() );
		target = CAS.actor.position;
		THR.controls.target.copy( target );
		follow = true;

	}


	CAS.cameraWorld = function() {

		THR.controls.autoRotate = false;
		CHKoutSpeed.value = CAS.cameraPoints = 25;
		THR.scene.add( THR.camera );

		THR.viewObject( MAP.mesh );

//		THR.camera.position.copy( CAS.cameraOffsetWorld );
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

//		if ( index > 0.03 ) motion = false;

	}
