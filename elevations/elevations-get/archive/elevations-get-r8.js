
// https://developers.google.com/maps/documentation/javascript/tutorial
// https://developers.google.com/maps/documentation/javascript/elevation
// https://developers.google.com/maps/documentation/elevation/start

	var urlViewElevations3D = '../elevations-view/elevations-view-3d-core-r7.html';

	var place = {};
	var path = {};

	var placeholder = 'Tenzing-Hillary Airport, Lukla, Eastern Region, Nepal';

	place.vicinity = placeholder;

	place.latitude = 27.6878; // 27.71110193545;
	place.longitude = 86.7314; // 86.71228385040001;

	var startTime;

	var zoom = 12;

	var tilesX = 3;
	var tilesY = 3;

	var samplesX = 10; // 512 appears to be the max for a single call
	var samplesY = 10;

	var googleMap, googleMapCenter, geocoder, infoWindow;

	var elevator;

	var ULlat, ULlon, LRlat, LRlon;
	var ULtileX, ULtileY, LRtileX, LRtileY;

	var elevations = [];
	var resolution = [];

	var count = 0;
	var delay = 50;
	var delay = 2000;

	var thisDelay = 0;
	var polyline;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180;

	var b = '<br>';


	function initMapGetMenu() {


		threejs.style.display = 'none';

		setMenuDetailsAPIKey();
		setMenuDetailsGeocoder();

		for ( var i = 0; i < 20; i++ ) {

			selZoom[ selZoom.length ] = new Option( i + 1 );

		}

		selZoom.selectedIndex = zoom - 1;

		for ( i = 0; i < 12; i++ ) {

			selTilesX[ selTilesX.length ] = new Option( i + 1 );

		}

		selTilesX.selectedIndex = tilesX - 1;


		for ( i = 0; i < 12; i++ ) {

			selTilesY[ selTilesY.length ] = new Option( i + 1 );

		}

		selTilesY.selectedIndex = tilesY - 1;

		samps = [
			[ 10, 'Takes about a second' ],
			[ 20, 'takes about ?? seconds' ],
			[ 30, 'takes about ?? seconds' ],
			[ 40, 'takes about ?? seconds' ],
			[ 50, 'takes about 75 seconds' ],
			[ 60, 'takes about ?? seconds' ],
			[ 70, 'takes about ?? seconds' ],
			[ 80, 'takes about ?? seconds' ],
			[ 90, 'takes about ?? seconds' ],
			[ 100, 'takes about ?? seconds' ],
			[ 128, 'takes about ?? seconds' ],
			[ 150, 'takes about ?? seconds' ],
			[ 170, 'takes about 2,500 seconds' ],
			[ 200, 'takes 5 to 6 minutes' ], [ 250, 'takes 8 to 9 minutes' ], [ 500, 'takes about an hour' ] ];

		for ( i = 0; i < samps.length; i++ ) {

			selSamplesX.options[ i ] = new Option( samps[ i ][ 0 ] );
			selSamplesX.options[ i ].title = samps[ i ][ 1 ];
		}

		selSamplesX.selectedIndex = 0;

		tilesX = selTilesX.selectedIndex + 1;
		tilesY = selTilesY.selectedIndex + 1;

		samplesX = parseInt( selSamplesX.value, 10 ) * tilesX;
		samplesY = parseInt( selSamplesX.value, 10 ) * tilesY;



	}

	function onHashChange() {

		if ( location.hash ) {

			if ( location.hash.match( 'key=' ).length > 0 ) {

				inpAPI.value = location.hash.slice( 5 ); 

				apiKey.setAttribute('open', 'open');

				

console.log( 'key', inpAPI.value );

			}
/*

			hashes = location.hash.split( '#' );

			inpLatitude.value = place.latitude = parseFloat( hashes[ 1 ] );
			inpLongitude.value = place.longitude = parseFloat( hashes[ 2 ] );
			selZoom.selectedIndex = parseInt( hashes[ 3 ] - 1, 10 ) || 12;
			inpAddress.value = inpAddress.placeholder = hashes[ 4 ] || '';
*/
		}

		setAPIkey();

	}

	function setMenuDetailsAPIKey() {

		menuDetailsAPIKey.innerHTML =

			'<details id=apiKey >' +
				'<summary><h3>api key</h3></summary>' +
				'<small>If small request, no need for API key</small>' +
				'<p>api key: <input id=inpAPI onclick=this.select(); title="Obtain API key from Google Maps" ></p>' +
				'<p><button onclick=setAPIkey(); >Set API key</button></p>' +
			'</details>' + b;



	}

	function setAPIkey() {

		script = document.body.appendChild( document.createElement('script') );
		script.onload = initMap;

		if ( inpAPI.value !== '' ) {

			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + inpAPI.value;

		} else {

			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places';

		}

	}

	function initMap() {



		place.latitude = parseFloat( inpLatitude.value );
		place.longitude = parseFloat( inpLongitude.value );

		zoom = selZoom.selectedIndex + 1;

		initGeocoder();



		getTiles();

		if ( path.vertices ) {

			drawPline( path.vertices, googleMap, '#ffff00', 3 );

			drawTitleBoundary( path.latMax, path.lonMin, path.latMin, path.lonMax, '#ff00ff' );

		}

	}


	function initGeocoder() {

//		var origin_autocomplete, marker;

		geocoder = new google.maps.Geocoder();
		elevator = new google.maps.ElevationService();

		googleMap = new google.maps.Map( mapDiv, {

			zoom: zoom,
			scaleControl: true,
			center: { lat: place.latitude, lng: place.longitude },
			mapTypeId: selMap.value.toLowerCase(),

			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.TOP_RIGHT
			},

			fullscreenControl: true

		});

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
			position: {lat: place.latitude, lng: place.longitude },
			title: 'lat: ' + place.latitude + ', lng: ' + place.longitude,
			snippet: 'snippet',
			map: googleMap

		});


		origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		origin_autocomplete.bindTo( 'bounds', googleMap );

		origin_autocomplete.addListener( 'place_changed', function() {

			place.origin = origin_autocomplete.getPlace();

			expandViewportToFitPlace( googleMap, place );

		} );

		googleMap.addListener( 'click', onClick );

	}

	function setMenuDetailsGeocoder() {

		menuDetailsGeocoder.innerHTML =

			'<details open>' +
				'<summary><h3>place</p></summary>' +
				'<p>Enter a location to go there:</p>' +
				'<p><input id=inpAddress class=controls placeholder="' + placeholder + '" onclick=this.select(); onchange=geocodeAddress(geocoder,googleMap); title="Thank you Google!" > ' +
				'<button onclick=geocodeAddress(geocoder,googleMap); > geocode </button></p>' +

				'<p id=menuPlaceMessage ></p>' +



//				'<p>Longitude: <input id=inpLongitude size=12 value=' + place.longitude + ' onclick=this.select(); onchange=setCenter(); ></p>' +

				'<p>Latitude : <input id=inpLatitude size=12 value=' + place.latitude + ' onclick=this.select(); onchange=updateLocation(inpLatitude.value,inpLongitude.value); ></p>' +
				'<p>Longitude: <input id=inpLongitude size=12 value=' + place.longitude + ' onclick=this.select(); onchange=updateLocation(inpLatitude.value,inpLongitude.value);  ></p>' +

				'<p>Zoom: <select id=selZoom onchange=initMap(); title="Select the zoom" size=1 ></select></p>' +

				'<p>Map overlay: <select id=selMap onchange=initMap() size=1 />' +
					'<option>Hybrid</option><option>Roadmap</option><option>Satellite</option><option selected >Terrain</option>' +
					'</select>' +
				'</p>' +

				'<p>Tiles width: <select id=selTilesX onchange=initMap(); type=number size=1 ></select></p>' +
				'<p>Tiles height: <select id=selTilesY onchange=initMap(); type=number size=1 ></select></p>' +

				'<p>Samples per tile: <select id=selSamplesX onchange=initMap(); title="Select the number of samples for X" size=1 ></select></p>' +
	//			'<p>Samples height: <select id=selSamplesY onchange=initMap(); title="Select the number of samples for Y" size=1 ></select></p>' +


			'</details>' +

		'';

	}

