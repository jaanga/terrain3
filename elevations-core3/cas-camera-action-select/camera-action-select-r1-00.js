
	var CAS = CAS || {};

	CAS.onLoad = function() {

		return CAS.getMenuDetailsCameraActions();

	};


// http://jaanga.github.io/cookbook-threejs/examples/animation/camera-actions-select/

	var tangent = new THREE.Vector3();
	var axis = new THREE.Vector3();
	var up = new THREE.Vector3( 0, 1, 0 );

	var cameraPoints = 9000;
	var zoomScale = 1;
	var actorScale = 1;

	var actor = new THREE.Object3D();
	var curve;

	var point = 0;
	var index = 0;
	var delta = 1;

	var motion = false;
	var follow = false;

	var origin = v( 0, 0, 0 );
	var center = origin;
	var target = origin;

	var cameraOffsetChase = v( 50 * zoomScale, 50 * zoomScale, 50 * zoomScale );
	var cameraOffsetInside = v( 0 * zoomScale, 20 * zoomScale, 0 * zoomScale );
	var cameraOffsetTrack = v( -80 * zoomScale, 10 * zoomScale, 10 * zoomScale );
	var cameraOffsetWorld = v( 80 * zoomScale, 80 * zoomScale, 80 * zoomScale );


// prevent default animate
//	function animate() {}

	CAS.getMenuDetailsCameraActions = function() {

		var menuDetailsCameraActions =

			'<details open>' +

				'<summary><h3>Animation settings</h3></summary>' +

// slide to move actor to desired position

				'<p><input type=checkbox id=chkRotate onchange=controls.autoRotate=!controls.autoRotate checked > scene rotation</p>'  +

				'<p><input type=checkbox onclick=motion=!motion checked > object motion</p>' +

				'<p>' +
					'Camera positions: <output id=outSpeed >' + cameraPoints + '</output><br>' +
					'<input type=range id=inpSpeed min=200 max=40000 step=100 value=' + cameraPoints + ' oninput=outSpeed.value=cameraPoints=this.valueAsNumber title="0 to 10: OK" >' +
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



	THR.moreThreejsInits = function() {

		position = new THREE.Vector3( 200 * Math.random() - 100, 0, 200 * Math.random() - 100 );

		geometry = new THREE.BoxGeometry( 100, 2, 100 );
		material = new THREE.MeshNormalMaterial();
		ground = new THREE.Mesh( geometry, material );
		ground.position.set( position.x, -31, position.z );
		THR.scene.add( ground );

		gridHelper  = new THREE.GridHelper( 50, 10 );
		gridHelper.position.set( position.x, -30, position.z );
		THR.scene.add( gridHelper );


		line = CAS.getNicePath();
		line.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( position.x, 0, position.z ) );
		THR.scene.add( line );

		line.geometry.computeBoundingSphere();

		center = line.geometry.boundingSphere.center;
		curve = new THREE.CatmullRomCurve3( line.geometry.vertices );

		CAS.getActorCylinder();

		CAS.cameraWorld();

		animatePlus = CAS.animatePlusLookAt;

		animatePlus();

		motion = true;

	};


	CAS.cameraChase = function() {

		THR.controls.autoRotate = false;
		cameraPoints = 20000;
		actor.add( THR.camera );
		THR.camera.position.copy( cameraOffsetChase );
		target = origin.clone();
		THR.controls.target.copy( target.clone() );
		follow = true;
	}


	CAS.cameraInside = function() {

		THR.controls.autoRotate = false;
		cameraPoints = 30000;
		actor.mesh.add( THR.camera );
		THR.camera.position.copy( origin.clone().add( cameraOffsetInside ) );
		target = origin.clone();
		THR.controls.target.copy( target );
		follow = true;

	}


	CAS.cameraTrack = function() {

		THR.controls.autoRotate = false;
		cameraPoints = 10000;
		THR.scene.add( THR.camera );
		THR.camera.position.copy( center.clone().add( cameraOffsetTrack ) );
		THR.controls.target.copy( center.clone() );
		target = actor.position;
		THR.controls.target.copy( target );
		follow = true;

	}


	CAS.cameraWorld = function() {

		THR.controls.autoRotate = false;
		cameraPoints = 10000;
		THR.scene.add( THR.camera );
		THR.camera.position.copy( cameraOffsetWorld );
		target = center.clone();
		THR.controls.target.copy( target );
		follow = false;

	}


