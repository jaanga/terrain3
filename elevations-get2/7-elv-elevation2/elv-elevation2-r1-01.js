
	var ELV = ELV || {};

//	not: var urlViewElevations3D = '../elevations-view/index.html';

//	ELV.urlViewElevations3D = '../elevations/elevations-view/index.html';
//	ELV.urlViewElevations3D = '../elevations/elevations-view/elevations-view-r6.html';
	ELV.urlViewElevations3D = '../elevations-core3/elevations-core3-r1.html';



//		TIL.getMenuDetailsElevations() +

//		ELVelevationsDetails.setAttribute('open', 'open');


	ELV.getMenuDetailsElevations = function() {

		var menuDetailsElevations =

			'<details id=ELVelevationsDetails >' +

				'<summary><h3>Get elevations</h3></summary>' +

				'<small id=menuElevationsMessage >from the Google Maps Elevation Service</small>' +

				'<p>' +
					'<button onclick=ELV.initElevations(); >Get elevations</button> &nbsp; ' +
					'<button onclick=ELV.saveFile(); >Save path to file</button>' +
				'</p>' +

				'<textarea id=txtElevations >Elevation data appears here as it arrives. When complete a 3D model is generated and displayed.</textarea>' +

				'<details >' +

					'<summary><h4>open elevations file</h4></summary>' +

					'<input type=file id=ELVinpFile onchange=ELV.openFile(this,"elevations"); >' +
					'<div id=menuOpenFileElevations >When you open an elevations file, details will appear here</div>' +

				'</details>' +

				'<details id=detailsElevations >' +

					'<summary><h4>elevations details</h4></summary>' +
					'<div id=divElevationsDetails >When you click \'get elevations\', details will appear here</div>' +

				'</details>' + b +

			'</details >' +

		'';

		return menuDetailsElevations;

	};


//

	ELV.initElevations = function() {

		var place;
		place = COR.place;

		ELV.startTime = Date.now();

		API.elevator = new google.maps.ElevationService();

		place.elevations = [];
		place.resolutions = [];
		ELV.count = 0;

		PAR.onEventMapParameters();

		if ( place.samplesX < 31 ) { delay = 5;

		} else if ( place.samplesX < 61 ) { delay = 330;
		} else if ( place.samplesX < 91 ) { delay = 700;
		} else if ( place.samplesX < 121 ) { delay = 1000;
		} else if ( place.samplesX < 151 ) { delay = 1500;
		} else if ( place.samplesX < 181 ) { delay = 2000;
		} else if ( place.samplesX < 301 ) { delay = 2500;
		} else if ( place.samplesX < 512 ) { delay = 2000;
		} else { delay = 4000; }

		ELV.nextLineElevations();

	};



	ELV.nextLineElevations = function() {

		var p, t, pline;
		var latDelta, lat, color, points;

		p = COR.place;
		t = TIL.tiles;

		if ( p.samplesX <= 512 ) {

			latDelta = ( t.ULlat - t.LRlat ) / ( p.samplesY - 1 );
			lat = t.ULlat - ELV.count * latDelta;
			color = '#0000cc';
			points = [ { lat: lat, lng: t.ULlon }, {lat: lat, lng: t.LRlon } ];

/*
		} else {



			latDelta = ( ULlat - LRlat ) / ( 2 * p.samplesY - 1 );
			lat = ULlat - Math.floor( 0.5 * ELV.count ) * latDelta;

			if ( ELV.count % 2 === 0 ) {

				lonStepMin = ULlon;
				lonStepMax = 0.5 * ( LRlon - ULlon ) + ULlon;
				color = '#0000cc';

			} else {

				lonStepMin = 0.5 * ( LRlon - ULlon ) + ULlon;
				lonStepMax = LRlon;
				color = '#00cc00';

			}

			points = [ { lat: lat, lng: lonStepMin }, {lat: lat, lng: lonStepMax } ];
*/

		}

		pline = ELV.drawPline( points, API.map, color );

		API.markings.push( pline );

		ELV.getElevations( points, p.elevations );

	};



	ELV.getElevations = function( path, elevations ) {

		var place = COR.place;
		var tempArr, elevation, resolution;

		API.elevator.getElevationAlongPath( {

			'path': path,
			'samples': place.samplesX

		}, function( results, status ) {

			if ( status === google.maps.ElevationStatus.OK ) {

				if ( results ) {

					tempArr = [];

					for ( var i = 0; i < place.samplesX; i++ ) {

						elevation = parseFloat( results[ i ].elevation.toFixed( 0 ) );

						elevations.push( elevation );

						tempArr.push( elevation );

						resolution = results[ i ].resolution;

						if ( resolution && !place.resolutions.includes( resolution.toFixed() ) ) {

							place.resolutions.push( resolution.toFixed() );

						}

					}

					txtElevations.value = tempArr;

					ELV.onEventMenuElevationsDetails( results );


				} else {

					txtElevations.innerText = 'No results found';

				}

			} else {

				txtElevations.innerText = 'Elevation service failed due to: ' + status;

console.log( 'count', ELV.count, 'index', index, 'status', status, 'delay', delay );

				if ( status === 'OVER_QUERY_LIMIT' ) {

					--ELV.count;

					delay += 500;

				}

			}

			if ( ELV.count < place.samplesY - 1 ) {

				ELV.count++;

				index = place.samplesX * ELV.count;

				setTimeout( ELV.nextLineElevations, delay );

			} else {

console.log( 'complete count', ELV.count, elevations.length );

//			txtElevations.innerText = 'complete count: ' + ( ELV.count + 1 ) + b;

				ELV.onSuccessSetIframe();

			}

		} );

	};




