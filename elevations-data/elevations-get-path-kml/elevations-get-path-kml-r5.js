

	var urlBase = 'https://jaanga.github.io/terrain3/';

	function openMap() {

		url = urlBase + selFiles.value;

		openKML( url );

	}


	function otherInits() {

		openMap() ;

	}


	function openKML( url ) {

		place.kmlFile = url;
		place.vicinity = place.origin = url.split( '/' ).pop().slice( 0, -4 );

		layer = new google.maps.KmlLayer({

			url: url,
			map: googleMap.map

		});

//console.log( '', googleMap.center.lat(), googleMap.center.lng() );

	}


	function getMenuDetailsSelectPathKMLExample() {

		menuDetailsSelectPathKMLExample =

			'<details open >' +
				'<summary><h3>path kml examples</h3></summary>' +

				'<small>Select or open a file to view in 3D</small>' +
				'<p>' +
					'<select id=selFiles onchange=openKML(urlBase+this.value); size=12 style=width:100%; >' +
						'<option>Select a file</option></select>' +
				'</p>' +

			'</details>' +

		b;

		return menuDetailsSelectPathKMLExample;

	}

// GitHub API

	function getGitHubAPITreeContents( callback ) {

		var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

		var searchInFolder = 'data-path-kml/';

//		var xhr, response, files, file;

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
//				if ( file.indexOf( searchInFolder ) === -1 ) { continue; }
				if ( file.slice( -4 ) !== '.kml' ) { continue; }

//				file = file.split( '/' ).pop();

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file.split( '/' ).pop(), file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );

			if ( callback ) { callback(); }

		}

	}
