// Copyright &copy; 2016 Jaanga authors. MIT License

	SEL = SEL || {};

	SEL.onLoad = function() {

		return SEL.getMenuDetailsSelectFile();

	};


//	SEL.defaultFile = '../../oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';
	SEL.defaultFile; // if no default, select a random file

	SEL.urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

	SEL.searchInFolder = 'elevations-data-04/';

//	SEL.urlBase = '../../../../elevations/' + SEL.searchInFolder;
	SEL.urlBase = 'https://jaanga.github.io/terrain3/elevations/' + SEL.searchInFolder;


	SEL.getMenuDetailsSelectFile = function() {

		var menuDetailsSelectFile =

		'<details id=detailsSelectFile open >' +

			'<summary><h3>Select file to view</h3></summary>' +

			'<small>Select or open a file to view in 3D</small>' +

			'<p>' +
				'<select id=SELselFiles onchange=SEL.getJSONFileXHR(SEL.urlBase+this.value); size=12 style=width:100%; ></select>' +
			'</p>' +

			'<p><input type=file id=inpFile onchange=SEL.getJSONFileReader(this); /></p>' +

		'</details>';

		return menuDetailsSelectFile;

	}


	SEL.getGitHubAPITreeContents = function() {

		var xhr, response, files, file;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', SEL.urlAPITreeContents, true );
		xhr.onload = onLoadGitHubTreeContents;
		xhr.send( null );

		function onLoadGitHubTreeContents() {

			response = JSON.parse( xhr.response );
			SEL.extension = SEL.extension || '.json';
			files = [];

			for ( var i = 0; i < response.tree.length; i++ ) {

				file = response.tree[ i ].path;

				if ( !file.match( SEL.searchInFolder ) ) { continue; }
				if ( !file.match( SEL.extension ) ) { continue; }

				file = file.split( '\/' ).pop();

				files.push( file );

				SELselFiles[ SELselFiles.length ] = new Option( file, file );

			}

			SEL.onGitHubTreeLoad();

		}

	}


	SEL.onGitHubTreeLoad = function() {

// remember that COR.place may have been created by an iframe parent or previous window

		var file;

		if ( COR.place === undefined ) {

// add SELselFiles update

			SELselFiles.selectedIndex = Math.floor( Math.random() * SELselFiles.length );

			file = SEL.defaultFile ? SEL.defaultFile : SEL.urlBase + SELselFiles.value;

			SELselFiles.selectedIndex = SEL.defaultFile ? -1 : SELselFiles.selectedIndex;

			SEL.getJSONFileXHR( file );

		}



	}


// Gather data when using the default

	SEL.getJSONFileXHR = function( fName ) {

console.time( 'timer0' );

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', fName, true );
		xhr.onload = function callbackXHR() {

			SEL.fileJSON = JSON.parse( xhr.responseText );
			SEL.fileName = fName.split( '/' ).pop();

			location.hash = 'file=' + fName;

			SEL.onLoadJSONFile();

		};

		xhr.send( null );

	}



// gather the data using file open dialog

	SEL.getJSONFileReader = function( files ) {

console.time( 'timer0' );

		var reader;

		reader = new FileReader();
		reader.onloadend = function( event ) {

			SEL.fileJSON = JSON.parse( reader.result );
			SEL.fileName = files.files[ 0 ].name;

			SEL.onLoadJSONFile();

		};

		reader.readAsText( files.files[ 0 ] );

	}



	SEL.onLoadJSONFile = function() {

		COR.place = SEL.fileJSON;
		COR.place.name = SEL.fileName;

		COR.getPlaceDefaults();

		COR.onLoadJSONFile();

//console.log( 'file loaded', SEL.fileName );

	}


