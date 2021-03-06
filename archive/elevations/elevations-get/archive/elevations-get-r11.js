// 2016-08-09 ~ R9.1

// https://developers.google.com/maps/documentation/javascript/tutorial
// https://developers.google.com/maps/documentation/javascript/elevation
// https://developers.google.com/maps/documentation/elevation/start


	var urlViewElevations3D = '../elevations-view/elevations-view-3d-core-r11.html';

	var place = {};
	var path = {};

	var placeholder = 'Tenzing-Hillary Airport, Lukla, Nepal';

	place.vicinity = placeholder;

	place.latitude = 27.6878; // 27.71110193545;
	place.longitude = 86.7314; // 86.71228385040001;

	place.zoom = 12;

	place.tilesX = 3;
	place.tilesY = 3;

//	place.samplesX; // 512 appears to be the max for a single call
//	place.samplesY;

	var googleMap, googleMapCenter, geocoder, infoWindow;
	var googleElevator;

//	place.ULtileX;
//	place.ULtileY;

	var ULlat, ULlon, LRlat, LRlon;
	var LRtileX, LRtileY;

	place.elevations = [];
//	place.resolution = [];

	var startTime;
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
		setMenuDetailsMapParameters();
		setMenuDetailsMapClick();
		setMenuDetailsElevations();
//		setMenuDetailsPathData();
		setMenuDetailsAbout();

/*
		for ( var i = 0; i < 20; i++ ) {

			selZoom[ selZoom.length ] = new Option( i + 1 );

		}

		selZoom.selectedIndex = place.zoom - 1;

		for ( i = 0; i < 12; i++ ) {

			selTilesX[ selTilesX.length ] = new Option( i + 1 );

		}

		selTilesX.selectedIndex = place.tilesX - 1;


		for ( i = 0; i < 12; i++ ) {

			selTilesY[ selTilesY.length ] = new Option( i + 1 );

		}

		selTilesY.selectedIndex = place.tilesY - 1;

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

			selSamples.options[ i ] = new Option( samps[ i ][ 0 ] );
			selSamples.options[ i ].title = samps[ i ][ 1 ];
		}

		selSamples.selectedIndex = 0;
*/

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

	function setMenuDetailsElevations() {

		menuDetailsElevations.innerHTML =
			'<details open>' +
				'<summary><h3>elevations</h3></summary>' +
				'<small id=menuElevationsMessage >Request data from the Google Maps API</small>' +
				'<p>' +
					'<button onclick=setElevations(); >Get Elevations</button> &nbsp; ' +
					'<button onclick=saveFile(); >Save File</button>' +
				'</p>' +

				'<textarea id=txtElevations >Elevation data appears here as it arrives. When complete a 3D model is generated and displayed.</textarea>' +

				'<div  >' +

					'<details >' +
						'<summary><h4>open elevations file</h4></summary>' +
						'<input type=file id=inpFile onchange=openFile(this,"elevations"); >' +
						'<div id=menuOpenFileElevations >When you open an elevations file, details will appear here</div>' +
					'</details>' +

				'</div>' +

				'<div id=menuElevations >' +

					'<details >' +
						'<summary><h4>elevations details</h4></summary>' +
						'<div>When you click \'get elevations\', details will appear here</div>' +
					'</details>' +

				'</div>' +

			'</details >' +

		'';

	}

	function setMenuDetailsAbout() {

		menuDetailsAbout.innerHTML =

			'<details>' +

				'<summary><h3>about</h3></summary>' +

				'<p>' +
					'Copyright &copy; 2016 <a href=https://github.com/orgs/jaanga/people target="_blank">Jaanga authors</a>.' + b +
					'<jaanga.github.io/license.md >MIT license</a>' +
				'</p>' +

				'<p>Thank you <a href=https://developers.google.com/maps/documentation/javascript/elevation > Google Maps </a> and ' +
					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +

				'<p>Click the \'i in a circle\' info icon for more <a href=index.html#readme.md >help</a></p>' +

			'</details>' +

		'';

	}


	function initMap() {

		place.latitude = parseFloat( inpLatitude.value );
		place.longitude = parseFloat( inpLongitude.value );

		place.zoom = selZoom.selectedIndex + 1;

		place.tilesX = selTilesX.selectedIndex + 1;
		place.tilesY = selTilesY.selectedIndex + 1;

		place.samplesX = parseInt( selSamples.value, 10 ) * place.tilesX;
		place.samplesY = parseInt( selSamples.value, 10 ) * place.tilesY;

		initGeocoder();

		getTiles();

		if ( path.vertices ) {

			drawPline( path.vertices, googleMap, '#ffff00', 3 );

			drawTitleBoundary( path.latMax, path.lonMin, path.latMin, path.lonMax, '#ff00ff' );

		}

	}


	function initGeocoder() {

		var origin_autocomplete, marker;

		geocoder = new google.maps.Geocoder();
		googleElevator = new google.maps.ElevationService();

		googleMap = new google.maps.Map( mapDiv, {

			zoom: place.zoom,
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

			place.origin_autocomplete = origin_autocomplete.getPlace();

			expandViewportToFitPlace( googleMap, place.origin_autocomplete );

		} );

		googleMap.addListener( 'click', onGoogleMapClick );

		otherInits();

	}

	function otherInits() {}

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

			'</details>' +

		'';

	}

	function setMenuDetailsMapParameters() {

		menuDetailsMapParameters.innerHTML =

			'<details open>' +
				'<summary><h3>map parameters</p></summary>' +

				'<p>Zoom: <select id=selZoom onchange=initMap(); title="Select the zoom" size=1 ></select></p>' +

				'<p>Map overlay: <select id=selMap onchange=initMap() size=1 />' +
					'<option>Hybrid</option><option>Roadmap</option><option>Satellite</option><option selected >Terrain</option>' +
					'</select>' +
				'</p>' +

				'<p>Tiles width: <select id=selTilesX onchange=initMap(); type=number size=1 ></select></p>' +
				'<p>Tiles height: <select id=selTilesY onchange=initMap(); type=number size=1 ></select></p>' +

				'<p>Samples per tile: <select id=selSamples onchange=initMap(); title="Select the number of samples per tile" size=1 ></select></p>' +

			'</details>' +

		'';


		for ( var i = 0; i < 20; i++ ) {

			selZoom[ selZoom.length ] = new Option( i + 1 );

		}

		selZoom.selectedIndex = place.zoom - 1;

		for ( i = 0; i < 12; i++ ) {

			selTilesX[ selTilesX.length ] = new Option( i + 1 );

		}

		selTilesX.selectedIndex = place.tilesX - 1;


		for ( i = 0; i < 12; i++ ) {

			selTilesY[ selTilesY.length ] = new Option( i + 1 );

		}

		selTilesY.selectedIndex = place.tilesY - 1;

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

			selSamples.options[ i ] = new Option( samps[ i ][ 0 ] );
			selSamples.options[ i ].title = samps[ i ][ 1 ];
		}

		selSamples.selectedIndex = 0;

	}


	function setMenuDetailsMapClick() {

		menuDetailsMapClick.innerHTML =

			'<div >' +
				'<details open >' +
					'<summary><h4>click details</h4></summary>' +
					'<small id=menuClickMessage >When you click on the screen, details will appear here.</small>' +
					'<div id=menuClickDetails></div>' +
				'</details>' +

			'</div>' +

		'';

	}

