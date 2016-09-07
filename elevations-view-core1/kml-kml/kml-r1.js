
	SEL.defaultFile = '../../sandbox/elevations-view-oakland-gran-fondo/oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';

	var actorScale = 1;

	COR.getMenuPlugins = function() {

		return CAS.getMenuDetailsCameraActions() +
			OVR.getMenuDetailsOverlay() + 
			TER.getMenuDetailsTerrain();

	};

	SEL.onLoadJSONFile = function() {

		var place;

		COR.place = SEL.fileJSON;
		place = COR.place;
		place.name = SEL.fileName;

		THR.scene = new THREE.Scene();

		COR.getPlaceDefaults();

console.log( 'loaded', place );

		inpVertical.onchange = function() { place.verticalScale = parseFloat( inpVertical.value ); initMapGeometry(); };

		inpVertical.value = place.verticalScale;
		inpVertical.max = 3 * place.verticalScale;
		outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

		selMapZoom.selectedIndex = place.deltaOverlay;

		initMapGeometry();

		KML.drawPath();

	}


	THR.moreThreejsInits = function() {

		var controls = THR.controls;
		var camera = THR.camera;
		var scene = THR.scene;
		var stats = THR.stats;
		var renderer = THR.renderer;

/*
		position = new THREE.Vector3( 200 * Math.random() - 100, 0, 200 * Math.random() - 100 );

		geometry = new THREE.BoxGeometry( 100, 2, 100 );
		material = new THREE.MeshNormalMaterial();
		ground = new THREE.Mesh( geometry, material );
		ground.position.set( position.x, -31, position.z );
		THR.scene.add( ground );

		gridHelper  = new THREE.GridHelper( 50, 10 );
		gridHelper.position.set( position.x, -30, position.z );
		THR.scene.add( gridHelper );

		line = CAS.getNicePath();
		line.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( position.x, 0, position.z ) );
		scene.add( line );

		line.geometry.computeBoundingSphere();

		center = line.geometry.boundingSphere.center;
		curve = new THREE.CatmullRomCurve3( line.geometry.vertices );
*/


//		CAS.getActorCylinder();


		axisHelper = new THREE.AxisHelper( 50 );
		THR.scene.add( axisHelper );


		geometry = new THREE.TorusKnotGeometry( 1, 1, 80 );
		material = new THREE.MeshNormalMaterial();


		actor = new THREE.Mesh( geometry, material );
		THR.scene.add( actor );


		CAS.cameraWorld();

		animatePlus = CAS.animatePlusLookAt;

		animatePlus();



	};


//

	var KML = {};

	KML.drawPath = function() {

		var geometry, material, pp, path, center, delta;
		var line, line2, line3, curve2, curve3;
		var place = COR.place;

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

		delta = v( MAP.cenLon - center.x , center.z, MAP.cenLat - center.y  ) 

//console.log( 'delta', delta );

		geometry.center();

		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeScale( 100, 100, 100 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( - delta.x - 0, delta.y + 0.0005, - delta.y - 0.006 ) );

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
		line2 = getMeshLine( spacedPoints, 0x00ff00, 0.3 );

		line2.updateMatrixWorld();
		THR.scene.add( line2 );

		curve2 = new THREE.CatmullRomCurve3( spacedPoints );

		geometry = new THREE.Geometry();
		geometry.vertices = curve2.getSpacedPoints( 2000 );
		material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

		line3 = new THREE.Line( geometry, material );
//		line3 = getMeshLine( spacedPoints, 0x00ff00, 0.1 );

		line3.updateMatrixWorld();

		THR.scene.add( line3 );

		curve3 = new THREE.CatmullRomCurve3( line3.geometry.vertices  );

		curve = curve3;

		motion = true;

	}
