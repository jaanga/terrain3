
//	SEL.defaultFile = '../../sandbox/elevations-view-oakland-gran-fondo/oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';

	var actorScale = 1;

	var KML = KML || {};

	KML.onLoadJSONFile = function() {

		KML.drawPath();

	}


	KML.drawPath = function() {

//		var geometry, material, pp, path, center, delta;
		var line, line2, line3, curve2, curve3;
		var place = COR.place;

		pp = place.points;
		path = new THREE.Object3D();
		path.points = [];

		for ( var i = 0; i < place.points.length; i +=3 ) {

			path.points.push( v( pp[ i ], pp[ i + 2 ] * place.verticalScale / 111111, pp[ i + 1 ] ) );

		} 

		geometry = new THREE.Geometry();
		geometry.vertices = path.points;
		geometry.computeBoundingSphere();
		pc = geometry.boundingSphere.center;

//		delta = v( MAP.cenLon - center.x , center.z, MAP.cenLat - center.y  ) 


//		geometry.center();
//		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.0281, -0.007, -0.015 ) );
//		geometry.applyMatrix( new THREE.Matrix4().makeScale( 100, 100, 100 ) );


		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
		line = new THREE.Line( geometry, material);
		line.name = 'path';

		THR.scene.add( line );

		curve1 = new THREE.CatmullRomCurve3( line.geometry.vertices );
		curve1.closed = false;

		spacedPoints = curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;

		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//		line2 = new THREE.Line( geometry, material );
		line2 = getMeshLine( spacedPoints, 0x00ff00, 0.005 );

		line2.updateMatrixWorld();
		THR.scene.add( line2 );

		curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices = curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		line3 = new THREE.Line( geometry, material );
//		line3 = getMeshLine( spacedPoints, 0x00ff00, 0.01 );

		line3.updateMatrixWorld();

		THR.scene.add( line3 );

		curve3 = new THREE.CatmullRomCurve3( line3.geometry.vertices  );

		CAS.curve = curve3;

		motion = true;

	}
