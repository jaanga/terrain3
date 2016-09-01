// 2016-08-18 ~ R4

//	var defaultFile = '../elevations-data-kml/7mile_ski_trail_13_1688_3105_3_3_90_90_.txt';

	var searchInFolder = 'elevations-data-kml/';
	var urlBase = '../../elevations/' + searchInFolder;

	var path;
	var points = 200;


	function postInits() {

		CAS.getActorBitmap( 'logo-beb-main-site.png' );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeScale( 2, 1, 1 ) );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( -pi05 ) );
		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( pi05 ) );

//		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( pi05 ) );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -0.005, 0, 0 ) );

		path = new THREE.Object3D();

//		if ( !place.points ) {

			getFilePathKML();

/*
		} else {

			drawPath();

			cameraWorld();
			motion = true;

		}
*/

	}

	function getMenuDetailsPath() {

		menuDetailsPath =

			'<details open>' +

				'<summary><h3>Path</h3></summary>' +

				'<p>' +
//					'<button onclick=initElevations(); >Get Elevations</button> &nbsp; ' +
					'<button onclick=saveFile(); >Save Elevations to File</button>' +
				'</p>' +

				'<details>' +

					'<summary><h4>Path details</h4></summary>' +

					'<p id=pathDetails ></p>' +

				'</details>' +

			'</details>' +

		b;

		return menuDetailsPath;

	}


	function getFilePathKML() {

		var xhr, response, xmlParse, text, coordinates;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', place.kmlFile, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml" );

			text = xmlParse.getElementsByTagName( "coordinates" )[ 0 ];
			text = text.textContent;

			lines = text.split( '\n' ); //
			coordinates = [];
			for ( var i = 0; i < lines.length; i++ ) {
				line = lines[ i ];
				point = line.split( ',' ).map( parseFloat );
				coordinates = coordinates.concat( point );

			} 

			place.points = coordinates.slice( 0, -3 );

			drawPath();

			cameraWorld();

			motion = true;

		}

	}


	function drawPath() {

		var scale, geometry, material;
		var spline;

		path.points = [];
		path.path = [];

		var pp = place.points;

		for ( var i = 0; i < place.points.length; ) {

			path.points.push( v( pp[ i++ ], pp[ i++ ], pp[ i++ ] * place.verticalScale / 111111 ) )

		} 

		geometry = new THREE.Geometry();

		geometry.vertices = path.points;
		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		path.path = new THREE.Line( geometry, material);
		path.name = 'path';

		geometry.computeBoundingSphere();
		path.center = geometry.boundingSphere.center;
		path.radius = 2 * geometry.boundingSphere.radius;

		path.box = new THREE.BoxHelper( path.path );

		scene.add( path.path, path.box );

		geometry.computeBoundingBox();
		latMin = geometry.boundingBox.min.y;
		latMax = geometry.boundingBox.max.y;
		lonMin = geometry.boundingBox.min.x;
		lonMax = geometry.boundingBox.max.x;

		pathDetails.innerHTML =

			'UL Lat: ' + latMax.toFixed( 4 ) + '&deg;' + b +
			'LR Lat: ' + latMin.toFixed( 4 ) + '&deg;' + b + b +

			'UL Lon: ' + lonMin.toFixed( 4 ) + '&deg;' + b +
			'LR Lon: ' + lonMax.toFixed( 4 ) + '&deg;' + b + b +

			'Center Latitude : ' + path.center.y.toFixed( 4 ) + '&deg;' + b +
			'Center Longitude: ' + path.center.x.toFixed( 4 ) + '&deg;' +

		b;

		center = path.center.clone();

		curve1 = new THREE.CatmullRomCurve3( path.points );
		curve1.closed = false;

		spacedPoints = curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;
		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		line2 = new THREE.Line( geometry, material );

		scene.add( line2 );

		curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices =  curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
		line3 = new THREE.Line( geometry, material );

		scene.add( line3 );

		curve = curve2;

//		meshLine = getMeshLine( spacedPoints, 0x00ff00, 0.001 );
//		scene.add( meshLine );

	}


	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var pl, blob, a;

		pl = JSON.stringify( place );
		pl = pl.replace ( /,\"/g, ',\n"' );
		blob = new Blob( [ pl ] );

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = place.fileName;
		a.click();

//		delete a;

	}