// geocode

	function setCenter( lat, lon ) {

		menuPlaceMessage.innerHTML = '<span style=color:red; >Click in the input box & select a location from the drop-down list</span>';

		inpLatitude.value = lat || place.latitude;

		inpLongitude.value = lon || place.longitude;
console.log( '', lat, lon );
		googleMapCenter = { lat: parseFloat( lat ), lng: parseFloat( lon ) };

		googleMap.setCenter( googleMapCenter );

		place.zoom = selZoom.selectedIndex + 1;

		googleMap.setZoom( place.zoom );

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

		} );

	}

	function geocodeAddress( geocoder, resultsMap ) {

		var address;

		address = inpAddress.value;

		geocoder.geocode( { 'address': address }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				resultsMap.setCenter( results[ 0 ].geometry.location );
				resultsMap.setZoom( place.zoom );

				var marker = new google.maps.Marker( { map: resultsMap, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}


	function expandViewportToFitPlace( map, origin ) {

		if ( !origin ) {

			menuPlaceMessage.innerHTML = 'Autocomplete\'s returned place contains no geometry';

			return;

		} else {

			if ( origin.geometry.viewport ) {

				map.fitBounds( origin.geometry.viewport );

			} else {

				map.setCenter( origin.geometry.location );
				map.setZoom( 17 );

			}

			inpLatitude.value = origin.geometry.location.lat();
			inpLongitude.value = origin.geometry.location.lng();

			initMap();

			menuPlaceMessage.innerHTML +=

				b + ( origin.vicinity ? 'Vicinity:\n' + origin.vicinity : '' ) +

			'';

		}

	}


//

	function getTiles() {

		var tileX, tileY, tileOffset;
		var tileCoordinates, tilePath;
		var ULlat, ULlon, LRlat, LRlon;
		var zoom = place.zoom;
		var tilesX = place.tilesX;
		var tilesY = place.tilesY;

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
			'<summary><h4>center tile data</h4></summary>' +

			'Location latitude : ' + place.latitude.toFixed( 4 ) + '&deg;' + b +
			'Location longitude: ' + place.longitude.toFixed( 4 ) + '&deg;' + b + b +
			'Zoom: ' + zoom + b + b +

			'Tiles width : ' + tilesX + b +
			'Tiles height: ' + tilesY + b + b +

			'Samples width: ' + place.samplesX + b +
			'Samples height: ' + place.samplesY + b + b +

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

			'Meters/sample (' + selSamples.value + '/tile) lat: ' + Math.round( ( meridionalCircumference / Math.pow( 2, zoom ) ) * tilesY / place.samplesY ).toLocaleString() + b +
			'Meters/sample (' + selSamples.value + '/tile) lon: ' + Math.round( ( equatoriaCircumferenceLocal / Math.pow( 2, zoom ) ) * tilesX / place.samplesX ).toLocaleString() + b +

		'</details>';

		source = 'http://c.tile.opencyclemap.org/cycle/' + zoom + '/' + tileX + '/' + tileY + '.png';

		menuDetailsCenterTileImage.innerHTML =

		'<details>' +

			'<summary><h4>sample tile</h4></summary>' +
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
		var zoom = place.zoom;
		var tilesX = place.tilesX;
		var tilesY = place.tilesY;

		tileX = lon2tile( place.longitude, zoom );
		tileY = lat2tile( place.latitude, zoom );

		tileOffsetX = Math.floor( 0.5 * tilesX );
		tileOffsetY = Math.floor( 0.5 * tilesY );

		place.ULtileX = ( tileX - tileOffsetX );
		place.ULtileY = ( tileY - tileOffsetY );

		LRtileX = ( tileX - tileOffsetX + tilesX );
		LRtileY = ( tileY - tileOffsetY + tilesY );

		ULlat = tile2lat( tileY - tileOffsetY, zoom );
		ULlon = tile2lon( tileX - tileOffsetX, zoom );

		LRlat = tile2lat( tileY + tileOffsetY + ( tilesY % 2 ? 1 : 0 ), zoom );
		LRlon = tile2lon( tileX + tileOffsetX + ( tilesX % 2 ? 1 : 0 ), zoom );

		menuDetailsTilesData.innerHTML =

		'<details>' +

			'<summary><h4>tiles data</h4></summary>' +
			'UL TileY: ' + place.ULtileY + ' Lat: ' + ULlat.toFixed( 4 ) + '&deg;' + b +
			'LR TileY: ' + LRtileY + ' Lat: ' + LRlat.toFixed( 4 ) + '&deg;' + b +

			'UL TileX: ' + place.ULtileX + ' Lon: ' + ULlon.toFixed( 4 ) + '&deg;' + b +
			'LR TileX: ' + LRtileX + ' Lon: ' + LRlon.toFixed( 4 ) + '&deg;' + b +

		'</details>';

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
		var zoom = place.zoom;
		var tilesX = place.tilesX;
		var tilesY = place.tilesY;

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

		place.elevations = [];
		place.resolutions = [];
		count = 0;

/*
		delay = place.samplesX <= 500 ? 2000 : delay;
		delay = place.samplesX <= 250 ? 1200 : delay; // 1800
		delay = place.samplesX <= 200 ? 200 : delay;
		delay = place.samplesX <= 100 ? 100 : delay;
		delay = place.samplesX <= 66 ? 50 : delay;
		delay = place.samplesX <= 50 ? 50 : delay;
		delay = place.samplesX <= 33 ? 5 : delay;
*/

		nextElevations();

	}

	function nextElevations() {

		var latDelta, lat, color, points;

		if ( place.samplesX <= 512 ) {

			latDelta = ( ULlat - LRlat ) / ( place.samplesY - 1 );
			lat = ULlat - count * latDelta;
			color = '#0000cc';
			points = [ { lat: lat, lng: ULlon }, {lat: lat, lng: LRlon } ];
//debugger;
		} else {

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

		}

		drawPline( points, googleMap, color );

		getElevations( points, googleMap, place.elevations );

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

		var orig;

		googleElevator.getElevationAlongPath( {

			'path': path,
			'samples': place.samplesX

		}, function( results, status ) {
//debugger;
			if ( status === google.maps.ElevationStatus.OK ) {

				if ( results ) {

					tempArr = [];

					for ( var i = 0; i < place.samplesX; i++ ) {

						elevation = parseFloat( results[ i ].elevation.toFixed( 0 ) );

						elevations.push( elevation );

						tempArr.push( elevation );

						resolution = results[ i ].resolution;

						if ( resolution && !place.resolutions.includes( resolution ) ) { place.resolutions.push( resolution.toFixed( 1 ) ); }

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

			if ( count < place.samplesY - 1 ) {

				count++;

				index = place.samplesX * count;

				if ( place.samplesX < 31 ) { delay = 5;
				} else if ( place.samplesX < 61 ) { delay = 330;
				} else if ( place.samplesX < 91 ) { delay = 700;
				} else if ( place.samplesX < 121 ) { delay = 1000;
				} else if ( place.samplesX < 151 ) { delay = 1500;
				} else if ( place.samplesX < 181 ) { delay = 2000;
				} else { delay = 4000; }

/*				if ( place.samplesX < 31 ) { delay = 5;
				} else if ( place.samplesX < 61 ) { delay = 330;
				} else if ( place.samplesX < 121 ) { delay = 1000;
				} else { delay = 2000; }
*/


				setTimeout( nextElevations, delay );

			} else {

console.log( 'complete count', count, elevations.length );

//			txtElevations.innerText = 'complete count: ' + ( count + 1 ) + b;

				if ( inpAddress.value ) {

					place.origin = inpAddress.value;

				} else if ( place.origin_autocomplete && place.origin_autocomplete.vicinity ) {

					place.origin = place.origin_autocomplete.vicinity;

				} else {

					place.origin = inpAddress.placeholder;

				}

				setIframe();

			}

		} );

	}


	function setIframe() {

//		var icw;

		threejs.style.display = '';

		threejs.innerHTML =

			'<div id=threejsHeader >' +

				'<button onclick=onchange=ifrThreejs.contentWindow.controls.autoRotate=!ifrThreejs.contentWindow.controls.autoRotate; > rotation </button>' +
				'<button onclick=threejs.style.display=threejs.style.display===""?"none":""; > [X] </button>' +

			'</div>' +

			'<iframe id=ifrThreejs src=' + urlViewElevations3D + ' ></iframe>' +

		'';

		ifrThreejs.onload = function() {

			icw = ifrThreejs.contentWindow;
/*
			parameters = {

				origin: place.origin,
				ULtileX: place.ULtileX,
				ULtileY: place.ULtileY,
				zoom: place.zoom,
				tilesX: place.tilesX,
				tilesY: place.tilesY,
				segmentsX: place.samplesX,
				segmentsY: place.samplesY

			};
*/

//			icw.map.verticalScale = icw.map.verticalScaleDefault;
//			icw.map.plainOpacity = icw.map.plainOpacityDefault;

//			icw.map.elevations = place.elevations.slice( 0, place.samplesX * place.samplesY );
//			icw.map.parameters = parameters;

// http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object-in-javascript
//			icw.map = JSON.parse(JSON.stringify( place ));

			icw.map = Object.create( place );
			icw.onLoadElevations();
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
			'actual: ' + place.elevations.length.toLocaleString() + b +
			'specified: ' + ( ( count + 1 ) * place.samplesX ).toLocaleString() + b + b +

			'time: ' + ( ( Date.now() - startTime ) / 1000 ).toFixed( 1 ) + b +
			'delay: ' + delay + b +
			'results length: ' + results.length.toLocaleString() + b +
			'resolution(s): ' + resolution + b +

		'</details>' + b;

	}


//

	function onGoogleMapClick( event ) {

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

			'Tile X: ' + lon2tile( lon, place.zoom ) + b +
			'Tile Y: ' + lat2tile( lat, place.zoom ) + b + b +

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

				place.origin = parametersArray[ 1 ];
				place.zoom = parseInt( parametersArray[ 2 ], 10 );
				place.ULtileX = parseInt( parametersArray[ 3 ], 10 );
				place.ULtileY = parseInt( parametersArray[ 4 ], 10 );
				place.tilesY = parseInt( parametersArray[ 5 ], 10 );
				place.tilesY = parseInt( parametersArray[ 6 ], 10 );
				place.samplesX = parseInt( parametersArray[ 7 ], 10 );
				place.samplesY = parseInt( parametersArray[ 8 ], 10 );
				fileName = files.files[0].name;


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

			position: { lat: path.latCen, lng: path.lonCen } ,
			map: googleMap

		});

		updateLocation( path.latCen, path.lonCen );

//		image.src = source;
//		image.src = mapsAPISource + path;

	}


	function saveFile() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var blob, fileName, a;

		if ( !place.elevations || place.elevations.length === 0 ) { alert( 'There is no elevation data to save.\n\n Press \'Get Elevations\' to request some data.' ); return; }

//		elevationsString = place.elevations.join( ',' );
//		blob = new Blob( [ elevationsString ] );
//		blob = new Blob( [ elevations ] );

		origin = place.origin.toLowerCase().replace( /,/g, '').replace( / /g, '-' );


		pl = JSON.stringify( place );
		blob = new Blob( [ pl ] );

		fileName = 'elevations_' +

//			( place.vicinity ? place.vicinity : 'place' ) + '_' +
			origin + '_'  +
			place.zoom + '_' +
			place.ULtileX + '_' +
			place.ULtileY + '_' +
			place.tilesX + '_' +
			place.tilesY + '_' +
			place.samplesX + '_' + 
			place.samplesY + '_' +
			'.txt';

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
