
	var geocoder = {} ;


	function getMenuDetailsGeocoder() {

		menuDetailsGeocoder =

			'<details open >' +

				'<summary><h3>Set location</p></summary>' +

				'<p>Enter a location:</p>' +

				'<p>' +
					'<input id=inpAddress class=controls placeholder="' + defaults.origin + '" onclick=this.select(); ' +
					'onchange=geocodeAddress(geocoder,googleMap.map); title="Thank you Google!" > ' +
				'<button onclick=geocodeAddress(geocoder,googleMap.map); > geocode </button></p>' +

				'<p>Latitude : <input id=inpLatitude size=12 value=' + defaults.latitude + ' onclick=this.select(); onchange=onChangeLatLon(); ></p>' +
				'<p>Longitude: <input id=inpLongitude size=12 value=' + defaults.longitude + ' onclick=this.select(); onchange=onChangeLatLon();  ></p>' +

				'<p id=menuPlaceMessage ></p>' +

			'</details>' +

		b;

		return menuDetailsGeocoder;

	}



	function initGoogleGeocoder() {

		menuDetailsGeocoder.innerHTML = getMenuDetailsGeocoder();

		geocoder = new google.maps.Geocoder();

		googleMap.origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		googleMap.origin_autocomplete.bindTo( 'bounds', googleMap.map );

		googleMap.origin_autocomplete.addListener( 'place_changed', onPlaceChanged );

		googleMap.map.addListener( 'idle', onIdle );

	}


	function onChangeLatLon() {

			var lat, lon;

			lat = parseFloat( inpLatitude.value );
			lon = parseFloat( inpLongitude.value );

			googleMap.map.setCenter(  {lat: lat, lng: lon } );
			googleMap.map.setZoom( place.zoom );

			geocodeLatLng();

	}


	function onPlaceChanged( ) {

		googleMap.place = googleMap.origin_autocomplete.getPlace();

//console.log( 'googleMap.place', googleMap.place );

		place.origin = googleMap.place.name;

		inpAddress.value = place.origin;

//		menuPlaceMessage.innerHTML = 'Name:' + place.origin + b;

		geocodeAddress( geocoder, googleMap.map );

	}

	function onIdle() {

// console.log( 'onIdle' );

		lat = googleMap.map.getCenter().lat();
		lon = googleMap.map.getCenter().lng();

		inpLatitude.value = lat;
		inpLongitude.value = lon;

	}


	function geocodeLatLng() {

		geocoder.geocode( { 'location': googleMap.map.center }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				if ( results[ 1 ] ) {

//r = results

//console.log( 'name', results[ 1 ], r[1].address_components[0].short_name);

					place.origin = results[ 1 ].address_components[0].short_name;

					inpAddress.value = place.origin;

//					menuPlaceMessage.innerHTML = 'Name:' + b + place.origin + b;

				} else {

					menuPlaceMessage.innerHTML = 'No results found';

				}

			} else {

				menuPlaceMessage.innerHTML = 'Geocoder failed due to: ' + status;

			}

		} );

	}


	function geocodeAddress() {

		geocoder.geocode( { 'address': inpAddress.value }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				googleMap.map.setCenter( results[ 0 ].geometry.location );
				googleMap.map.setZoom( place.zoom );

				var marker = new google.maps.Marker( { map: googleMap.map, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}
