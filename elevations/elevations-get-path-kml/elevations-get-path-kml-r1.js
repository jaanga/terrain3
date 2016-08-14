
	var kmlLeig = 'https://jaanga.github.io/terrain3/google-api/data-kml/LEIG-L1500-01.kml';
	var kmlVhsk = 'https://jaanga.github.io/terrain3/google-api/data-kml/VHSK-22-01.kml';

	var kmlSnowMountainActual = 'https://jaanga.github.io/terrain3/google-api/data-kml/Snow_Mountain_Actual.kml';
	var kmlSnowMountainWilderness = 'https://jaanga.github.io/terrain3/google-api/data-kml/Snow_Mountain_Wilderness.kml';

		var urlBase = 'https://jaanga.github.io/terrain3/data-path-kml/';


	function otherInits() {

		fileName = location.hash ? location.hash.slice( 1 ) : defaultFile ;

		openKML( fileName );

	}


	function setMenuDetailsPathKMLExamples() {

		menuDetailsPathKMLExamples.innerHTML =

			'<details open >' +
				'<summary><h3>path kml examples</h3></summary>' +

//				'<p><a href=# onclick=openKML(kmlSnowMountainActual); >Snow Mountain Actual KML</a></p>' +
//				'<p><a href=# onclick=openKML(kmlSnowMountainWilderness); >Sbow Mountain Wilderness KML</a></p>' +

				'<small>Select or open a file to view in 3D</small>' +
				'<p>' +
					'<select id=selFiles onchange=openKML(urlBase+this.value); size=12 style=width:100%; >' +
						'<option>Select a file</option></select>' +
				'</p>' +


			'</details>' +

		'';

	}

	function openKML( url ) {

console.log( '', url );
		layer = new google.maps.KmlLayer({

			url: url,
			map: googleMap

		});

	}

// GitHub API

	function getGitHubAPITreeContents( callback ) {

		var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';


		var searchInFolder = 'data-path-kml/';

	//	var xhr, response, files, file;

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

//			callback();

		}

	}
