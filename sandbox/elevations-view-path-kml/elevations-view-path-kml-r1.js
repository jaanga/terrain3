
	var urlBase = 'https://jaanga.github.io/terrain3/elevations/elevations-data-kml/';
//	var urlBase = '../elevations-data-03/';
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
//			elevations: '../../elevations/elevations-data-kml/snow-mouuntain-wilderness-ca-usa_13_1301_3119_3_3_510_510_.txt' 
			elevations: '../../elevations/elevations-data-kml/smw-ca-usa_12_650_1558_3_3_60_60_.txt' 
			}

	];

	function getGitHubAPITreeContents( callback ) {};

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

		requestGPXPath( map.kmlFile );

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
			text = text.textContent;

			trekPoints = text.split( '\n' ).map( function( line ) { return line.split( ',' ); } );

			for ( var i = 0; i < trekPoints.length - 1; i++ ) {

				lat = parseFloat( trekPoints[ i ][ 1 ] );
				lon = parseFloat( trekPoints[ i ][ 0 ] );

//				latitudes.push( lat );
//				longitudes.push( lon );

				gpxPath.push( v( lon, lat, 0 ) );

			}

			raycaster = new THREE.Raycaster();
			up = v( 0, 0, 1 );

			map.mesh.updateMatrixWorld();

console.time( 't1' );

			for ( var i = 0; i < gpxPath.length; i++ ) {

				raycaster.set( gpxPath[ i ], up, 0, 1 );
				collisions = raycaster.intersectObject( map.mesh );
				gpxPath[ i ].z = collisions.length ? collisions[ 0 ].distance : 0 ;

			}

console.timeEnd( 't1' );

			var geometry = new THREE.Geometry();
			geometry.vertices = gpxPath;
			material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
			line = new THREE.Line( geometry, material );

			scene.add( line );
			curve = new THREE.CatmullRomCurve3()
			curve.points = gpxPath;

//			camPath = new THREE.Geometry();
//			camPath.vertices = curve.getPoints( 2000 );

		}

	}

