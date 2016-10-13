
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
	GIF.width = 512
	GIF.height = 256;

	GIF.step = 0;
	GIF.framerate = 10;
	GIF.frameLimit = 120;
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

		GIF.step = 0;

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
		THR.stats.update();
		THR.renderer.render( THR.scene, THR.camera );

		if ( GIF.rotate === true ) {

			GIF.step += 2 * Math.PI / GIF.frameLimit;

			MAP.mesh.rotation.y = GIF.step;

		}

		if ( GIF.capture === true ) {

			capturer.capture( THR.renderer.domElement );

		}

	}



