

// http://jaanga.github.io/cookbook-threejs/examples/animation/camera-actions-select/


	var cameraPoints = 2000;
	var zoomScale = 1;
	var actorScale = 1;

	var actor;
	var curve;

	var index = 0;
	var delta = 1;
	var motion = false;
	var follow = false;

	var v = function ( x, y, z ){ return new THREE.Vector3( x, y, z ); };
	var origin = v( 0, 0, 0 );
	var center = origin;
	var target = origin;

	var sin = Math.sin;
	var cos = Math.cos;
	var abs = Math.abs;

// prevent default animate
//	function animate() {}


	function getMenuDetailsCameraActions() {

		var menuDetailsCameraActions =

			'<details open>' +

				'<summary><h3>Animation settings</h3></summary>' +

// slide to move actor to desired position

				'<p><input type=checkbox id=chkRotate onchange=controls.autoRotate=!controls.autoRotate checked > scene rotation</p>'  +

				'<p><input type=checkbox onclick=motion=!motion checked > object motion</p>' +

				'<p>' +
					'Camera positions: <output id=outSpeed >' + cameraPoints + '</output><br>' +
					'<input type=range id=inpSpeed min=200 max=5000 step=100 value=' + cameraPoints + ' oninput=outSpeed.value=cameraPoints=this.valueAsNumber title="0 to 10: OK" >' +
				'</p>' +


				'<p><button onclick=cameraChase(); >camera chase</button><br>' +
					'Camera fixed a distance from actor, follows actor position and rotation' +
				'</p>' +

				'<p><button onclick=cameraInside(); >camera inside</button><br>' +
					'Camera fixed inside actor, follows a point just ahead of the actor' +
				'</p>' +

				'<p><button onclick=cameraTrack(); >camera track</button><br>' +
					'Camera fixed at position on ground, follows actor</p>' +

				'<p><button onclick=cameraWorld(); >camera world</button><br>' +
					'Camera fixed at position in the air, follows nothing</p>' +

			'</details>';

		return menuDetailsCameraActions;

	}



	function cameraChase() {

		controls.autoRotate = false;
		actor.add( camera );
		camera.position.set( 50 * zoomScale, 50 * zoomScale, 50 * zoomScale );
		target = origin.clone();
//		controls.target.copy( target );
		follow = true;
	}


	function cameraInside() {

		controls.autoRotate = false;
		actor.mesh.add( camera );
		camera.position.set( 0 * zoomScale, 20 * zoomScale, 0 * zoomScale );
		target = origin.clone();
//		controls.target.copy( target );
		follow = true;

	}


	function cameraTrack() {

		controls.autoRotate = false;
		actor.mesh.remove( camera );
		camera.position.copy( center.clone().add( v( -80 * zoomScale, 10 * zoomScale, 80 * zoomScale ) ) );
		target = actor.position;
//		controls.target.copy( target );
		follow = true;

	}


	function cameraWorld() {

		controls.autoRotate = false;
		actor.mesh.remove( camera );
		camera.position.copy( center.clone().add( v( 80 * zoomScale, 80 * zoomScale, 80 * zoomScale ) ) );
		target = center.clone();
		controls.target.copy( target );
		follow = false;

	}


// just in case 

	function getActor() {

		actor = new THREE.Object3D();

		geometry = new THREE.TorusKnotGeometry( 5 * actorScale, 1 * actorScale, 80 );
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh( geometry, material );

		actor.add( mesh );
		actor.mesh = mesh;

		scene.add( actor );

	}


	function getNicePath( scale ) {

		var segments = 20;
		var points = 100;
		var vertices, spline;
		var geometry, material, line;

		scale = scale || 30;
		vertices = [];

		for ( var i = 0; i < 2 * segments * Math.PI; i++ ) {

			vertices.push( v( scale * sin( i * 7 / segments ), scale * cos( i * 3 / segments  ), scale * sin( i * 2 / segments  ) ) );

		}

		spline = new THREE.CatmullRomCurve3( vertices );
		spline.closed = true;

		geometry = new THREE.Geometry();
		geometry.vertices = spline.getPoints( points );

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

		line = new THREE.Line( geometry, material );

		return line;

	}

//

	function animatePlus() {

		var point, pointAhead;

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( animatePlus );

		if ( !motion ) { return; }

		delta = abs( index ) > 1 ? -delta : delta;

		index += delta / cameraPoints;

//		index = abs( sin( index ) );  // bounce

		point = abs( index );

		actor.position.copy( curve.getPoint( point ) );
//		actor.mesh.rotation.setFromVector3( curve.getTangent( point ) );
		actor.lookAt( curve.getPoint( point + delta ) );


		if ( follow === true ) { controls.target.copy( target ); }

	}
