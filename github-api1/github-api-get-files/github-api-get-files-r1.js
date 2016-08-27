
	var urlAPITreeContents;
	var searchInFolder;
	var extension = '.kml';

	function getMenuDetailsSelectFile() {

		menuDetailsSelectFile =

		'<details open >' +

			'<summary><h3>Select file to view</h3></summary>' +

			'<small>Select or open a file to view in 3D</small>' + b +

			'<div>' +
				'<select id=selFiles onchange=getFile(this); size=12 style=width:100%; ></select>' +
			'</div>' + b +

			'<div><input type=file id=inpFile onchange=getElevationsFileReader(this); /></div>' + b +

/*
			'<details>' +

				'<summary><h4> file name parameters </h4></summary>' +

				'<div id=menuDetailsFileNameParameters ></div>' +

			'</details>' + b +
*/

		'</details>';


		return menuDetailsSelectFile;

	}


	function getFile( file ) {

console.log( 'file', file.value );

	}


	function getGitHubAPITreeContents( callback ) {

		var urlAPITreeContents = urlAPITreeContents || 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';
		var searchInFolder = searchInFolder || '';
		var extension = extension || '.kml';

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

				if ( file.includes( 'archive' ) ) { continue; }
				if ( !file.includes( searchInFolder ) ) { continue; }
				if ( !file.includes( extension ) ) { continue; }

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file.split( '\/' ).pop(), file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );


			if ( callback ) { callback(); }


		}

	}