

	var API = API || {};


// menus

//			API.getMenuDetailsAPIKey() +



	API.getMenuDetailsAPIKey = function() {

		var menuDetailsAPIKey =

			'<details id=APIapiKey >' +

				'<summary><h3>Set api key</h3></summary>' +

				'<small>If small request, no need for API key</small>' +

				'<p>api key: <input id=APIinpAPI onclick=this.select(); title="Obtain API key from Google Maps" ></p>' +
				'<p><button onclick=API.onEventAPIKeyUpdate(); >Set API key</button></p>' + b +

			'</details>' + 

		'';

		return menuDetailsAPIKey;

	}


	API.getMenuDetailsMapClick = function() {

		var menuDetailsMapClick =

			'<details id=APIclickDetails>' +

				'<summary><h3>Click details</h3></summary>' +

				'<div id=menuClickDetails >' +


			'Latitude: ' + COR.defaults.latitude.toFixed( 4 ) + '&deg;' + b +
			'Longitude: ' + COR.defaults.longitude.toFixed( 4 ) + '&deg;' + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

			'<p><button onclick=API.setCenter(); >Set location as map center</button></p>' +

			'</div>' + b +

			'</details>' +

		'';

		return menuDetailsMapClick;

	}



	API.setClickMenuDetails = function( lat, lon ) {

		menuClickDetails.innerHTML =

			'Latitude: ' + lat.toFixed( 4 ) + '&deg;' + b +
			'Longitude: ' + lon.toFixed( 4 ) + '&deg;' + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

			'<p><button onclick=API.setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';

	}


// inits

	API.initGoogleMap = function() {

		var place, marker;

		place = COR.place;
		place.zoom = place.zoom || 12;

		mapDiv = document.body.appendChild( document.createElement( 'div' ) );
		mapDiv.id = 'mapDiv';

		API.map = new google.maps.Map( mapDiv, {

			zoom: place.zoom,
			scaleControl: true,
			center: { lat: place.latitude, lng: place.longitude },
			mapTypeId: place.mapTypeId,

			mapTypeControlOptions: {

				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.TOP_RIGHT

			},

			fullscreenControl: true

		});

		API.map.addListener( 'click', API.onClickGoogleMap );
		API.markings = [];

		API.infoWindow = new google.maps.InfoWindow();
		API.createMarker( API.map.center );

		API.onInitGoogleMap();

	}

	API.onInitGoogleMap = function(){};


// events

	API.onEventAPIKeyUpdate = function() {  // event or init?

		if ( API.script ) { API.script.src = ''; google = {}; }

		API.script = document.body.appendChild( document.createElement('script') );
		API.script.onload = API.initGoogleMap;

		if ( location.hash.includes( 'key=' ) ) {

			APIinpAPI.value = location.hash.slice( location.hash.indexOf( 'key=' ) + 4, 44 )

		}

		if ( APIinpAPI && APIinpAPI.value !== '' ) {

			API.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + APIinpAPI.value;

		} else {

			API.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places';

		}

//console.log( 'APIinpAPI.value', APIinpAPI.value );

	}


	API.onClickGoogleMap = function( event ) {

		var place = COR.place;
		var latLng, lat, lon, marker;

		if ( event ) {

			latLng = event.latLng;

			lat = latLng.lat() || place.latitude;
			lon = latLng.lng() || place.longitude;

		} else {

			lat = place.latitude;
			lon = place.longitude;

		}

/*
		menuClickDetails.innerHTML =

			'Latitude: ' + lat.toFixed( 4 ) + '&deg;' + b +
			'Longitude: ' + lon.toFixed( 4 ) + '&deg;' + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

			'<p><button onclick=API.setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';
*/

		API.setClickMenuDetails( lat, lon );

		API.createMarker( event.latLng, 'green' );

	}




	API.setCenter = function( lat, lon, goDistance ) {

		var lat, lon, place, bounds;

		API.clearAll();

		place = COR.place;

		bounds = API.map.getBounds();

		var goDistance = goDistance || false;

		lat = lat || COR.defaults.latitude;

		lon = lon || COR.defaults.longitude;

		place.latitude = lat ? parseFloat( lat ) : place.latitude;

		place.longitude = lon ? parseFloat( lon ) : place.longitude;

		API.placeLocation = { lat: place.latitude, lng: place.longitude };


		if ( bounds.contains( API.placeLocation ) === true || goDistance === true ) {

			API.map.setCenter( API.placeLocation );

			API.createMarker( API.map.center );

			API.onSetCenter();

			API.setClickMenuDetails( API.map.center.lat(), API.map.center.lng() );

		} else {

			alert( 'curent marker is outside the visible area' );

		}

	}

	API.onSetCenter = function(){};


	API.createMarker = function( placeLoc, color = 'yellow', label ) {

		var place;

		if ( placeLoc.center ) {

			place = COR.place;
			position = placeLoc.center;
			lat = placeLoc.center.lat();
			lon = placeLoc.center.lng();

		} else if ( placeLoc.geometry ) {

//console.log( 'placeLoc - geometry', placeLoc );

			place = placeLoc;
			position = placeLoc.geometry.location;
 			lat = placeLoc.geometry.location.lat();
			lon = placeLoc.geometry.location.lng();

		} else if ( placeLoc.lat ) {

//console.log( 'placeLoc', placeLoc );

			place = placeLoc;
			position = placeLoc;
			lat = place.lat();
			lon = place.lng();

		}

		var marker = new google.maps.Marker( {

			icon: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
			label: label || '',
			title: 'lat: ' + lat + ', lng: ' + lon,
			map: API.map,
			position: position

		} );

		google.maps.event.addListener( marker, 'click', function() {

			address = place.address ? 'address: ' + place.addreess + b : '';
			vicinity = place.vicinity ? 'viciity: ' + place.vicinity + b : '';

			API.infoWindow.setContent( 

			'<div>' +
				'<strong>' + place.name + '</strong>' + b +
					'Place ID: ' + place.place_id + b +
					address +
					vicinity + 
					'types: ' + place.types + b +
//					'lat: ' + lat.toFixed( 3 ) + ' lon: ' + lon.toFixed( 3 ) +

			'</div>'

			);

			API.infoWindow.open( API.map, this );

		} );

		API.markings.push( marker );

	}


	API.clearAll = function() {

		for ( var i = 0; i < API.markings.length; i++ ) {

			API.markings[ i ].setMap( null );

		}

		API.markings = [];


//		NEAbutMore.disabled = false;

	};

