

	var urlBase = 'https://jaanga.github.io/terrain3/data-path-kml/';
	var urlViewElevations3D = '../..//sandbox/elevations-view-path-kml/elevations-view-path-kml-r1.html';

	function openMap() {

		defaultFile = defaultFile ? defaultFile : urlBase + selFiles.value;

		fileName = location.hash ? location.hash.slice( 1 ) : defaultFile ;

		place.kmlFile = fileName;
		place.vicinity = place.origin = fileName.split( '/' ).pop().slice( 0, -4 );

		openKML( fileName );

	}

	function otherInits() {

console.log( 'lat', place );

	}

	function setMenuDetailsSelectPathKMLExample() {

		menuDetailsSelectPathKMLExample.innerHTML =

			'<details open >' +
				'<summary><h3>path kml examples</h3></summary>' +

				'<small>Select or open a file to view in 3D</small>' +
				'<p>' +
					'<select id=selFiles onchange=openKML(urlBase+this.value); size=12 style=width:100%; >' +
						'<option>Select a file</option></select>' +
				'</p>' +

			'</details>' +

		'';

	}

	function openKML( url ) {

		place.kmlFile = url;
		place.vicinity = place.origin = url.split( '/' ).pop().slice( 0, -4 );


		layer = new google.maps.KmlLayer({

			url: url,
			map: googleMap

		});


	}

// GitHub API

	function getGitHubAPITreeContents( callback ) {

		var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

		var searchInFolder = 'data-path-kml/';

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
				if ( file.indexOf( searchInFolder ) === -1 || file.slice( -4 ) !== '.kml' ) { continue; }


				file = file.split( '\/' ).pop();

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file, file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );

			callback();

		}

	}
