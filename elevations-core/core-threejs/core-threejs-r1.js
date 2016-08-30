
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

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set( 100, 100, 100 );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 800;
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


	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

	}

	function animate() {

		stats.update();

		controls.update();

		renderer.render( scene, camera );

		requestAnimationFrame( animate );

	}