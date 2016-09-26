// 2016-08-31 ~ R19

// https://developers.google.com/maps/documentation/javascript/tutorial
// https://developers.google.com/maps/documentation/javascript/elevation
// https://developers.google.com/maps/documentation/elevation/start


//	not: var urlViewElevations3D = '../elevations-view/index.html';
//	var urlViewElevations3D = '../../elevations/elevations-view/elevations-view-r2.html';


	var count;
	var delay;
	var newWindow;

	function onChangeLocationHash() {

		if ( location.hash ) {

			if ( location.hash.match( 'key=' ).length > 0 ) {

				inpAPI.value = location.hash.slice( 5 ); 

				apiKey.setAttribute('open', 'open');

			}

/*

// what is best syntax? Or use query strings?


			hashes = location.hash.split( '#' );
			inpLatitude.value = place.latitude = parseFloat( hashes[ 1 ] );
			inpLongitude.value = place.longitude = parseFloat( hashes[ 2 ] );
			selZoom.selectedIndex = parseInt( hashes[ 3 ] - 1, 10 ) || 12;
			inpAddress.value = inpAddress.placeholder = hashes[ 4 ] || '';
*/
		}

		onEventAPIKeyUpdate();

	}

// see if maps on load can supplant this

	function otherInits() {} // plugins can use this



// inits

	function setMenuDetailsElevations() {

		menuDetailsElevations.innerHTML =

			'<details open>' +

				'<summary><h3>Get elevations</h3></summary>' +

				'<small id=menuElevationsMessage >from the Google Maps Elevation Service</small>' +

				'<p>' +
					'<button onclick=initElevations(); >Get elevations</button> &nbsp; ' +
					'<button onclick=saveFile(); >Save path to file</button>' +
				'</p>' +

				'<textarea id=txtElevations >Elevation data appears here as it arrives. When complete a 3D model is generated and displayed.</textarea>' +

				'<details >' +

					'<summary><h4>open elevations file</h4></summary>' +

					'<input type=file id=inpFile onchange=openFile(this,"elevations"); >' +
					'<div id=menuOpenFileElevations >When you open an elevations file, details will appear here</div>' +

				'</details>' +

				'<details id=detailsElevations >' +

					'<summary><h4>elevations details</h4></summary>' +
					'<div id=divElevationsDetails >When you click \'get elevations\', details will appear here</div>' +

				'</details>' +

			'</details >' +

		b;

	}

//

	function openFile( files, type ) {

		var fileData, reader, data;

		reader = new FileReader();
		reader.onload = function( event ) {

				data = reader.result;

				place.elevations = data.split( ',' );

				row =  place.elevations.length / place.samplesX;

				menuOpenFileElevations.innerHTML =

					'file: ' + fileName + b +
					'Samples width: ' + place.samplesX + b +
					'Rows scanned: ' + row + b +

				b;

				place.resolutions = [];
				count = row;

				nextElevations();

//console.log( 'elevations', place.elevations );


//console.log( '', files.files[0].lastModifiedDate );

		};

		reader.readAsText( files.files[0] );

	}


/*
	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var pl, blob, fileName, a;

		if ( !place.elevations || place.elevations.length === 0 ) { alert( 'There is no elevation data to save.\n\n Press \'Get Elevations\' to request some data.' ); return; }

		place.fileName = '' +

			place.origin.toLowerCase() + '_'  +
			place.zoom + '_' +
			place.ULtileX + '_' +
			place.ULtileY + '_' +
			place.tilesX + '_' +
			place.tilesY + '_' +
			place.samplesX + '_' + 
			place.samplesY + '_' +
			'.txt';

		pl = JSON.stringify( place );
		blob = new Blob( [ pl ] );


		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = fileName;
		a.click();

		delete a;

	}
*/


	function onSuccessSetIframe() {

		var icw;

		if ( !divThreejs || divThreejs === true ) {

			divThreejs = document.body.appendChild( document.createElement( 'div' ) );
			divThreejs.id = 'divThreejs';

		}

		divThreejs.style.display = '';

		divThreejs.innerHTML =

			'<div id=threejsHeader >' +

				'<button onclick=getNewTabElevationsView(); >View elevations full screen</button>' +
				'<button onclick=onchange=ifrThreejs.contentWindow.controls.autoRotate=!ifrThreejs.contentWindow.controls.autoRotate; > rotation </button>' +
				'<button onclick=divThreejs.style.display=divThreejs.style.display===""?"none":""; > [X] </button>' +

			'</div>' +

			'<iframe id=ifrThreejs src=' + urlViewElevations3D + ' ></iframe>' +

		'';

		ifrThreejs.onload = function() {

			icw = ifrThreejs.contentWindow;
			icw.COR.place = Object.create( place );
//			icw.onLoadElevations();
			icw.COR.onLoadJSONFile();
			icw.THR.controls.autoRotate = true;

		};

	}

	function getNewTabElevationsView() {

		newWindow = window.open( urlViewElevations3D );

		newWindow.addEventListener(  'load', onLoad, false);

		function onLoad() {

			if ( window.focus ) { newWindow.focus() }

			newWindow.window.COR.place = Object.create( place );
			newWindow.window.COR.onLoadJSONFile();
			newWindow.window.THR.autoRotate = true;

		};

	}
