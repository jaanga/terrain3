


	var urlBase = 'https://jaanga.github.io/terrain3/elevations/elevations-data-kml/';

	var urlBase = '../elevations-data-kml/';


// prevent it from running

	function getGitHubAPITreeContents( callback ) {};


	function menuDetailsSelectKMLDataExample() {

		menuPlugins.innerHTML += 

		'<details open >' +
			'<summary><h3>Select KML file to view</h3></summary>' +
			'<small>Select or open a file to view in 3D</small>' +
			'<p>' +
				'<select id=selFiles size=5 style=width:100%; >' +
			'</p>' +

			'<p><input type=file id=inpFile onchange=getElevationsFileReader(this); /></p>' +

			'<details>' +

				'<summary><h4>file name parameters</h4></summary>' +

				'<div id=menuDetailsFileNameParameters ></div>' +

				'<div id=info ></div>' +

			'</details>' + b +

		'</details>';

/*
		for ( var i = 0; i < pathDataKML.length; i++ ) {

			selPath[ selPath.length ] = new Option( pathDataKML[ i ].name );

		}
*/
		selFiles.onchange = function() {

//			path = pathDataKML[ selFiles.selectedIndex - 1];

			getElevationsFileXHR( urlBase + selFiles.value ); 


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

	function getGitHubAPITreeContentsKML( callback ) {

		var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

		var searchInFolder = 'elevations/elevations-data-kml/';

		var xhr, response, files, file;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', urlAPITreeContents, true );
		xhr.onload = onLoadGitHubTreeContents;
		xhr.send( null );

		function onLoadGitHubTreeContents() {

			response = JSON.parse( xhr.response );
			files = [];

			for ( var i = 0; i < response.tree.length; i++ ) {

				file = response.tree[ i ].path;

				if ( file.indexOf( 'archive' ) !== -1 ) { continue; }
				if ( file.indexOf( searchInFolder ) === -1 || file.slice( -4 ) !== '.txt' ) { continue; }

				file = file.split( '\/' ).pop();

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file, file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );

//			callback();

		}

	}