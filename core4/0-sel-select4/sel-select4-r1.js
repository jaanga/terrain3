// Copyright &copy; 2016 Jaanga authors. MIT License

	var SEL = {};




	SEL.folders = [
		'elevations-airports-01',
		'elevations-data-04',
		'elevations-data-family+friends',
		'elevations-data-oakland-gran-fondo',
		'elevations-data-path-json',
		'elevations-data-tgif',
		'test'
	];

	SEL.defaultFolder = 1;




// more visible in HTML
 
// add user and branch
	SEL.urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

//	SEL.defaultFile = '../../elevations/elevations-data-04/san-francisco_10_163_394_3_3_450_450_.json';
	SEL.defaultFile; // if no default, select a random file

	SEL.searchInFolder = 'elevations-data-04/';
	SEL.searchInFolder = SEL.folders[ SEL.defaultFolder ];
	SEL.extension = '.json';

//	SEL.urlBase = '../../elevations-data/';
	SEL.urlBase = 'https://jaanga.github.io/terrain3/elevations-data/';




// Menus


//			SEL.getMenuDetailsSelectFile() +

//		SELdetailsSelectFile.setAttribute('open', 'open');

	SEL.getMenuDetailsSelectFile = function() {

		var menuDetailsSelectFile =

			'<details id=SELdetailsSelectFile >' +

				'<summary id=SELmenuSummary ><h3>Select file to view</h3></summary>' +

				'<small id=SELmenuSummaryTagline >Select or open a file to view in 3D</small>' +

				'<p id=SELpFolder >' +
					'<select id=SELselFolder onchange=SEL.searchInFolder=this.value;SEL.getFiles(); ></select>' +
				'</p>' +

				'<p>' +
					'<select id=SELselFiles onchange=SEL.getJSONFileXHR(SEL.urlBase+SEL.searchInFolder+"/"+this.value); size=12 style=width:100% ></select>' +
				'</p>' +

				'<p><input type=file id=SELinpFile onchange=SEL.getJSONFileReader(this); /></p>' + b +

			'</details>' +

		'';

		return menuDetailsSelectFile;

	}


//

	SEL.getFolders = function() { // used below

		for ( var i = 0; i < SEL.folders.length; i++ ) {

			SELselFolder[ i ] = new Option( SEL.folders[ i ] );

		}

		SELselFolder.selectedIndex = SEL.defaultFolder;

	}


	SEL.getGitHubAPITreeContents = function() {

		var xhr, response, files, file;

		SEL.getFolders();

		COR.requestFile( SEL.urlAPITreeContents, callback );

		function callback( xhr ) {

			SEL.response = JSON.parse( xhr.target.response );
			SEL.extension = SEL.extension || '.json';
			SEL.getFiles();

		}

	}


	SEL.getFiles = function() {

		SEL.files = [];
		SELselFiles.innerHTML = ''

		for ( var i = 0; i < SEL.response.tree.length; i++ ) {

			file = SEL.response.tree[ i ].path;

			if ( !file.includes( SEL.searchInFolder ) ) { continue; }
			if ( !file.includes( SEL.extension ) ) { continue; }

			file = file.split( '\/' ).pop();
			title = file.slice( 0, file.indexOf( '_' ) ).replace( /-/g, ' ' );

			SEL.files.push( file );

			SELselFiles[ SELselFiles.length ] = new Option( title, file );

		}

		SEL.onGitHubTreeLoad();

	}


	SEL.onGitHubTreeLoad = function() {

// remember that COR.place may have been created by an iframe parent or previous window

		var file;

		if ( COR.place === undefined ) {

			SELselFiles.selectedIndex = Math.floor( Math.random() * SELselFiles.length );

			file = SEL.defaultFile ? SEL.defaultFile : SEL.urlBase + SEL.searchInFolder + '/' + SELselFiles.value;

			SELselFiles.selectedIndex = SEL.defaultFile ? -1 : SELselFiles.selectedIndex;

			SEL.getJSONFileXHR( file );

		}  else {

			SELselFiles.selectedIndex = -1;

		}

	}


// Gather data when using the default

	SEL.getJSONFileXHR = function( url ) {

console.time( 'timer0' );

		COR.requestFile( url, callback );

		function callback( xhr ) {

			COR.place = JSON.parse( xhr.target.responseText );

			SEL.fileName = url.split( '/' ).pop();

			location.hash = 'file=' + url;

			SEL.onLoadJSONFile( xhr );

		};

	}

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent


// gather the data using file open dialog

	SEL.getJSONFileReader = function( files ) {

console.time( 'timer0' );

//		var reader;
		reader = new FileReader();

		reader.onload = function( event ) {

			COR.place = JSON.parse( reader.result );

			SEL.fileName = files.files[ 0 ].name;

//			location.hash = '';

			history.replaceState('', document.title, window.location.pathname);

			SEL.onLoadJSONFile( event );

		};

		reader.readAsText( files.files[ 0 ] );

	}


SEL.onLoadJSONFile = function(){};


/*

// more visible and editable when it's in the HTML file

	SEL.onLoadJSONFile = function() {

		COR.getPlaceDefaults();

console.log( 'file loaded', SEL.fileName );

	}

*/


