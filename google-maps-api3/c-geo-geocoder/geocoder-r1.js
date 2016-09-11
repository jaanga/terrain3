
	var GEO = GEO || {};

	var geocoder = {} ;


	GEO.getMenuDetailsGeocoder = function() {

		menuDetailsGeocoder =

			'<details open >' +

				'<summary><h3>Set location</p></summary>' +

				'<p>Enter a location:</p>' +

				'<p>' +
					'<input id=inpAddress class=controls placeholder="' + COR.defaults.origin + '" onclick=this.select(); ' +
					'onchange=GEO.addressGeocoder(geocoder,googleMap.map); title="Thank you Google!" > ' +
				'<button onclick=GEO.addressGeocoder(geocoder,googleMap.map); > geocode </button></p>' +

				'<p>Latitude : <input id=GEOinpLatitude size=12 value=' + COR.defaults.latitude + ' onclick=this.select(); onchange=GEO.onChangeLatLonGeocoder(); ></p>' +
				'<p>Longitude: <input id=GEOinpLongitude size=12 value=' + COR.defaults.longitude + ' onclick=this.select(); onchange=GEO.onChangeLatLonGeocoder();  ></p>' +

				'<p id=menuPlaceMessage ></p>' +

			'</details>' +

		b;

		return menuDetailsGeocoder;

	}



	GEO.initGoogleGeocoder = function() {

		menuDetailsGeocoder.innerHTML = GEO.getMenuDetailsGeocoder();

		geocoder = new google.maps.Geocoder();

		googleMap.origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		googleMap.origin_autocomplete.bindTo( 'bounds', googleMap.map );

		googleMap.origin_autocomplete.addListener( 'place_changed', GEO.onPlaceChangedGeocoder );

		googleMap.map.addListener( 'idle', GEO.onIdleGeocoder );

	}


	GEO.onChangeLatLonGeocoder = function() {

			var lat, lon;

			lat = parseFloat( GEOinpLatitude.value );
			lon = parseFloat( GEOinpLongitude.value );

			googleMap.map.setCenter(  {lat: lat, lng: lon } );
			googleMap.map.setZoom( COR.place.zoom );

			GEO.geocodeLatLonGeocoder();

	}


	GEO.onPlaceChangedGeocoder = function() {

		googleMap.place = googleMap.origin_autocomplete.getPlace();

//console.log( 'googleMap.place', googleMap.place );

		COR.place.origin = googleMap.place.name;

		inpAddress.value = COR.place.origin;

//		menuPlaceMessage.innerHTML = 'Name:' + place.origin + b;

		GEO.addressGeocoder( geocoder, googleMap.map );

	}

	GEO.onIdleGeocoder = function() {

// console.log( 'onIdle' );

		lat = googleMap.map.getCenter().lat();
		lon = googleMap.map.getCenter().lng();

		GEOinpLatitude.value = lat;
		GEOinpLongitude.value = lon;

	}


	GEO.geocodeLatLonGeocoder = function() {

		geocoder.geocode( { 'location': googleMap.map.center }, function( results, status ) {

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

		geocoder.geocode( { 'address': inpAddress.value }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				googleMap.map.setCenter( results[ 0 ].geometry.location );
				googleMap.map.setZoom( COR.place.zoom );

				var marker = new google.maps.Marker( { map: googleMap.map, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}
