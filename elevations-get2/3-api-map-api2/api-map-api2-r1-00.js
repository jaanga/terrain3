

	var API = API || {};

	var geocoder;
	var PAR;
	var threejs;
	var TIL;

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


	API.onEventAPIKeyUpdate = function() {

		if ( API.script ) { API.script.src = ''; google = {}; }

		API.script = document.body.appendChild( document.createElement('script') );
		API.script.onload = API.initGoogleMap;

		if ( location.hash.includes( 'key=') ) {

			APIinpAPI.value = location.hash.slice( location.hash.indexOf( 'key=' ) + 4, 44 )

		}

		if ( APIinpAPI.value !== '' ) {

			API.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + APIinpAPI.value;

		} else {

			API.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places';

		}

//console.log( 'APIinpAPI.value', APIinpAPI.value );

	}



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

		API.infowindow = new google.maps.InfoWindow();
		API.createMarker( API.map.center );

		API.onInitGoogleMap();

//		if ( PAR && PAR.setMapParameters ) { PAR.setMapParameters(); }

//		if ( threejs && divThreejs.style ) { divThreejs.style.display = 'none'; }

	}

	API.onInitGoogleMap = function(){};


//

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

		menuClickDetails.innerHTML =

			'Latitude: ' + lat.toFixed( 4 ) + '&deg;' + b +
			'Longitude: ' + lon.toFixed( 4 ) + '&deg;' + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

			'<p><button onclick=API.setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';

		API.createMarker( event.latLng, 'green' );

	}


	API.setCenter = function( lat, lon, goDistance ) {

		var lat, lon, place, bounds;

		lat = lat || COR.defaults.latitude;

		lon = lon || COR.defaults.longitude;

		goDistance = goDistance || false;

		place = COR.place;

		bounds = API.map.getBounds();

		API.clearAll();

		place.latitude = lat ? parseFloat( lat ) : place.latitude;

		place.longitude = lon ? parseFloat( lon ) : place.longitude;

		API.placeLocation = { lat: place.latitude, lng: place.longitude };

		if ( bounds.contains( API.placeLocation ) === true || goDistance === true ) {

			API.map.setCenter( API.placeLocation );

			API.createMarker( API.placeLocation );

			API.onSetCenter();

//			if ( TIL.tiles ) { TIL.getTilesData(); }

		} else {

			alert( 'curent marker is outside the visible area' );

		}

	}

	API.onSetCenter = function(){};


	API.createMarker = function( placeLoc, color = 'yellow' ) {

		var place;
		place = COR.place;

		var marker = new google.maps.Marker( {

			icon: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
			title: 'lat: ' + place.latitude + ', lng: ' + place.longitude,
			map: API.map,
			position: placeLoc

		} );

		google.maps.event.addListener( marker, 'click', function() {

			address = place.address ? 'address: ' + place.addreess + b : '';
			vicinity = place.vicinity ? 'viciity: ' + place.vicinity + b : '';

			API.infowindow.setContent( 

			'<div>' +
				'<strong>' + place.name + '</strong>' + b +
                'Place ID: ' + place.place_id + b +
					address +
					vicinity + 
					'types: ' + place.types + b +
					'lat: ' + placeLoc.lat().toFixed( 3 ) + ' lon: ' + placeLoc.lng().toFixed( 3 ) +
			'</div>'

			);

			API.infowindow.open( API.map, this );

		} );

		API.markings.push( marker );

	}


	API.clearAll = function() {

		for ( var i = 0; i < API.markings.length; i++ ) {

			API.markings[ i ].setMap( null );

		}

		API.markings = [];

	};

