// Copyright &copy; 2016 Jaanga authors. MIT License

	var KML = {};


/*

	KML.folders = [
		'elevations-airports-01',
		'elevations-data-04',
		'elevations-data-family+friends',
		'elevations-data-oakland-gran-fondo',
		'elevations-data-path-json',
		'elevations-data-tgif',
		'test'
	];

	KML.defaultFolder = 1;

// more visible in HTML
 
// add user and branch
	KML.urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

//	KML.defaultFile = '../../elevations/elevations-data-04/san-francisco_10_163_394_3_3_450_450_.json';
	KML.defaultFile; // if no default, KMLect a random file

	KML.searchInFolder = 'elevations-data-04/';
	KML.searchInFolder = KML.folders[ KML.defaultFolder ];
	KML.extension = '.json';

//	KML.urlBase = '../../elevations-data/';
	KML.urlBase = 'https://jaanga.github.io/terrain3/elevations-data/';

*/


// Menus

//			KML.getMenuDetailsSelectFile() +

//		KMLdetailsSelectFile.setAttribute('open', 'open');

	KML.getMenuDetailsSelectFile = function() {

		var menuDetailsSelectKMLFile =

			'<details id=KMLdetailsSelectFile >' +

				'<summary id=KMLmenuSummary ><h3>Select a path file to view</h3></summary>' +

				'<small id=KMLmenuSummaryTagline >Select a file to view in 3D</small>' +

				'<p id=KMLpFolder >' +
					'<select id=KMLselFolder onchange=KML.searchInFolder=this.value;KML.getFiles(); ></select>' +
				'</p>' +

				'<p>' +

//					'<select id=KMLselFiles onchange=KML.getJSONFileXHR(KML.urlBase+KML.searchInFolder+"/"+this.value); size=12 style=width:100% ></select>' +
					'<select id=KMLselFiles onchange=KML.openKML(KML.urlBase+KML.searchInFolder+"/"+this.value); size=12 style=width:100% ></select>' +

				'</p>' +

//				'<p><input type=file id=KMLinpFile onchange=KML.getJSONFileReader(this); /></p>' + b +

			'</details>' +

		'';

		return menuDetailsSelectKMLFile;

	}



//

	KML.getFolders = function() { // used below


		for ( var i = 0; i < KML.folders.length; i++ ) {

			KMLselFolder[ i ] = new Option( KML.folders[ i ] );

		}

		KMLselFolder.selectedIndex = KML.defaultFolder;

	}


	KML.getGitHubAPITreeContents = function() {

		var xhr, response, files, file;

		KML.getFolders();

		COR.requestFile( KML.urlAPITreeContents, callback );

		function callback( xhr ) {

			KML.response = JSON.parse( xhr.target.response );
			KML.extension = KML.extension || '.json';
			KML.getFiles();

		}

	}



	KML.getFiles = function() {

		KML.files = [];
		KMLselFiles.innerHTML = ''

		for ( var i = 0; i < KML.response.tree.length; i++ ) {

			file = KML.response.tree[ i ].path;

			if ( !file.includes( KML.searchInFolder ) ) { continue; }
			if ( !file.includes( KML.extension ) ) { continue; }

			file = file.split( '\/' ).pop();

			KML.files.push( file );

			KMLselFiles[ KMLselFiles.length ] = new Option( file, file );

		}

		KML.onGitHubTreeLoad();

	}


	KML.onGitHubTreeLoad = function() {

// remember that COR.place may have been created by an iframe parent or previous window

		var file;

		if ( COR.place === undefined ) {

			KMLselFiles.selectedIndex = Math.floor( Math.random() * KMLselFiles.length );

			file = KML.defaultFile ? KML.defaultFile : KML.urlBase + KML.searchInFolder + '/' + KMLselFiles.value;

			KMLselFiles.selectedIndex = KML.defaultFile ? -1 : KMLselFiles.selectedIndex;

			KML.getJSONFileXHR( file );

		}  else {

			KMLselFiles.selectedIndex = -1;

		}

	}


// Gather data when using the default

	KML.getJSONFileXHR = function( url ) {

console.time( 'timer0' );

		COR.requestFile( url, callback );

		function callback( xhr ) {

			COR.place = JSON.parse( xhr.target.responseText );

			KML.fileName = url.split( '/' ).pop();

			location.hash = 'file=' + url;

			KML.onLoadJSONFile( xhr );

		};

	}



// gather the data using file open dialog

	KML.getJSONFileReader = function( files ) {

console.time( 'timer0' );

		var reader;
		reader = new FileReader();

		reader.onload = function( event ) {

			COR.place = JSON.parse( reader.result );

			COR.fileName = files.files[ 0 ].name;

			location.hash = '';

			KML.onLoadJSONFile( event );

		};

		reader.readAsText( files.files[ 0 ] );

	}


	KML.onLoadJSONFile = function(){};





// Called by Elevation Get KML

// https://developers.google.com/maps/documentation/javascript/examples/layer-kml

	KML.openKML = function( url ) {

//		var kmlLayer;
		var place = COR.place;

		place.kmlFile = url;
		place.vicinity = place.origin = url.split( '/' ).pop().slice( 0, - KML.extension.length );

console.log( '', place.origin );

		kmlLayer = new google.maps.KmlLayer( {

			url: url,
			map: API.map

		} );


		API.listener = API.map.addListener( 'center_changed', function(  ) {

console.log( '', API.map.center.lat(), API.map.center.lng() );

			google.maps.event.removeListener( API.listener );

			API.setCenter( API.map.center.lat(), API.map.center.lng(), true );

//			API.setClickMenuDetails( API.map.center.lat(), API.map.center.lng() );

        } );

	};


/*

// more visible and editable when it's in the HTML file

	KML.onLoadJSONFile = function() {

		COR.getPlaceDefaults();

console.log( 'file loaded', KML.fileName );

	}

*/


