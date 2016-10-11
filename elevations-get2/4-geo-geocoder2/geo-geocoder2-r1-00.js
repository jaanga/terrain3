
	var GEO = GEO || {};

//	var GEO.geocoder = {} ;


//		GEO.getMenuDetailsGeocoder() +

// 		GEOlocationDetails.setAttribute('open', 'open');

	GEO.getMenuDetailsGeocoder = function() {

		menuDetailsGeocoder =

			'<details id=GEOlocationDetails >' +

				'<summary><h3>Set location</p></summary>' +

				'<p>Enter a location:</p>' +

				'<p>' +
					'<input id=inpAddress class=controls placeholder="' + COR.defaults.origin + '" onclick=this.select(); ' +
					'onchange=GEO.addressGeocoder(GEO.geocoder,API.map); title="Thank you Google!" > ' +
				'<button onclick=GEO.addressGeocoder(GEO.geocoder,API.map); > geocode </button></p>' +

				'<p>Latitude : <input id=GEOinpLatitude size=12 value=' + COR.defaults.latitude + ' onclick=this.select(); onchange=GEO.onChangeLatLonGeocoder(); ></p>' +
				'<p>Longitude: <input id=GEOinpLongitude size=12 value=' + COR.defaults.longitude + ' onclick=this.select(); onchange=GEO.onChangeLatLonGeocoder();  ></p>' +

				'<p id=menuPlaceMessage ></p>' + b +

			'</details>' +

		'';

		return menuDetailsGeocoder;

	}



	GEO.initGoogleGeocoder = function() {

console.log( '', 23 );

		menuDetailsGeocoder.innerHTML = GEO.getMenuDetailsGeocoder();

		GEO.geocoder = new google.maps.Geocoder();

		API.origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		API.origin_autocomplete.bindTo( 'bounds', API.map );

		API.origin_autocomplete.addListener( 'place_changed', GEO.onPlaceChangedGeocoder );

		API.map.addListener( 'idle', GEO.onIdleGeocoder );

	}


	GEO.onChangeLatLonGeocoder = function() {

			var lat, lon;

			lat = parseFloat( GEOinpLatitude.value );
			lon = parseFloat( GEOinpLongitude.value );

			API.map.setCenter(  {lat: lat, lng: lon } );
			API.map.setZoom( COR.place.zoom );

			GEO.geocodeLatLonGeocoder();

	}


	GEO.onPlaceChangedGeocoder = function() {

		API.place = API.origin_autocomplete.getPlace();

//console.log( 'API.place', API.place );

		COR.place.origin = API.place.name;

		inpAddress.value = COR.place.origin;

//		menuPlaceMessage.innerHTML = 'Name:' + place.origin + b;

		GEO.addressGeocoder( GEO.geocoder, API.map );

	}

	GEO.onIdleGeocoder = function() {

// console.log( 'onIdle' );

		lat = API.map.getCenter().lat();
		lon = API.map.getCenter().lng();

		GEOinpLatitude.value = lat;
		GEOinpLongitude.value = lon;

	}


	GEO.geocodeLatLonGeocoder = function() {

		GEO.geocoder.geocode( { 'location': API.map.center }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				if ( results[ 1 ] ) {

//r = results

//console.log( 'name', results[ 1 ], r[1].address_components[0].short_name);

					COR.place.origin = results[ 1 ].address_components[0].short_name;

					inpAddress.value = COR.place.origin;

//					menuPlaceMessage.innerHTML = 'Name:' + b + COR.place.origin + b;

				} else {

					menuPlaceMessage.innerHTML = 'No results found';

				}

			} else {

				menuPlaceMessage.innerHTML = 'Geocoder failed due to: ' + status;

			}

		} );

	}


	GEO.addressGeocoder = function() {

		GEO.geocoder.geocode( { 'address': inpAddress.value }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				API.map.setCenter( results[ 0 ].geometry.location );
				API.map.setZoom( COR.place.zoom );

				var marker = new google.maps.Marker( { map: API.map, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}