// geocode

	function setCenter( lat, lon ) {

		menuPlaceMessage.innerHTML = '<span style=color:red; >Click in the input box & select a location from the drop-down list</span>';

		inpLatitude.value = lat || place.latitude;

		inpLongitude.value = lon || place.longitude;

		googleMapCenter = { lat: parseFloat( lat ), lng: parseFloat( lon ) };

		googleMap.setCenter( googleMapCenter );

		zoom = selZoom.selectedIndex + 1;

		googleMap.setZoom( zoom );

		geocodeLatLng();

		initMap();

	}

	function geocodeLatLng() {

		geocoder.geocode( { 'location': googleMapCenter }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				if ( results[ 1 ] ) {

					inpAddress.value = results[ 1 ].formatted_address;

				} else {

					menuPlaceMessage.innerHTML = 'No results found';

				}

			} else {

				menuPlaceMessage.innerHTML = 'Geocoder failed due to: ' + status;

			}

		});

	}

	function geocodeAddress( geocoder, resultsMap ) {

		var address;

		address = inpAddress.value;

		geocoder.geocode( { 'address': address }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				resultsMap.setCenter( results[ 0 ].geometry.location );
				resultsMap.setZoom( zoom );

				var marker = new google.maps.Marker( { map: resultsMap, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		});

	}


	function expandViewportToFitPlace( map, plac ) {

		place = plac;

		if ( !place.origin ) {

			menuPlaceMessage.innerHTML = 'Autocomplete\'s returned place contains no geometry';

			return;

		} else {

			if ( place.origin.geometry.viewport ) {

				map.fitBounds( place.origin.geometry.viewport );

			} else {

				map.setCenter( place.origin.geometry.location );
				map.setZoom( 17 );

			}

			inpLatitude.value = place.origin.geometry.location.lat();
			inpLongitude.value = place.origin.geometry.location.lng();

			initMap();

			menuPlaceMessage.innerHTML =

				( place.origin.vicinity ? 'Vicinity:\n' + place.origin.vicinity : '' ) +

			'';

		}

	}


//

	function getTiles() {

		var tileX, tileY, tileOffset;
		var tileCoordinates, tilePath;
		var ULlat, ULlon, LRlat, LRlon;

		tileX = lon2tile( place.longitude, zoom );
		tileY = lat2tile( place.latitude, zoom );

		tileOffset = Math.floor( 0.5 * tilesX );

		ULlat = tile2lat( tileY - tileOffset, zoom );
		ULlon = tile2lon( tileX - tileOffset, zoom );

		LRlat = tile2lat( tileY + tileOffset + ( tilesY % 2 ? 1 : 0 ), zoom );
		LRlon = tile2lon( tileX + tileOffset + ( tilesX % 2 ? 1 : 0 ), zoom );

		cenLat = LRlat + 0.5 * ( ULlat - LRlat );
		cenLon = ULlon + 0.5 * ( LRlon - ULlon );


// https://en.wikipedia.org/wiki/Earth_radius#Polar_radius

		equatoriaCircumferenceLocal = pi2 * 6378137 * Math.cos( place.latitude * d2r );
		meridionalCircumference = pi2 * 6356752.3;

		mDegLat = meridionalCircumference / 360;
		mDegLon = equatoriaCircumferenceLocal  / 360;

		mTileLat = meridionalCircumference / Math.pow( 2, zoom );
		mTileLon = equatoriaCircumferenceLocal / Math.pow( 2, zoom );

		menuDetailsCenterTileData.innerHTML =

		'<details>' +
			'<summary><h3>center tile data</h3></summary>' +

			'Location latitude : ' + place.latitude.toFixed( 4 ) + '&deg;' + b +
			'Location longitude: ' + place.longitude.toFixed( 4 ) + '&deg;' + b + b +
			'Zoom: ' + zoom + b + b +

			'Tiles width : ' + tilesX + b +
			'Tiles height: ' + tilesY + b + b +

			'Samples width: ' + samplesX + b +
			'Samples height: ' + samplesY + b + b +

			'Tile X: ' + tileX + b +
			'Tile Y: ' + tileY + b + b +

			'UL lat: ' + ULlat.toFixed( 4 ) + '&deg;' + b +
			'LR lat: ' + LRlat.toFixed( 4 ) + '&deg;' + b +
			'UL lon: ' + ULlon.toFixed( 4 ) + '&deg;' + b +
			'LR lon: ' + LRlon.toFixed( 4 ) + '&deg;' + b + b +

			'&Del;lat: ' + ( ULlat - LRlat ).toFixed( 3 ) + '&deg;' + b +
			'&Del;lon: ' + ( ULlon - LRlon ).toFixed( 3 ) + '&deg;' + b + b +

			'Center latitude: ' + cenLat.toFixed( 4 ) + '&deg;' + b +
			'Center longitude: ' + cenLon.toFixed( 4 ) + '&deg;' + b + b +

			'Meters/degree latitude : ' + Math.round( mDegLat ).toLocaleString() + b +
			'Meters/degree longitude: ' + Math.round( mDegLon ).toLocaleString() + b + b +

			'Meters/tile latitude : ' + Math.round( mTileLat ).toLocaleString() + b +
			'Meters/tile longitude: ' + Math.round( mTileLon ).toLocaleString() + b + b +

			'Meters/' + tilesX + ' tiles latitude : ' + Math.round( mTileLat * tilesX ).toLocaleString() + b +
			'Meters/' + tilesY + ' tiles longitude: ' + Math.round( mTileLon * tilesY ).toLocaleString() + b + b +

			'Meters/sample (' + selSamplesX.value + '/tile) lat: ' + Math.round( ( meridionalCircumference / Math.pow( 2, zoom ) ) * tilesY / samplesY ).toLocaleString() + b +
			'Meters/sample (' + selSamplesX.value + '/tile) lon: ' + Math.round( ( equatoriaCircumferenceLocal / Math.pow( 2, zoom ) ) * tilesX / samplesX ).toLocaleString() + b +

		'</details>' + b;

		source = 'http://c.tile.opencyclemap.org/cycle/' + zoom + '/' + tileX + '/' + tileY + '.png';

		menuDetailsCenterTileImage.innerHTML =

		'<details>' +

			'<summary><h3>sample tile</h3></summary>' +
			'<img src=' + source + ' >' + b +
			'<a href=' + source + ' >' + source.slice( 7 ) + '</a>' +

		'</details>' + b;

		getMenuDetailsTilesData();

		drawTitleBoundary( ULlat, ULlon, LRlat, LRlon, '#0000ff' );

		drawTilesonMap();


		marker = new google.maps.Marker({

			position: {lat: cenLat, lng: cenLon } ,
			map: googleMap

		});

	}

	function getMenuDetailsTilesData() {

		var tileX, tileY, tileOffset;
		var tileCoordinates, tilePath;


		tileX = lon2tile( place.longitude, zoom );
		tileY = lat2tile( place.latitude, zoom );

		tileOffsetX = Math.floor( 0.5 * tilesX );
		tileOffsetY = Math.floor( 0.5 * tilesY );

		ULtileX = ( tileX - tileOffsetX );
		ULtileY = ( tileY - tileOffsetY );

		LRtileX = ( tileX - tileOffsetX + tilesX );
		LRtileY = ( tileY - tileOffsetY + tilesY );

		ULlat = tile2lat( tileY - tileOffsetY, zoom );
		ULlon = tile2lon( tileX - tileOffsetX, zoom );

		LRlat = tile2lat( tileY + tileOffsetY + ( tilesY % 2 ? 1 : 0 ), zoom );
		LRlon = tile2lon( tileX + tileOffsetX + ( tilesX % 2 ? 1 : 0 ), zoom );

		menuDetailsTilesData.innerHTML =

		'<details>' +

			'<summary><h3>tiles data</h3></summary>' +
			'UL TileY: ' + ULtileY + ' Lat: ' + ULlat.toFixed( 4 ) + '&deg;' + b +
			'LR TileY: ' + LRtileY + ' Lat: ' + LRlat.toFixed( 4 ) + '&deg;' + b +

			'UL TileX: ' + ULtileX + ' Lon: ' + ULlon.toFixed( 4 ) + '&deg;' + b +
			'LR TileX: ' + LRtileX + ' Lon: ' + LRlon.toFixed( 4 ) + '&deg;' + b +

		'</details>' + b;

		var marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
			title: 'lat: ' + ULlat.toFixed( 4 ) + ', lng: ' + ULlon.toFixed( 4 ),
			position: {lat: parseFloat( ULlat.toFixed( 4 ) ), lng: parseFloat( ULlon.toFixed( 4 ) )  },
			map: googleMap

		});

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
			title: 'lat: ' + LRlat.toFixed( 4 ) + ', lng: ' + LRlon.toFixed( 4 ),
			position: {lat: parseFloat( LRlat.toFixed( 4 ) ), lng: parseFloat( LRlon.toFixed( 4 ) )  },
			map: googleMap

		});


