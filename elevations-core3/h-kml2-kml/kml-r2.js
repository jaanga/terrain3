
//	SEL.defaultFile = '../../sandbox/elevations-view-oakland-gran-fondo/oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';

	var KML = KML || {};


	KML.drawPath = function() {

		var geometry, material, pp, points;
		var place = COR.place;

		THR.scene.remove( THR.line, THR.line2, THR.line3 );

		if ( !place.points ) { return; }
 
		pp = place.points;
		points = [];

		for ( var i = 0; i < place.points.length; i +=3 ) {

			points.push( v( pp[ i ], pp[ i + 2 ] * place.verticalScale / 111111, -pp[ i + 1 ] ) );

		} 

		geometry = new THREE.Geometry();
		geometry.vertices = points;

		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
		THR.line = new THREE.Line( geometry, material);
		THR.line.name = 'path';

		THR.scene.add( THR.line );

		THR.curve1 = new THREE.CatmullRomCurve3( THR.line.geometry.vertices );
		THR.curve1.closed = false;

		spacedPoints = THR.curve1.getSpacedPoints( 300 );

		geometry = new THREE.Geometry();
		geometry.vertices = spacedPoints;

		material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//		THR.line2 = new THREE.Line( geometry, material );
		THR.line2 = getMeshLine( spacedPoints, 0x00ff00, 0.0005 );

		THR.line2.updateMatrixWorld();
		THR.scene.add( THR.line2 );

		THR.curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices = THR.curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		THR.line3 = new THREE.Line( geometry, material );
//		THR.line3 = getMeshLine( spacedPoints, 0x00ff00, 0.01 );

		THR.line3.updateMatrixWorld();

		THR.scene.add( THR.line3 );

		THR.curve3 = new THREE.CatmullRomCurve3( THR.line3.geometry.vertices  );

		CAS.curve = THR.curve3;

//		motion = true;

	}
