
	var GIF = GIF || {};

	GIF.width = 512
	GIF.height = 384;
	GIF.delay = 8;

	GIF.generating = false;

	GIF.time = 0;

	GIF.getMenuDetailsGenerateAnimatedGIF = function() {

		var menuDetailsGenerateAnimatedGIF =

			'<details id=GIFdetailsGenerateAnimatedGIF open >' +

				'<summary id=GIFmenuSummaryGenerateAnimatedGIF ><h3>Generate Animated GIF</h3></summary>' +

				'<div id=GIFdivGenerateAnimatedGIF >' +

					'<button onClick=generateGIF(); >Generate Animated GIF</button> ' +
					'by <a href="https://github.com/deanm/omggif">omggif</a>' + b +
					'<progress id="progress" value="0" max="1"></progress>' + b +

					'<div id=info ></div>' + b +

			'</div>' +

			'</details>' + b +

		'';

		return menuDetailsGenerateAnimatedGIF;

	};




	THR.onWindowResize = function() {

		THR.camera.aspect = window.innerWidth / window.innerHeight;
		THR.camera.updateProjectionMatrix();

//		THR.renderer.setSize( window.innerWidth, window.innerHeight );

//		THR.stats.domElement.style.display = window.innerWidth < 500 ? 'none' : '';

	}



	GIF.animate = function() {

		if ( GIF.generating === false ) {

			requestAnimationFrame( GIF.animate );

		}

		GIF.time = ( GIF.time + 0.0005 ) % 1;

		GIF.render( GIF.time );

	};

	GIF.render = function( float ) {

		THR.mesh.rotation.x = float * 360 * ( Math.PI / 180 );
		THR.mesh.rotation.y = - float * 360 * ( Math.PI / 180 );

		THR.renderer.render( THR.scene, THR.camera );

	};



	function generateGIF() {

		var canvas, context;
		var palette, r, g, b;

		GIF.generating = true;

		var current = 0;
		var total = 80;

		canvas = document.createElement( 'canvas' );
		canvas.width = GIF.width;
		canvas.height = GIF.height;

		context = canvas.getContext( '2d' );

		var buffer = new Uint8Array( GIF.width * GIF.height * total * 5 );
		var gif = new GifWriter( buffer, GIF.width, GIF.height, { loop: 0 } );

		pixels = new Uint8Array( GIF.width * GIF.height );

		var addFrame = function () {

			GIF.render( current / total );

			context.drawImage( THR.renderer.domElement, 0, 0 );

			data = context.getImageData( 0, 0, GIF.width, GIF.height ).data;

			palette = [];

			for ( var j = 0, k = 0, jl = data.length; j < jl; j += 4, k ++ ) {

				r = Math.floor( data[ j + 0 ] * 0.1 ) * 10;
				g = Math.floor( data[ j + 1 ] * 0.1 ) * 10;
				b = Math.floor( data[ j + 2 ] * 0.1 ) * 10;
				color = r << 16 | g << 8 | b << 0;

				index = palette.indexOf( color );

				if ( index === -1 ) {

					pixels[ k ] = palette.length;
					palette.push( color );

				} else {

					pixels[ k ] = index;

				}

			}

			// force palette to be power of 2

			var powof2 = 1;

			while ( powof2 < palette.length ) powof2 <<= 1;

			palette.length = powof2 <= 256 ? powof2 : 256;

			gif.addFrame( 0, 0, GIF.width, GIF.height, pixels, { palette: new Uint32Array( palette ), delay: 10 /* GIF.delay */ } );

			current ++;

			if ( current < total ) {

				setTimeout( addFrame, 0 );

			} else {

				setTimeout( finish, 0 );

			}

			progress.value = current / total;

		}

		var finish = function () {

			// return buffer.slice( 0, gif.end() );

			var string = '';

			for ( var i = 0, l = gif.end(); i < l; i ++ ) {

				string += String.fromCharCode( buffer[ i ] )

			}

			var image = document.createElement( 'img' );
			image.src = 'data:image/gif;base64,' + btoa( string );
			document.body.appendChild( image );

			GIF.generating = false;
			GIF.animate();

		}

		addFrame();

	}