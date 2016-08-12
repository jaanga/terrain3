
	var pathDataKML = [

//		{ name: 'LEIG - Igualada', 
//			path: '../../data-path-kml/LEIG-L1500-01.kml', 
//			elevations: '../../elevations/elevations-airports-01/leig_13_4133_3052_3_3_510_510_.txt' },
//		{ name: 'VHSK - Sek Kong', 
//			path: '../../data-path-kml/VHSK-22-01.kml', 
//			elevations: '../../elevations/elevations-airports-01/vhsk_13_6690_3570_3_3_510_510_.txt' },
		{ name: 'SnowMountainActual',
			path: '../../data-path-kml/snow-mountain-actual.kml', 
			elevations: '../../elevations/elevations-data-kml/snow-mountain-actual-ca-usa_12_650_1558_3_3_510_510_.txt' },
		{ name: 'SnowMountainWilderness', 
			path: '../../data-path-kml/snow-mountain-wilderness.kml', 
			elevations: '../../elevations/elevations-data-kml/snow-mouuntain-wilderness-ca-usa_13_1301_3119_3_3_510_510_.txt' }

	];

	function getGitHubAPITreeContents(){};

	function setMenuDetailsSelectFile() {

		menuPlugins.innerHTML += 

		'<details open >' +
			'<summary><h3>Select KML file to view</h3></summary>' +
			'<small>Select or open a file to view in 3D</small>' +
			'<p>' +
				'<select id=selPath size=5 style=width:100%; >' +
			'</p>' +
			'<p><input type=file id=inpFile onchange=getElevationsFileReader(this); /></p>' +

			'<details>' +

				'<summary><h4>file name parameters</h4></summary>' +

				'<div id=menuDetailsFileNameParameters ></div>' +

				'<div id=info ></div>' +

			'</details>' + b +

		'</details>';

		for ( var i = 0; i < pathDataKML.length; i++ ) {

			selPath[ selPath.length ] = new Option( pathDataKML[ i ].name );

		}

		selPath.onchange = function() {

			path = pathDataKML[ selPath.selectedIndex ];

			getElevationsFileXHR( path.elevations ); 

			

		}

	}

	function otherInits() {

		requestGPXPath( path.path );

	}

	function requestGPXPath( fileName ) {

//		var xhr, response, lines, txtline;
//		var geometry, material, line, f;
		gpxPath = [];

		latitudes = [];
		longitudes = [];

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', fileName, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			response = xhr.responseText;

			xmlParse = ( new window.DOMParser() ).parseFromString( response, "text/xml");

			text = xmlParse.getElementsByTagName( "coordinates" )[0];
			text = text.textContent;v

			trekPoints = text.split( '\n' ).map( function( line ) { return line.split( ',' ); } );

			for ( var i = 0; i < trekPoints.length - 1; i++ ) {

				lat = parseFloat( trekPoints[ i ][ 1 ] );
				lon = parseFloat( trekPoints[ i ][ 0 ] );

//				latitudes.push( lat );
//				longitudes.push( lon );

				gpxPath.push( v( lon, lat, 0 ) );

			}

			var geometry = new THREE.Geometry();
			geometry.vertices = gpxPath;
//			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI ) );
//			geometry.center();
//			geometry.applyMatrix( new THREE.Matrix4().makeScale( 1500, 1500, 1500 ) );


			raycaster = new THREE.Raycaster();
			up = v( 0, 0, 1 );

			map.mesh.updateMatrixWorld();

			for ( var i = 0; i < gpxPath.length; i++ ) {

				raycaster.set( gpxPath[ i ], up );
				collisions = raycaster.intersectObjects( [ map.mesh ] );

//if ( i < 10 ) console.log( 'coll', gpxPath[ i ], collisions );

//				geometry.vertices[ i ].z = collisions.length ? collisions[ 0 ].distance : 0 ;

				geometry.vertices[ i ].z = collisions[ 0 ].distance;

			}

			curve = new THREE.CatmullRomCurve3()
			curve.points = gpxPath;

//			camPath = new THREE.Geometry();
//			camPath.vertices = curve.getPoints( 2000 );


			material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
			line = new THREE.Line( geometry, material );

			scene.add( line );

/*
			latMax = Math.max.apply( Math, latitudes );
			latMin = Math.min.apply( Math, latitudes );

			lonMax = Math.max.apply( Math, longitudes );
			lonMin = Math.min.apply( Math, longitudes );

			deltaX = 0.5 * ( lonMax - lonMin );
			deltaZ = 0.5 * ( latMax - latMin );

			centerLat = latMin + deltaZ;
			centerLon = lonMin + deltaX;

			info.innerHTML = 'latMin ' + latMin + ' latMax ' + latMax + '<br>' +
				'lonMin ' + lonMin + ' lonMax ' + lonMax + '<br>';

//			path = latMin + ',' + lonMin + '|' + latMax + ',' + lonMin + '|' + latMax + ',' + lonMax + '|' + latMin + ',' + lonMax + '|' + latMin + ',' + lonMin;

			path = '';

			for ( var i = 0; i < gpxPath.length; i += 5 ) {

				path += '|' + latitudes[ i ].toFixed( 5 ) + ',' + longitudes[ i ].toFixed( 5 );

			}


			source = 'https://maps.googleapis.com/maps/api/staticmap?center=' + centerLat  + ',' + centerLon + '&size=512x512&scale=2&maptype=hybrid&zoom=13&path=color:0xff000066|weight:5' + path;

			var loader = new THREE.TextureLoader();
			loader.crossOrigin = 'anonymous';
			loader.load(

				source,
				function ( texture ) {

					texture.minFilter = texture.magFilter = THREE.NearestFilter;
					texture.needsUpdate = true;
					material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, side: 2 } );
					ground.material = material;
					ground.material.needsUpdate = true;

				}

			);

			cameraWorld = camera;
*/

		}

	}