// drawing on map

	ELV.drawPline = function( pline, gMap, color, width ) {

		var polyline;

		polyline  = new google.maps.Polyline({

			path: pline,
			strokeColor: color,
			opacity: 0.1,
			strokeWeight: width || 1,
			map: gMap

		});

		return polyline;

	};


// events

	ELV.onEventMenuElevationsDetails = function( results ) {

		var place = COR.place;

		divElevationsDetails.innerHTML =

			'rows: ' + ( ELV.count + 1 ) + b + b +

			'elevations count' + b +
			'actual: ' + place.elevations.length.toLocaleString() + b +
			'specified: ' + ( ( ELV.count + 1 ) * place.samplesX ).toLocaleString() + b + b +

			'time: ' + ( ( Date.now() - ELV.startTime ) / 1000 ).toFixed( 1 ) + b +
			'delay: ' + delay + b +
			'results length: ' + results.length.toLocaleString() + b +
			'resolution(s): ' + place.resolutions + b +

		b;

		detailsElevations.setAttribute( 'open', 'open' );

	};


	ELV.onSuccessSetIframe = function() {

		var place = COR.place;
		var icw;

		if ( !ELV.divThreejs ) {

			ELV.divThreejs = document.body.appendChild( document.createElement( 'div' ) );
			ELV.divThreejs.id = 'divThreejs';

		}

		ELV.divThreejs.style.display = '';
		ELV.divThreejs.style.zIndex = 5;

		ELV.divThreejs.innerHTML =

			'<div id=threejsHeader >' +

				'<button onclick=ELV.getNewTabElevationsView(); >View elevations full screen</button>' +
				'<button onclick=onchange=ifrThreejs.contentWindow.THR.controls.autoRotate=!ifrThreejs.contentWindow.THR.controls.autoRotate; > rotation </button>' +
//				'<button onclick=ELV.divThreejs.style.display=ELV.divThreejs.style.display===""?"none":""; > [X] </button>' +
				'<button onclick=ELV.divThreejs.innerText="",ELV.divThreejs.style.display="none"; > [X] </button>' +
			'</div>' +

			'<iframe id=ifrThreejs src=' + ELV.urlViewElevations3D + ' ></iframe>' +

		'';

		ifrThreejs.onload = function() {

			icw = ifrThreejs.contentWindow;
			icw.COR.place = Object.create( place );
//			icw.onLoadElevations();
			icw.COR.onLoadJSONFile();
			icw.THR.controls.autoRotate = true;

		};

	};



	ELV.getNewTabElevationsView = function() {

		var place = COR.place;
		var newWindow = window.open( ELV.urlViewElevations3D );

		newWindow.addEventListener(  'load', onLoad, false);

		function onLoad() {

			if ( window.focus ) { newWindow.focus(); }

			newWindow.window.COR.place = place; // Object.create( place );
			newWindow.window.COR.onLoadJSONFile();
			newWindow.window.THR.autoRotate = true;

		}

	};


	ELV.saveFile = function() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var place = COR.place;
		var pl, blob, a;

		place.fileName = '' +

			place.origin.toLowerCase() + '_'  +
			place.zoom + '_' +
			place.ULtileX + '_' +
			place.ULtileY + '_' +
			place.tilesX + '_' +
			place.tilesY + '_' +
			place.samplesX + '_' +
			place.samplesY + '_' +
			'.json';

		pl = JSON.stringify( place );
		pl = pl.replace ( /,\"/g, ',\n"' );
		blob = new Blob( [ pl ] );

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = place.fileName;
		a.click();

//		delete a;
		a = null;

	};



	ELV.openFile = function( files, type ) {

		var fileData, reader, data;

		reader = new FileReader();
		reader.onload = function( event ) {

				COR.place = JSON.parse( reader.result );

				if ( COR.place.latitude ) {

					CLK.setCenter(  COR.place.latitude, COR.place.longitude );

				}

				row =  COR.place.elevations.length / COR.place.samplesX;

				menuOpenFileElevations.innerHTML =

					'file: ' + files.files[0].name + b +
					'Samples width: ' + COR.place.samplesX + b +
					'Rows scanned: ' + row + b +

				b;

//				place.resolutions = [];
//				count = row;
//				nextElevations();
//console.log( 'elevations', place.elevations );
//console.log( '', files.files[0].lastModifiedDate );

		};

		reader.readAsText( files.files[0] );

	};
