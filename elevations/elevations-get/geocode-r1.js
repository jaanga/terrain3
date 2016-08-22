

	function setMenuDetailsGeocoder() {

		menuDetailsGeocoder.innerHTML =

			'<details open >' +

				'<summary><h3>Set location</p></summary>' +

				'<p>Enter a location and there:</p>' +

				'<p>' +
					'<input id=inpAddress class=controls placeholder="' + place.origin + '" onclick=this.select(); ' +
					' onchange=geocodeAddress(geocoder,googleMap.map); title="Thank you Google!" > ' +
				'<button onclick=geocodeAddress(geocoder,googleMap.map); > geocode </button></p>' +

				'<p id=menuPlaceMessage ></p>' +

				'<p>Latitude : <input id=inpLatitude size=12 value=' + place.latitude + ' onclick=this.select(); onchange=setCenter(inpLatitude.value,inpLongitude.value); ></p>' +
				'<p>Longitude: <input id=inpLongitude size=12 value=' + place.longitude + ' onclick=this.select(); onchange=setCenter(inpLatitude.value,inpLongitude.value);  ></p>' +

			'</details>' + 

		b;




	}

	function otherInits() {

		setMenuDetailsGeocoder();

		var origin_autocomplete, marker;

		geocoder = new google.maps.Geocoder();

		origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		origin_autocomplete.bindTo( 'bounds', googleMap.map );

		origin_autocomplete.addListener( 'place_changed', function() {

			googleMap.origin_autocomplete = origin_autocomplete.getPlace();

			expandViewportToFitPlace( googleMap.map, googleMap.origin_autocomplete );

		} );

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

			lat = origin.geometry.location.lat()
			lon = origin.geometry.location.lng();

			inpLatitude.value = lat;
			inpLongitude.value = lon;

			googleMap.click = setCenter( lat, lon );


			menuPlaceMessage.innerHTML +=

				b + ( origin.vicinity ? 'Vicinity:\n' + origin.vicinity : '' ) +

			'';

		}

	}
