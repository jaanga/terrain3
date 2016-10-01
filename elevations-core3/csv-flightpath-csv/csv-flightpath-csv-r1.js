// Copyright &copy; 2016 Jaanga authors. MIT License

	var CSV = CSV || {};

	var index = 0;
	var indexDefault;

	var path = new THREE.Object3D();
//	path.url = '../../data-path-csv/6-25-2016-1-cooked.csv';


	CSV.getMenuDetailsCSV = function() {

		var menuDetailsCSV =

			'<details id=detailsCSV open >' +

				'<summary id=menuSummaryCSV ><h3>CSV options</h3></summary>' +

				'<p><input type=file id=CSVinpFile onchange=CSV.readFile(this); /></p>' +

				'<p>' +
					'<button onclick=CSV.getPathProperties(); > get path properties </button>' +
					'<button onclick=CSV.setVerticalScaleToOne(); > set vertical scale to 1.0 </button>' +
					'<button onclick=CSV.setPathProperties(); > set path elevations </button>' +
					'<button onclick=COR.saveFile(); > save to file </button>' + b +
				'</p>' +

				'<p id=menuFlightPathData ></p>' +
				'<p><input id=inpFly type=checkbox > Flying</p>' +

			'</p>' + b +

			'</details>' +

		'';

		return menuDetailsCSV;

	};



	CSV.setVerticalScaleToOne = function() {

		TERinpVertical.value = 1;

		TER.TERinpVerticalOnChange();

	};



	CSV.setPathProperties = function() {

		var place, vertices, vertex, points, raycaster, up, collisions, distance;

		THR.scene.remove( THR.lineX );

		place = COR.place;

		if ( !place.points ) { return; }

		vertices = THR.line.geometry.vertices;
		points = [];

		raycaster = new THREE.Raycaster();
		up = v( 0, 1, 0 );

		MAP.mesh.updateMatrixWorld();

		for ( var i = 0; i < vertices.length; i++ ) {

			vertex = vertices[ i ];
			raycaster.set( v( vertex.x, 0, vertex.z ), up, 0, 1 );
			collisions = raycaster.intersectObject( MAP.mesh );

			vertex.y = collisions.length ? collisions[ 0 ].distance : 0 ;
			points.push( vertex.x, -vertex.z, 111111 * vertex.y );

			if ( i % 100 === 0 ) {

				if (window.console) { console.log( 'Completed ' + i + ' of ' + vertices.length );

			}}

		}


//console.log( '', points.slice( 998, 1016 ) );

		THR.lineX = getMeshLine( vertices, 0xffff00, 0.0005 );
		THR.lineX.updateMatrixWorld();
		THR.lineX.scale.y = COR.place.verticalScale;
		THR.scene.add( THR.lineX );

		place.points = points;

	};


	CSV.getPathProperties = function() {

		var pt;

		if ( !THR.line ) { alert( 'No such geometry.' ); return; }

		pt = THR.line.geometry;
		pt.computeBoundingBox();

		var m2f = function( vect ) { return vect.toArray().map( function( num ){ return num.toFixed( 3 ); } ); };

		pPathProperties.innerHTML =

			'points: ' + pt.vertices.length + b +
			'center: ' + m2f( pt.boundingSphere.center ) + b +
			'radius: ' + pt.boundingSphere.radius.toFixed( 3 ) + b +
			'min: ' + m2f( pt.boundingBox.min ) + b +
			'max: ' + m2f( pt.boundingBox.max ) + b +

		b;

	};



// Called by Elevation Get

	CSV.getFile = function( url ) {

		var xhr, response, xmlParse, text, lines, coordinates;

		CSV.openCSV( url );

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

		}

	};


	CSV.readFile = function( files ) {

		var reader, text, waypoints;

		reader = new FileReader();
		reader.onloadend = function( event ) {

			text = reader.result;

			waypoints = text.split( '\n' ).map( function( point ) { return point.split( ',' ).map( parseFloat ); } );

			waypoints = waypoints.slice( 1, -1 );

//console.log( 'waypoints', waypoints );

			pts = [];
			rts = [];

			for ( var i = 0; i < waypoints.length; i++ ) {

				p = waypoints[ i ];

				pts.push( p[ 0 ], p[ 1 ], p[ 2 ] );
				rts.push( p[ 3 ], p[ 4 ], p[ 5 ] );

			}

			COR.place.points = pts;

			COR.place.rotations = rts;

			CSV.drawPath();

		};

		reader.readAsText( files.files[ 0 ] );

	};



	CSV.drawPath = function() {

		var scale, geometry, material;
//		var pp, points;
//		var place;

		place = COR.place;

		if ( !place.points ) { return; }

		THR.scene.remove( CSV.path, CSV.box );

		pathColor = 0xff00ff;
		indexDefault = place.indexDefault[ 0 ];
		index = indexDefault;

		pp = place.points;

		points = [];

		for ( var i = 0; i < place.points.length; i +=3 ) {

			points.push( v( pp[ i ], pp[ i + 2 ] / ( 111111 * 3.28 ), - pp [ i + 1 ] ) );

		}

		geometry = new THREE.Geometry();
		geometry.vertices = points;

		material = new THREE.LineBasicMaterial( { color: pathColor } );
		CSV.path = new THREE.Line( geometry, material);
		CSV.path.updateMatrixWorld();
		CSV.path.name = 'flightpath';

		CSV.box = new THREE.BoxHelper( CSV.path );
//		place.path.box.geometry.computeBoundingBox();

		CSV.box.scale.y = CSV.path.scale.y = COR.place.verticalScale;
		THR.scene.add( CSV.path, CSV.box );


		geometry.computeBoundingSphere();
//		center = geometry.boundingSphere.center;
//		latitude = center.z;
//		longitude = center.x;

		geometry.computeBoundingBox();
		latMin = geometry.boundingBox.min.z;
		latMax = geometry.boundingBox.max.z;
		lonMin = geometry.boundingBox.min.x;
		lonMax = geometry.boundingBox.max.x;

		menuFlightPathData.innerHTML =
			'UL Lat: ' + latMax.toFixed( 4 ) + '&deg;' + b +
			'LR Lat: ' + latMin.toFixed( 4 ) + '&deg;' + b + b +

			'UL Lon: ' + lonMin.toFixed( 4 ) + '&deg;' + b +
			'LR Lon: ' + lonMax.toFixed( 4 ) + '&deg;' + b + b +

//			'Center Latitude : ' + center.y.toFixed( 4 ) + '&deg;' + b +
//			'Center Longitude: ' + center.x.toFixed( 4 ) + '&deg;' + b +
		b;

		inpFly.checked = true;

//		setCameraWorld();
//		setCameraChase();

//		THR.camera.add( pointer );

	}