//		drawTitleBoundary( ULlat, ULlon, LRlat, LRlon, '#00ff00' );

	}

	function drawTilesonMap() {

		var tileX, tileY, tileOffset;
		var ULlat, ULlon, LRlat, LRlon;
		var tileCoordinates, tilePath;

		tileX = lon2tile( place.longitude, zoom );
		tileY = lat2tile( place.latitude, zoom );

		tileOffsetX = - Math.floor( 0.5 * tilesX );
		tileOffsetY = - Math.floor( 0.5 * tilesY );


		for ( var x = 0; x < tilesX; x++ ) {

			for ( var y = 0; y < tilesY; y++ ) {

				ULlat = tile2lat( tileY + y + tileOffsetY, zoom );
				ULlon = tile2lon( tileX + x + tileOffsetX, zoom );

				LRlat = tile2lat( tileY + y + tileOffsetY + 1, zoom );
				LRlon = tile2lon( tileX + x + tileOffsetX + 1, zoom );

				drawTitleBoundary( ULlat, ULlon, LRlat, LRlon, '#ff0000' );

//if ( x === 0 && y === 0 ) { console.log( 'UL', ULlat.toFixed( 4 ), ULlon.toFixed( 4 ) ); }

			}

		}

//console.log( 'LR',  ULlat.toFixed( 4 ), ULlon.toFixed( 4 ) );

	}

	function drawTitleBoundary( ULlat, ULlon, LRlat, LRlon, color ) {

		var tileCoordinates, tilePath;

		tileCoordinates = [
			{ lat: ULlat, lng: ULlon },
			{ lat: ULlat, lng: LRlon },
			{ lat: LRlat, lng: LRlon },
			{ lat: LRlat, lng: ULlon },
			{ lat: ULlat, lng: ULlon }
		];

		tilePath = new google.maps.Polyline( {

			path: tileCoordinates,
//			fillOpacity: 0.075,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 2
		} );

		tilePath.setMap( googleMap );

	}

	function setElevations() {

		startTime = Date.now();

		elevations = [];
		resolutions = [];
		count = 0;

/*
		delay = samplesX <= 500 ? 2000 : delay;
		delay = samplesX <= 250 ? 1200 : delay; // 1800
		delay = samplesX <= 200 ? 200 : delay;
		delay = samplesX <= 100 ? 100 : delay;
		delay = samplesX <= 66 ? 50 : delay;
		delay = samplesX <= 50 ? 50 : delay;
		delay = samplesX <= 33 ? 5 : delay;
*/

		nextElevations();

	}

	function nextElevations() {

		var latDelta, lat, color, points;

		if ( samplesX <= 512 ) {

			latDelta = ( ULlat - LRlat ) / ( samplesY - 1 );
			lat = ULlat - count * latDelta;
			color = '#0000cc';
			points = [ { lat: lat, lng: ULlon }, {lat: lat, lng: LRlon } ];
//debugger;
		} else {

			latDelta = ( ULlat - LRlat ) / ( 2 * samplesY - 1 );
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

		}

		drawPline( points, googleMap, color );

		getElevations( points, googleMap, elevations );

	}

	function drawPline( pline, map, color, width ) {

		new google.maps.Polyline({

			path: pline,
			strokeColor: color,
			opacity: 0.1,
			strokeWeight: width || 1,
			map: map

		});

	}

	function getElevations( path, map, elevations ) {

		elevator.getElevationAlongPath( {

			'path': path,
			'samples': samplesX

		}, function( results, status ) {
//debugger;
			if ( status === google.maps.ElevationStatus.OK ) {

				if ( results ) {

					tempArr = [];

					for ( var i = 0; i < samplesX; i++ ) {

						elevation = parseFloat( results[ i ].elevation.toFixed( 0 ) );

						elevations.push( elevation );

						tempArr.push( elevation );

						resolution = results[ i ].resolution.toFixed( 1 );

						if ( !resolution.includes( resolution ) ) { resolutions.push( resolution ); }

					}

					txtElevations.value = tempArr;

					setMenuElevations( results );


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

			if ( count < samplesY - 1 ) {

				count++;

				index = samplesX * count;

				if ( samplesX < 31 ) { delay = 5;
				} else if ( samplesX < 61 ) { delay = 330;
				} else if ( samplesX < 91 ) { delay = 700;
				} else if ( samplesX < 121 ) { delay = 1000;
				} else if ( samplesX < 151 ) { delay = 1500;
				} else if ( samplesX < 181 ) { delay = 2000;
				} else { delay = 4000; }

/*				if ( samplesX < 31 ) { delay = 5;
				} else if ( samplesX < 61 ) { delay = 330;
				} else if ( samplesX < 121 ) { delay = 1000;
				} else { delay = 2000; }
*/


				setTimeout( nextElevations, delay );

			} else {

console.log( 'complete count', count, elevations.length );

//			txtElevations.innerText = 'complete count: ' + ( count + 1 ) + b;

				if ( inpAddress.value ) {

					origin = inpAddress.value;

				} else if ( place.origin && place.origin.vicinity ) {

					origin = place.origin.vicinity;

				} else {

					origin = inpAddress.placeholder;

				}

				setIframe();

			}

		} );

	}


	function setIframe() {

		threejs.style.display = '';

		threejs.innerHTML =

			'<div id=threejsHeader >' +

				'<button onclick=onchange=ifrThreejs.contentWindow.controls.autoRotate=!ifrThreejs.contentWindow.controls.autoRotate; > rotation </button>' +
				'<button onclick=threejs.style.display=threejs.style.display===""?"none":""; > [X] </button>' +

			'</div>' +

			'<iframe id=ifrThreejs src=' + urlViewElevations3D + ' ></iframe>' +

		'';

		ifrThreejs.onload = function() {

			var icw = ifrThreejs.contentWindow;

			parameters = {

				origin: origin,
				ULtileX: ULtileX,
				ULtileY: ULtileY,
				zoom: zoom,
				tilesX: tilesX,
				tilesY: tilesY,
				segmentsX: samplesX,
				segmentsY: samplesY

			};

			icw.map.verticalScale = icw.map.verticalScaleDefault;
			icw.map.plainOpacity = icw.map.plainOpacityDefault;

			icw.map.elevations = elevations.slice( 0, samplesX * samplesY );
			icw.map.parameters = parameters;

			icw.initElevations();
			icw.controls.autoRotate = true;

		};

	}

	function setMenuElevations( results ) {

//console.log( 'res', results );

		menuElevations.innerHTML =

		'<details open>' +
			'<summary><h4>elevations details</h4></summary>' +
			'rows: ' + ( count + 1 ) + b + b +

			'elevations count' + b +
			'actual: ' + elevations.length.toLocaleString() + b +
			'specified: ' + ( ( count + 1 ) * samplesX ).toLocaleString() + b + b +

			'time: ' + ( ( Date.now() - startTime ) / 1000 ).toFixed( 1 ) + b +
			'delay: ' + delay + b +
			'results length: ' + results.length.toLocaleString() + b +
			'resolution(s): ' + resolution + b +
		'</details>' + b;

	}


//

	function onClick( event ) {

		menuClickMessage.innerHTML = 'ccccccccccccccccc';

		var latLng, lat, lon;

		latLng = event.latLng;

		lat = latLng.lat();
		lon = latLng.lng();

		updateLocation( lat, lon );

	}

	function updateLocation( lat, lon ) {

		lat = parseFloat( lat );

		lon = parseFloat( lon );

		menuClickDetails.innerHTML =

			'Latitude: ' + lat.toFixed( 4 ) + '&deg;' + b +
			'Longitude: ' + lon.toFixed( 4 ) + '&deg;' + b + b +

			'Tile X: ' + lon2tile( lon, zoom ) + b +
			'Tile Y: ' + lat2tile( lat, zoom ) + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

//			'<p><button onclick=inpLatitude.value=' + lat + ';inpLongitude.value=' + lon + ';initMap(); >Set click location as map center</button></p>' +
			'<p><button onclick=setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';

		menuClickMessage.innerHTML = '';

		var marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
			title: 'lat: ' + lat + ', lng: ' + lon,
			position: {lat: lat, lng: lon } ,
			map: googleMap

		});

	}

	function openFile( files, type ) {

		var fileData, reader, data;

		reader = new FileReader();
		reader.onload = function( event ) {

			if ( type === 'path' ) {


				polyline = {

					data: reader.result,
					name: files.files[0].name,
					size: files.files[0].size,
					type: files.files[0].type || 'not specified',
					modified: files.files[0].lastModifiedDate

				};

				txtPath.innerHTML = polyline.data;

				menuOpenFile.innerHTML =
					'<p>' +
					'name: ' + polyline.name + '<br>' +
					'size: ' + polyline.size.toLocaleString() + ' bytes<br>' +
					'type: ' + polyline.type + '<br>' +
					'modified: ' + polyline.modified.toLocaleDateString() +
					'</p>' +
					'<p>' +
						'<button onclick=goThere(); >Go There</button> ' +
						'<button onclick=parseDataGetMap(polyline.data); >Draw Path</button>' +
					'</p>' +
				'';

				parseDataGetMap( polyline.data );

			} else if ( type === 'elevations' ) {


//				var parametersArray, delta;

				parametersArray = files.files[0].name.split( '_' );

				origin = parametersArray[ 1 ];
				zoom = parseInt( parametersArray[ 2 ], 10 );
				ULtileX = parseInt( parametersArray[ 3 ], 10 );
				ULtileY = parseInt( parametersArray[ 4 ], 10 );
				tilesX = parseInt( parametersArray[ 5 ], 10 );
				tilesY = parseInt( parametersArray[ 6 ], 10 );
				samplesX = parseInt( parametersArray[ 7 ], 10 );
				samplesY = parseInt( parametersArray[ 8 ], 10 );
				fileName = files.files[0].name;


				data = reader.result;

				elevations = data.split( ',' );

				row =  elevations.length / samplesX;

				menuOpenFileElevations.innerHTML =

					'file: ' + fileName + b +
					'Samples width: ' + samplesX + b +
					'Rows scanned: ' + row + b +

				b;


				resolutions = [];
				count = row;

				nextElevations();

//console.log( 'elevations', elevations );

			}


//console.log( '', files.files[0].lastModifiedDate );

		};

		reader.readAsText( files.files[0] );

	}

	function goThere() {

		inpLatitude.value = path.latCen;
		inpLongitude.value = path.lonCen;

		setCenter( path.latCen, path.lonCen );

	}

	function parseDataGetMap( data ) {

		var lines, txtline;
		var latitudes, longitudes;

		var latMin, latMax, lonMin, lonMax;

		latitudes = [];
		longitudes = [];

		lines = data.split(/\r\n|\n/);

		for ( var i = 1; i < lines.length; i++ ) {

			txtline = lines[ i ].split( ',' );

			latitudes.push( parseFloat( txtline[ 1 ] ) );

			longitudes.push( parseFloat( txtline[ 0 ] ) );

		}

		path.latMin = arrayMin( latitudes );
		path.latMax = arrayMax( latitudes );

		path.lonMin = arrayMin( longitudes );
		path.lonMax = arrayMax( longitudes );

		path.latCen = path.latMin + 0.5 * ( path.latMax - path.latMin );
		path.lonCen = path.lonMin + 0.5 * ( path.lonMax - path.lonMin );

		menuPathBoundaries.innerHTML =

			'<details open>' +
				'<summary><h4>path boundaries</h4></summary>' +
				'<p>' +
					'latMin: ' + path.latMin.toFixed( 4 ) + '&deg;' + b +
					'latMax: ' + path.latMax.toFixed( 4 ) + '&deg;' + b + b +

					'lonMin: ' + path.lonMin.toFixed( 4 ) + '&deg;' + b +
					'lonMax: ' + path.lonMax.toFixed( 4 ) + '&deg;' + b + b +

					'latCen: ' + path.latCen.toFixed( 4 ) + '&deg;' + b +
					'lonCen: ' + path.lonCen.toFixed( 4 ) + '&deg;' + b +

				'</p>' +

		'</details>';

		path.vertices = [];

		delta = Math.floor( latitudes.length / 100 );

		for ( i = 0; i < latitudes.length; i += delta ) {

			path.vertices.push( { lat: latitudes[ i ], lng: longitudes[ i ] } );

		}

		drawPline( path.vertices, googleMap, '#ffff00', 3 );

		drawTitleBoundary( path.latMax, path.lonMin, path.latMin, path.lonMax, '#ff00ff' );

		marker = new google.maps.Marker({

			position: {lat: path.latCen, lng: path.lonCen } ,
			map: googleMap

		});

		updateLocation( path.latCen, path.lonCen );

//		image.src = source;
//		image.src = mapsAPISource + path;

	}


	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var blob, fileName, a;

		if ( !elevations.length ) { alert( 'There is no elevation data to save.\n\n Press \'Get Elevations\' to request some data.' ); return; }

		elevationsString = elevations.join( ',' );

//		blob = new Blob( [ elevationsString ] );
		blob = new Blob( [ elevations ] );

		fileName = 'elevations_' +
//			( place.vicinity ? place.vicinity : 'place' ) + '_' +

			( origin ? origin : 'xxx' ) + '_'  +
			zoom + '_' +
			ULtileX + '_' +
			ULtileY + '_' +
			tilesX + '_' +
			tilesY + '_' +
			samplesX + '_' + samplesY + '_.txt';

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = fileName;
		a.click();

		delete a;

	}


// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values

	function arrayMin( arr ) {

		var len = arr.length, min = Infinity;

		while ( len-- ) {

			if ( arr[ len ] < min) { min = arr[ len ]; }

		}

		return min;

	}

	function arrayMax( arr ) {

		var len = arr.length, max = -Infinity;

		while ( len-- ) {

			if (arr[len] > max) { max = arr[len]; }

		}

		return max;

	}

// Source http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29

	function lon2tile( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}

	function lat2tile( lat, zoom ) {

		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}

	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {

		var n = pi - 2 * pi * y / Math.pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));

	}
