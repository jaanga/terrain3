

	var raycaster;
	var mouse;
	var particle;

	function initGetAltitude() {

		var particleMaterial;

//		particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
//		particle = new THREE.Sprite( particleMaterial );
//		particle.scale.x = particle.scale.y = 0.005;


		geometry = new THREE.BoxGeometry( 0.005, 0.005, 0.01 );
		material = new THREE.MeshNormalMaterial();

		box = new THREE.Mesh( geometry, material );
		box.position.set( -122.4, 37.8, 0.001 );

		scene.add( box );

		particle = new THREE.Mesh( geometry, material );
//		particle.position.set( -122.4, 37.8, 0.001 );

		scene.add( particle );

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false ); // for mobile

		menuDetailsAltitude.innerHTML =

				'<details id=altitudeDetails >' +

					'<summary><h3>Position and Altitude</h3></summary>' +
					'<p id=altitudeData >When you click on the map, position and altitude details appear here.</p>' +

				'</details>' + b;

	}


	function onDocumentTouchStart( event ) {

		event.preventDefault();

		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;

		onDocumentMouseDown( event );

	}


	function onDocumentMouseDown( event ) {

//		var intersects, intersect, face, intersected;

		event.preventDefault();

		mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		intersects = raycaster.intersectObject( map.mesh );

		if ( intersects.length > 0 ) {

			intersect = intersects[ 0 ];
//			face = intersect.face;
//			intersected = intersect.object;



p = intersect.point;

console.log( 'interesct', p  );

			particle.position.set( p.x, p.y, p.z );

			altitudeDetails.setAttribute('open', 'open');

console.log( 'interesct', particle.position  );

			altitudeData.innerHTML =

				'Latitude: ' + intersect.point.y.toFixed( 3 ) + b +
				'Longitude: ' + intersect.point.x.toFixed( 3 ) + b +
				'Altitude: ' + ( intersect.point.z / place.verticalScale ).toFixed( 5 ) + b +

			b;


		} else {

			intersected = null;

			document.body.style.cursor = 'auto';

		}

	}
