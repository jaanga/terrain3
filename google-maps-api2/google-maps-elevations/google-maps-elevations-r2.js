


//	not: var urlViewElevations3D = '../elevations-view/index.html';
	var urlViewElevations3D = '../../elevations/elevations-view/elevations-view-r3.html';


	function getMenuDetailsElevations() {

		var menuDetailsElevations =

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

		return menuDetailsElevations;

	}


//

	function initElevations() {

/*
//		if ( googleMap.click.position !== googleMap.center.position ) {

console.log( 'googleMap.click.position',  googleMap.click.position) ;
console.log( 'googleMap.center.position', googleMap.center.position );


			response = confirm ( 

//				'Clicked position and center of map are in different places.\n\n' +
				'Click OK to move map center to clicked position.'

			);

			if ( response === true ) {

				lat = googleMap.click.position.lat();
				lon = googleMap.click.position.lng();
				setCenter( lat, lon );

			}

//		}
*/

		startTime = Date.now();

		googleMap.elevator = new google.maps.ElevationService();

		place.elevations = [];
		place.resolutions = [];
		count = 0;

		onEventMapParameters();

// update to select

		if ( place.samplesX < 31 ) { delay = 5;

		} else if ( place.samplesX < 61 ) { delay = 330;
		} else if ( place.samplesX < 91 ) { delay = 700;
		} else if ( place.samplesX < 121 ) { delay = 1000;
		} else if ( place.samplesX < 151 ) { delay = 1500;
		} else if ( place.samplesX < 181 ) { delay = 2000;
		} else { delay = 4000; }

		nextLineElevations();

	}



	function nextLineElevations() {

//		var p, t;
		p = place;
		t = tiles;

		var latDelta, lat, color, points;

		if ( place.samplesX <= 512 ) {

			latDelta = ( t.ULlat - t.LRlat ) / ( p.samplesY - 1 );
			lat = t.ULlat - count * latDelta;
			color = '#0000cc';
			points = [ { lat: lat, lng: t.ULlon }, {lat: lat, lng: t.LRlon } ];

//debugger;

		} else {

/*
			latDelta = ( ULlat - LRlat ) / ( 2 * place.samplesY - 1 );
			lat = ULlat - Math.floor( 0.5 * count ) * latDelta;

			if ( count % 2 === 0 ) {

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

		pline = drawPline( points, googleMap.map, color );

		googleMap.markings.push( pline );

		getElevations( points, place.elevations );

	}

	function getElevations( path, elevations ) {

		var tempArr, elevation, resolution;

		googleMap.elevator.getElevationAlongPath( {

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

					onEventMenuElevationsDetails( results );


				} else {

					txtElevations.innerText = 'No results found';

				}

			} else {

				txtElevations.innerText = 'Elevation service failed due to: ' + status;

console.log( 'count', count, 'index', index, 'status', status, 'delay', delay );

				if ( status === 'OVER_QUERY_LIMIT' ) {

					--count;

				}

			}

			if ( count < place.samplesY - 1 ) {

				count++;

				index = place.samplesX * count;

				setTimeout( nextLineElevations, delay );

			} else {

console.log( 'complete count', count, elevations.length );

//			txtElevations.innerText = 'complete count: ' + ( count + 1 ) + b;

				if ( divThreejs ) { onSuccessSetIframe(); }

			}

		} );

	}

//

// events

	function onEventMenuElevationsDetails( results ) {

		divElevationsDetails.innerHTML =

			'rows: ' + ( count + 1 ) + b + b +

			'elevations count' + b +
			'actual: ' + place.elevations.length.toLocaleString() + b +
			'specified: ' + ( ( count + 1 ) * place.samplesX ).toLocaleString() + b + b +

			'time: ' + ( ( Date.now() - startTime ) / 1000 ).toFixed( 1 ) + b +
			'delay: ' + delay + b +
			'results length: ' + results.length.toLocaleString() + b +
			'resolution(s): ' + place.resolutions + b +

		b;

		detailsElevations.setAttribute( 'open', 'open' );

	}


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
			icw.place = Object.create( place );
			icw.onLoadElevations();
			icw.controls.autoRotate = true;

		};

	}

	function getNewTabElevationsView() {

		newWindow = window.open( urlViewElevations3D );

		newWindow.addEventListener(  'load', onLoad, false);

		function onLoad() {

			if ( window.focus ) { newWindow.focus() }

			newWindow.window.place = Object.create( place );
			newWindow.window.onLoadElevations();
			newWindow.window.autoRotate = true;

		};

	}
