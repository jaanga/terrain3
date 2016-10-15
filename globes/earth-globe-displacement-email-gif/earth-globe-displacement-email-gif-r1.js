
// needs work - get menu going etc

	var globe = {};

	globe.sourceHeight = '../../bitmaps/bathymetry_bw_composite_2k.png';
	globe.sourceTexture = '../../bitmaps/2_no_clouds_4k.jpg';
	globe.width = 2048;
	globe.height = 1024;
	globe.meshEarth = new THREE.Object3D();
	globe.meshSeaLevel = new THREE.Object3D();

	globe.sourceFolder = '../../bitmaps/';
	globe.overlays = [

		[ 'bathymetry_bw_composite_2k.png', 'height map' ],
		[ 'Elevation.jpg', 'Elevation' ],
		[ 'GLOBALeb3colshade.jpg', 'Global eb3 color shade' ],
		[ 'world.topo.bathy.200408.3x5400x2700.jpg', 'World Topo Bathy' ],
		[ '2_no_clouds_4k.jpg','no clouds'],
		[ 'world-map.jpg','world-map']

	];

	function drawGlobe() {

//		if ( !menuContents.innerHTML ) { setGlobeMenu(); }
//		outScale.value = inpScale.value;

		obj.remove( globe.meshEarth, globe.meshSeaLevel );

		globe.verticesY = 512; //256 * Math.pow( 2, selVertices.selectedIndex );
		globe.verticesX = 1025; //2 * globe.verticesY;

		globe.loader = new THREE.TextureLoader();
		globe.loader.crossOrigin = '';
		heightmap = globe.loader.load( globe.sourceHeight );

//		texture = globe.loader.load( globe.sourceFolder + globe.overlays[ selOverlay.selectedIndex ][0] )
//		texture = globe.loader.load( globe.sourceFolder + 'Elevation.jpg' )
		texture = globe.loader.load( globe.sourceFolder + 'bathymetry_bw_composite_2k.png' )

		geometry = new THREE.SphereBufferGeometry( 6371, globe.verticesX - 1, globe.verticesY - 1 );

		material = new THREE.MeshPhongMaterial( {

			color: 0xccccff,
			map: texture,
			displacementMap: heightmap,
			displacementScale: 120 * 10 // inpScale.valueAsNumber

		} );

		globe.meshEarth = new THREE.Mesh( geometry, material );

//		geometry = new THREE.SphereBufferGeometry( 6371 + 60 * inpScale.valueAsNumber, 50, 25 );
		geometry = new THREE.SphereBufferGeometry( 6371 + 60 * 10, 50, 25 );
		material = new THREE.MeshNormalMaterial( { opacity: 0.5, transparent: true } );
		globe.meshSeaLevel = new THREE.Mesh( geometry, material );

		obj.add( globe.meshEarth, globe.meshSeaLevel );

console.timeEnd( 'timer 0' );

	}



	function setOverlay() {

		texture = globe.loader.load( globe.sourceFolder + globe.overlays[ selOverlay.selectedIndex ][0] );

		globe.meshEarth.material.map = texture;

	}






	function setGlobeMenu( target ) {

		target = target || menuContents;

		target.innerHTML =

			'<details open>' +

				'<summary><h3>globe details</h3></summary>' +

				'<p>Number of vertices<br>' +

					'<select id=selVertices onchange=globe.data="";drawGlobe(); size=3 > ' +
						'<option>512 x 256 </option>' +
						'<option selected >1024 x 512 </option>' +
						'<option>2048 x 1024 </option>' +
					'</select>' +

				'</p>' +

				'<p>Overlay<br><select id=selOverlay onchange=setOverlay(); ></select>' +


				'<p>' +
					'Vertical Scale: <output id=outScale >10</output>x<br>' +
					'<input type=range id=inpScale min=-20 max=30 step=1 value=15 onchange=drawGlobe(); />' +
				'</p>' +

				'<p>' +
					'Sea level opacity: <output id=outOpacity >50</output>%<br>' +
					'<input type=range id=inpOpacity min=0 max=100 step=1 value=50 />' +
				'</p>' +

//				'<p><input type=checkbox id=chkNormalsLand onchange=drawGlobe(); > Reverse normals: land mass</p>' +
//				'<p><input type=checkbox id=chkNormalsSea onchange=drawGlobe(); > Reverse normals: sea level</p>' +


			'</details>' +
		'';

		for ( var i = 0; i < globe.overlays.length; i++) {

				selOverlay.appendChild( document.createElement( 'option' ) );
				selOverlay.children[ i ].text = globe.overlays[i][1];

		}

		selOverlay.selectedIndex = 0;

		inpOpacity.onchange = function() {

			globe.meshSeaLevel.material.opacity = 0.01 * this.value;
			outOpacity.value = this.value;

		};

		if ( window.innerWidth < 800 ) { selVertices.selectedIndex = 0; }

	}




