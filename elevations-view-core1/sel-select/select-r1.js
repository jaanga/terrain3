// Copyright &copy; 2016 Jaanga authors. MIT License



	COR.getMenuPlugins = function() {

		return SEL.getMenuDetailsSelectFile();

	};


	var SEL = {};

	SEL.defaultFile; // if no default, select a random file
	SEL.urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';
	SEL.searchInFolder = 'elevations-data-04/';
//	SEL.urlBase = 'https://jaanga.github.io/terrain3/elevations/' + SEL.searchInFolder;
	SEL.urlBase = '../../elevations/' + SEL.searchInFolder;


	SEL.getMenuDetailsSelectFile = function() {

		var menuDetailsSelectFile =

		'<details id=detailsSelectFile open >' +

			'<summary><h3>Select file to view</h3></summary>' +

			'<small>Select or open a file to view in 3D</small>' +

			'<p>' +
				'<select id=selFiles onchange=file=SEL.urlBase+this.value;SEL.getJSONFileXHR(file); size=12 style=width:100%; ></select>' +
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
			files = [];

			for ( var i = 0; i < response.tree.length; i++ ) {

				file = response.tree[ i ].path;

				if ( file.indexOf( 'archive' ) !== -1 ) { continue; }
				if ( file.indexOf( SEL.searchInFolder ) === -1 || file.slice( -5 ) !== '.json' ) { continue; }

				file = file.split( '\/' ).pop();

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file, file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );

			SEL.onGitHubTreeLoad();

		}

	}


	SEL.onGitHubTreeLoad = function() {

// place may be created by iframe parent

		if ( COR.map === undefined ) {

// add location.hash
// add selFiles update

			file = SEL.defaultFile ? SEL.defaultFile : SEL.urlBase + selFiles.value;

			selFiles.selectedIndex = SEL.defaultFile ? -1 : selFiles.selectedIndex;

			SEL.getJSONFileXHR( file );

		}

	}



// Gather data when using the default

	SEL.getJSONFileXHR = function( fName ) {

console.time( 'timer0' );

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', fName, true );
		xhr.onload = function callback() {

			SEL.fileJSON = JSON.parse( xhr.responseText );
			SEL.fileName = fName.split( '/' ).pop();

//			COR.place = JSON.parse( xhr.responseText );
//			COR.place.fileName = fName.split( '/' ).pop();

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

//			COR.place = JSON.parse( reader.result );
//			COR.place.fileName = files.files[ 0 ].name;

			SEL.fileJSON = JSON.parse( xhr.responseText );
			SEL.fileName = fName.split( '/' ).pop();

			SEL.onLoadJSONFile();

		};

		reader.readAsText( files.files[ 0 ] );

	}


	SEL.onLoadJSONFile = function() {

console.log( 'file loaded', SEL.fileName );

/*

		var place = COR.place;

		THR.scene = new THREE.Scene();

		axisHelper = new THREE.AxisHelper( 90 );
		THR.scene.add( axisHelper );

		COR.getPlaceDefaults();

console.log( 'loaded', place );

		inpVertical.value = place.verticalScale;
		inpVertical.max = 3 * place.verticalScale;
		outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

		selMapZoom.selectedIndex = place.deltaOverlay;

		map.min = COR.arrayMin( place.elevations );
		map.max = COR.arrayMax( place.elevations );

		ULlat = tile2lat( place.ULtileY, place.zoom );
		ULlon = tile2lon( place.ULtileX, place.zoom );

		LRlat = tile2lat( place.ULtileY + place.tilesY, place.zoom );
		LRlon = tile2lon( place.ULtileX + place.tilesX, place.zoom );

		deltaLat = ULlat - LRlat;
		deltaLon = LRlon - ULlon;

		map.deltaLonTile = deltaLon / place.tilesX;
		map.deltaLatTile = deltaLat / place.tilesY;

		map.cenLat = LRlat + 0.5 * ( ULlat - LRlat );
		map.cenLon = ULlon + 0.5 * ( LRlon - ULlon );

		menuDetailsTerrainParameters.innerHTML = TER.setMenuDetailsTerrain();

		initMapGeometry();

*/

	}


