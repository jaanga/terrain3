

//			TUB.getMenuDetailsTube() +

//		detailsTube.setAttribute('open', 'open');


	var TUB = TUB || {};

	var tube, line;

	TUB.getMenuDetailsTube = function() {

		var menuDetailsTube =

			'<details id=detailsTube >' +

				'<summary><h3>Tube</h3></summary>' +

				'<p id=pTube >' +


					'<p>Segments:' + b +
						'<input type=range id=inpSegments min=2 max=100 step=1 value=50 oninput=outSegments.value=inpSegments.value; title="2 to 100: OK" > <output id=outSegments >50</output></p>' +

					'<p>Radial Segments:' + b +
						'<input type=range id=inpRadialSegments min=2 max=20 step=1 value=8 oninput=outRadialSegments.value=inpRadialSegments.value; title="2 to 20: OK" > <output id=outRadialSegments >8</output></p>' +

					'<p>Tension:' + b +
						'<input type=range id=inpTension min=0 max=1 step=0.01 value=0.5 oninput=outTension.value=inpTension.value; title="0 to 1: OK" > <output id=outTension >0.5</output></p>' +

					'<button onclick=TUB.drawCatmullRomBox(); > drawCatmullRomBox  </button>' + b +

					'<button onclick=TUB.drawCatmullRomShape(); > drawCatmullRomShape </button>' + b +

					'<hr>' +

					'<p>Vertices:' + b +
						'<input type=range id=inpVertices min=2 max=100 step=1 value=5 oninput=outVertices.value=inpVertices.value; title="2 to 100: OK" > <output id=outVertices >5</output></p>' +

					'<button onclick=TUB.drawRandomSplineTube(); > drawRandomSplineTube </button>' + b +


					'<button onclick=TUB.drawTube(); > draw Tube (defaults test )</button>' + b +

			'</p>' +

			'</details>' +

		b;

		return menuDetailsTube;

	};



	TUB.drawRandomSplineTube = function() {

		var vertices, spline;

		vertices = [];


		for ( var i = 0; i < inpVertices.valueAsNumber; i++ ) {

			vertices.push( v( 100 * ran() - 50, 50 * ran() , 100 * ran() - 50 ) );

		}

		spline = new THREE.CatmullRomCurve3( vertices );

		TUB.drawTube( spline );

	}


	TUB.drawCatmullRomBox = function() {

		var vertices, spline;

		vertices = [];

		vertices = [ v( 50, 10, 30 ), v( 50, 10, -30 ), v( -50, 10, -30 ), v( -50, 10, 30 ) ];
		catmullRomCurve3 = new THREE.CatmullRomCurve3( vertices );
		catmullRomCurve3.type = 'catmullrom';
		catmullRomCurve3.tension = inpTension.valueAsNumber;
		catmullRomCurve3.closed = true;

		TUB.drawTube( catmullRomCurve3 );

	}



	TUB.drawCatmullRomShape = function() {

		var vertices, spline;

		vertices = [];

		vertices = [ v( 0, 0, 0 ), v( 50, 0, 20 ), v( 50, 50, -50 ), v( 0, 50, 0) ];
		catmullRomCurve3 = new THREE.CatmullRomCurve3( vertices );
		catmullRomCurve3.type = 'catmullrom';
		catmullRomCurve3.tension = inpTension.valueAsNumber;
		catmullRomCurve3.closed = true;

		TUB.drawTube( catmullRomCurve3 );

	}




	TUB.drawTube = function( splin ) {

		var spline;

		THR.scene.remove( tube, line );

		spline = splin || new THREE.CatmullRomCurve3( [ v( 0, 0, 0 ), v( 50, 0, 20 ), v( 50, 50, -50 ), v( 0, 50, 0) ] );

// TubeGeometry(path, segments, radius, radiusSegments, closed, debug )

		geometry = new THREE.TubeGeometry( spline, inpSegments.valueAsNumber, 4, inpRadialSegments.valueAsNumber, false, false);
		material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: chkWireframe.checked }  );
		tube = new THREE.Mesh( geometry, material );
		THR.scene.add( tube );

		geometry = new THREE.Geometry();
		geometry.vertices = spline.points
		material = new THREE.LineBasicMaterial( { color: 0x000000 } );
		line = new THREE.Line( geometry, material );
		THR.scene.add( line );

	}