// just in case


	CAS.getActorTorusKnot = function() {

		actor = new THREE.Object3D();

		geometry = new THREE.TorusKnotGeometry( 5 * actorScale, 1 * actorScale, 80 );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		actor.add( mesh );
		actor.mesh = mesh;

		scene.add( actor );

	}


	CAS.getActorCylinder = function() {

		var geometry, material, mesh;

		actor = new THREE.Object3D();

		geometry = new THREE.CylinderGeometry( 2 * actorScale, 5 * actorScale, 1 * actorScale, 20 );
//		geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 0.1, 1 ) );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		actor.add( mesh );

		actor.mesh = mesh;

		geometry = new THREE.BoxGeometry( 1 * actorScale, 2 * actorScale, 3 * actorScale );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0 * actorScale, 2 * actorScale, 3 * actorScale ) );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		actor.add( mesh );

		THR.scene.add( actor );

	}


	CAS.getActorBitmap = function( bitmap ) {

		var loader, geometry, material, mesh;

		actor = new THREE.Object3D();

		loader = new THREE.TextureLoader();
		loader.crossOrigin = '';
		texture = loader.load( bitmap || '../../bitmaps/j.gif' );

		texture.minFilter = texture.magFilter = THREE.NearestFilter;
//		texture.needsUpdate = true;
//		geometry = new THREE.BoxGeometry( 1 * actorScale, 3 * actorScale, 1 * actorScale );
		geometry = new THREE.PlaneBufferGeometry( 5 * actorScale, 5 * actorScale );
//		geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -pi05 ) );

		material = new THREE.MeshBasicMaterial( {  map: texture, side: THREE.DoubleSide, transparent: true } );
//		material = new THREE.MeshNormalMaterial();

		mesh = new THREE.Mesh( geometry, material );

		actor.add( mesh );
		actor.mesh = mesh;

		scene.add( actor );

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

		curve = new THREE.CatmullRomCurve3( vertices );
		curve.closed = true;

		geometry = new THREE.Geometry();
		geometry.vertices = curve.getPoints( points );

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

		line = new THREE.Line( geometry, material );

		return line;

	}


	function onKeyUp ( event ) {

//console.log( 'key', event.keyCode );

//		controls.enableKeys = false;

		event.preventDefault();

		switch( event.keyCode ) {

			case 32: controls.autoRotate = !controls.autoRotate;  break; // space bar

		}

	}


	CAS.animatePlusLookAt = function() {

		var point, dd;

		THR.stats.update();

		THR.controls.update();

		THR.renderer.render( THR.scene, THR.camera );

		requestAnimationFrame( CAS.animatePlusLookAt );

		if ( !motion ) { return; }

		dd = delta / cameraPoints;

		index += dd;

		index = index <= 1 ? index : dd;

		actor.position.copy( curve.getPoint( index - dd ) );

		actor.lookAt( curve.getPoint( index ) );

		if ( follow === true ) {

			THR.controls.target.copy( target );

		}

//		if ( index > 0.03 ) motion = false;

	}

	CAS.animatePlusWestLangley = function() {

		var radians;

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( CAS.animatePlusWestLangley );

		if ( !motion ) { return; }

		point = point <= 1 ? point : 0;

		actor.position.copy( curve.getPointAt( point ) );

		tangent = curve.getTangentAt( point ).normalize();

		axis.crossVectors( up, tangent ).normalize();

		radians = Math.acos( up.dot( tangent ) );

		actor.quaternion.setFromAxisAngle( axis, radians );

		point += 1 / cameraPoints;

	}



	CAS.animatePlusJayField = function() {

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( CAS.animatePlusWestLangley );

		if ( !motion ) { return; }

			point = ( point + 1 / cameraPoints ) %1.0 ;//increment t while maintaining it between 0.0 and 1.0
			var p = curve.getPoint( point ); //point at t
			var pn = curve.getPoint(( point + 1 / cameraPoints ) % 1.0 );//point at next t iteration

			if(p != null && pn != null){
				//move to current position
				actor.position.x = p.x;
				actor.position.z = p.z;
				//get orientation based on next position
				actor.rotation.y = Math.atan2( pn.z - p.z, pn.x - p.x );

			}

	}


// http://stackoverflow.com/questions/11179327/orient-objects-rotation-to-a-spline-point-tangent-in-three-js/11181366#11181366

// http://jsfiddle.net/SCXNQ/891/


	CAS.animatePlusWestLangleyType2 = function() {

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( CAS.animatePlusWestLangley );

		if ( !motion ) { return; }

// set the marker position
		pt = curve.getPoint( point );
		actor.position.set( pt.x, pt.y, pt.z );

// get the tangent to the curve
		tangent = curve.getTangent( t ).normalize();

// calculate the axis to rotate around
		axis.crossVectors( up, tangent ).normalize();

// calculate the angle between the up vector and the tangent
		radians = Math.acos( up.dot( tangent ) );

// set the quaternion
		actor.quaternion.setFromAxisAngle( axis, radians );

		point = ( point >= 1 ) ? 0 : point += 1 / cameraPoints ;

	}
