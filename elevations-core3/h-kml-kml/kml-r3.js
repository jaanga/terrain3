// Copyright &copy; 2016 Jaanga authors. MIT License

	var KML = KML || {};
	KML.lift = 0.01;

	KML.getMenuDetailsKML = function() {

		var menuDetailsKML =

			'<details id=detailsKML open >' +

				'<summary id=menuSummaryKML ><h3>KML options</h3></summary>' +

				'<p><input type=file id=KMLinpFile onchange=KML.readFile(this); /></p>' +

				'<p>' +
					'<button onclick=KML.getPathProperties(); > get path properties </button>' +
					'<button onclick=KML.setVerticalScaleToOne(); > set vertical scale to 1.0 </button>' +
					'<button onclick=KML.setPathProperties(); > set path elevations </button>' +
					'<button onclick=ELV.saveFile(); > save to file </button>' + b +
				'</p>' +

				'<p id=pPathProperties ></p>' +

			'</p>' + b +

			'</details>' +

		'';

		return menuDetailsKML;

	};



	KML.setVerticalScaleToOne = function() {

		TERinpVertical.value = 1;

		TER.TERinpVerticalOnChange();

	};



	KML.setPathProperties = function() {

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


	KML.getPathProperties = function() {

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


	KML.drawPath = function() {

		var geometry, material, pp, points;
		var place;

		place = COR.place;

		if ( !place.points || !THR.scene ) { return; }

		THR.scene.remove( THR.line, THR.line2, THR.line3 );

//		TERinpVertical.value = place.verticalScale;

//		TER.TERinpVerticalOnChange();

		pp = place.points;
		points = [];

		for ( var i = 0; i < place.points.length; i +=3 ) {

			points.push( v( pp[ i ], pp[ i + 2 ] / 111111, - pp [ i + 1 ] ) );

		}


		geometry = new THREE.Geometry();
		geometry.vertices = points;

		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );

// change to KML.line here and everywhere else

		THR.line = new THREE.Line( geometry, material);
		THR.line.scale.y = COR.place.verticalScale;
		THR.line.name = 'path';

//		THR.scene.add( THR.line );

		THR.curve1 = new THREE.CatmullRomCurve3( THR.line.geometry.vertices );
		THR.curve1.closed = false;

		spacedPoints = THR.curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;

		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//		THR.line2 = new THREE.Line( geometry, material );
		THR.line2 = MSH.getMeshLine( spacedPoints, 0x00ff00, 0.0005 );

		THR.line2.updateMatrixWorld();
		THR.line2.scale.y = COR.place.verticalScale;
//		THR.scene.add( THR.line2 );

		THR.curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices = THR.curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

//		THR.line3 = new THREE.Line( geometry, material );
//		THR.line3 = MSH.getMeshLine( spacedPoints, 0xffff00, 0.0002 );
		THR.line3 = MSH.getMeshLine( geometry.vertices, 0xffff00, 0.0003 );

		THR.line3.updateMatrixWorld();
		THR.line3.scale.y = COR.place.verticalScale;


		THR.scene.add( THR.line3 );

//		THR.curve3 = new THREE.CatmullRomCurve3( THR.line3.geometry.vertices  );
		THR.curve3 = new THREE.CatmullRomCurve3( geometry.vertices );

		CAS.curve = THR.curve3;

		motion = true;

	};


// Called by Elevation Get

	KML.getFile = function( url ) {

		var xhr, response, xmlParse, text, lines, coordinates;

		KML.openKML( url );

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml" );

			KML.convertXMLtoPoints( xmlParse );

		}

	};

	KML.readFile = function( files ) {

		var reader;

		reader = new FileReader();
		reader.onloadend = function( event ) {

			xmlParse = ( new window.DOMParser() ).parseFromString( reader.result, "text/xml" );

			KML.convertXMLtoPoints( xmlParse );

console.log( 'xmlParse', xmlParse );


//			SEL.fileJSON = JSON.parse( reader.result );
//			COR.place = JSON.parse( reader.result );
//			COR.fileName = files.files[ 0 ].name;
//			COR.onLoadJSONFile();

		};

		reader.readAsText( files.files[ 0 ] );

	};



	KML.convertXMLtoPoints = function( xmlParse ) {

		text = xmlParse.getElementsByTagName( "coordinates" )[ 0 ];
		text = text.textContent;

		text = text.replace( / /g, ',' );
		text = text.replace( /\n/g, ',' );

//			lines = text.split( '\n' ); //
		lines = text.split( ',' ); //
		coordinates = [];


		for ( var i = 0; i < lines.length; i++ ) {

			line = lines[ i ];
//				point = line.split( ',' ).map( parseFloat );
//				coordinates = coordinates.concat( point );

			coord = parseFloat( line );
			if ( isNaN( coord ) ) { continue; }
			coordinates.push( coord );

		}

		COR.place.points = coordinates; //.slice( 0,  );

//		pp = COR.place.points;

//		if ( window.console ) { console.log( pp.slice( 0, 10 ) ); }

		if ( THR.scene ) { KML.drawPath(); }

	};




// Called by Elevation Get KML

// https://developers.google.com/maps/documentation/javascript/examples/layer-kml

	KML.openKML = function( url ) {

		var kmlLayer;
		var place = COR.place;

		place.kmlFile = url;
		place.vicinity = place.origin = url.split( '/' ).pop().slice( 0, - SEL.extension.length );

		kmlLayer = new google.maps.KmlLayer( {

			url: url,
			map: googleMap.map

		} );

		googleMap.map.addListener( 'center_changed', function(  ) {

//console.log( '', googleMap.map.center.lat(), googleMap.map.center.lng() );

			googleMap.clearAll();

			place.latitude = googleMap.map.center.lat();

			place.longitude = googleMap.map.center.lng();

//			CLK.onClickGoogleMap();

//			CLK.setCenter( place.latitude, place.longitude );

        } );

	};
