// 2016-08-18 ~ R4


	var path;
	var points = 200;

	function postInits() {

		map.mesh.rotation.x = -pi05;
		map.mesh.position.set( 0, 0, 0 );

		map.plain.rotation.x = -pi05;
		map.plain.position.set( 0, -0.05, 0 );

//		controls.target = v( 0, 0, 0 );
//		controls.maxDistance = 600;
//		scene.fog.near = 1000;
//		scene.fog.far = 1000;

		axisHelper = new THREE.AxisHelper( 50 );
		scene.add( axisHelper );

		getFilePathKML();

		CAS.getActorBitmap( 'logo-beb-main-site.png' );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeScale( 2, 1, 1 ) );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( -pi05 ) );
//		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( pi05 ) );

		actor.mesh.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.005, 0 ) );

	}

	function getMenuDetailsPath() {

		menuDetailsPath =

			'<details >' +

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

			drawPath2();

			cameraWorld();

			motion = true;

		}

	}


	function drawPath2() {

		var geometry, material, pp, center, delta;
		var line, line2, line3, curve2, curve3;

		path = new THREE.Object3D();
		path.points = [];

		pp = place.points;

		for ( var i = 0; i < place.points.length;) {

			path.points.push( v( pp[ i++ ], pp[ i++ ], pp[ i++ ] * place.verticalScale / 111111 ) )

		} 

		geometry = new THREE.Geometry();
		geometry.vertices = path.points;
		geometry.computeBoundingSphere();
		center = geometry.boundingSphere.center;

		delta = v( map.cenLon - center.x , center.z, map.cenLat - center.y  ) 

//console.log( 'delta', delta );

		geometry.center();

		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( - delta.x - 0.002, delta.y + 0.001, - delta.y - 0.006 ) );

		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
		line = new THREE.Line( geometry, material);
		line.name = 'path';

		scene.add( line );

		curve1 = new THREE.CatmullRomCurve3( line.geometry.vertices );
		curve1.closed = false;

		spacedPoints = curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;

		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		line2 = new THREE.Line( geometry, material );

		line2.updateMatrixWorld();
		scene.add( line2 );

		curve2 = new THREE.CatmullRomCurve3( line2.geometry.vertices );

		geometry = new THREE.Geometry();
		geometry.vertices = curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		line3 = new THREE.Line( geometry, material );
//		line3 = getMeshLine( spacedPoints, 0x00ff00, 0.001 );

		line3.updateMatrixWorld();

		scene.add( line3 );

		curve3 = new THREE.CatmullRomCurve3( line3.geometry.vertices  );

		curve = curve3;

	}

	function drawPath() {

		var scale, geometry, material;

		path = new THREE.Object3D();
		path.points = [];

		var pp = place.points;

		for ( var i = 0; i < place.points.length; ) {

			path.points.push( v( pp[ i++ ], pp[ i++ ], pp[ i++ ] * place.verticalScale / 111111 ) )

		} 

		geometry = new THREE.Geometry();

		geometry.vertices = path.points;

//		geometry.applyMatrix( new THREE.Matrix4().makeRotationY( pi05 ) );

		material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		path.path = new THREE.Line( geometry, material );
		path.name = 'path';

		path.path.rotation.x = -pi05;
		path.path.updateMatrixWorld();

		path.path.geometry.computeBoundingSphere();
		path.center = path.path.geometry.boundingSphere.center;
		path.radius = 2 * path.path.geometry.boundingSphere.radius;

		path.path.position.set( - path.center.x, -path.center.y, -path.center.z );


		path.box = new THREE.BoxHelper( path.path );

		scene.add( path.path, path.box );

//		path.box.rotation.x = -pi05;
//		path.box.position.set( 0, 0, 0 );

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

		curve1 = new THREE.CatmullRomCurve3( ppp.vertices );
		curve1.closed = false;

		spacedPoints = curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;
		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		line2 = new THREE.Line( geometry, material );

		line2.updateMatrixWorld();
		line2.geometry.computeBoundingSphere();
		line2.center = line2.geometry.boundingSphere.center;

		line2.position.set( - line2.center.x, -line2.center.y, -line2.center.z );

		scene.add( line2 );



		curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices =  curve2.getSpacedPoints( 2000 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05 ) );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		line3 = new THREE.Line( geometry, material );
//		line3 = getMeshLine( spacedPoints, 0x00ff00, 0.001 );


		line3.updateMatrixWorld();
		line3.geometry.computeBoundingSphere();
		line3.center = line3.geometry.boundingSphere.center;

		line3.position.set( - line3.center.x, -line3.center.y, -line3.center.z );
		scene.add( line3 );

		line3.rotation.x = -pi05;
//		line3.position.set( 0, 0, 0 );

		curve = curve2;


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