// https://github.com/spite/ccapture.js

// Thank you Jaume


	var GIF = GIF || {};


//	var capturer = new CCapture( { format: 'webm' } );

	// Create a capturer that exports an animated GIF
	// Notices you have to specify the path to the gif.worker.js 
	var capturer = new CCapture( { format: 'gif', workersPath: 'js/' } );

	// Create a capturer that exports PNG images in a TAR file
//	var capturer = new CCapture( { format: 'png' } );

	// Create a capturer that exports JPEG images in a TAR file
//	var capturer = new CCapture( { format: 'jpg' } );

	GIF.rotate = false;
	GIF.capture = false;
	GIF.width = 512;
	GIF.height = 350;

	GIF.step = 2.5;
	GIF.framerate = 5;
	GIF.frameLimit = 150;
	GIF.generating = false;

	GIF.time = 0;


// menu

//			GIF.getMenuDetailsCreateAnimatedGIF() +

//		GIFdetailsCreateAnimatedGIF.setAttribute('open', 'open');


	GIF.getMenuDetailsCreateAnimatedGIF = function() {

		var menuDetailsCreateAnimatedGIF =

			'<details id=GIFdetailsCreateAnimatedGIF open >' +

				'<summary id=GIFmenuSummaryCreateAnimatedGIF ><h3>Create Animated GIF</h3></summary>' +

				'<div id=GIFdivCreateAnimatedGIF >' +

				'<p><button onclick=updateScene(); >update scene</button></p>' +

				'<p><button onclick=GIF.captureStart(); >capture start</button></p>' +

				'<p><button onclick=GIF.captureStop(); >capture stop</button></p>' +

				'<p><button onclick=capturer.save(); >capture save</button></p>' +

			'</div>' + b +

			'</details>' +

		'';

		return menuDetailsCreateAnimatedGIF;

	};


	function updateScene() {

		capturer = new CCapture( { 
			verbose: true, 
			display: true,
			name: 'demo',
			framerate: GIF.framerate, //framerate
//			motionBlurFrames: ( 960 / 200 ), // * ( document.querySelector('input[name="motion-blur"]').checked ? 1 : 0 ),
			quality: 30,
			format: 'gif', //document.querySelector('input[name="encoder"]:checked').value,
			workersPath: 'js/',
//			timeLimit: 2,  // number of seconds to capture
			frameLimit: GIF.frameLimit,
			autoSaveTime: 0,
//			onProgress: function( p ) { progress.style.width = ( p * 100 ) + '%' }
		} );


		THR.controls.autoRotate = false;
//		THR.renderer.setClearColor( 0xf0f0f0 );

		GIF.step = 2.5;

		GIF.rotate = true;

	}


	GIF.captureStart = function() {

		GIF.rotate = true;
		GIF.capture = true;

		capturer.start();

	}

	GIF.captureStop = function() {

		GIF.rotate = false;
		GIF.capture = false;

		capturer.stop();

	}



	GIF.animate = function () {


		requestAnimationFrame( GIF.animate );
		THR.controls.update();
//		THR.stats.update();
		THR.renderer.render( THR.scene, THR.camera );

		if ( GIF.rotate === true ) {

			GIF.step += -2 * Math.PI / GIF.frameLimit;

			obj.rotation.y = GIF.step;

		}

		if ( GIF.capture === true ) {

			capturer.capture( THR.renderer.domElement );

		}

	}

