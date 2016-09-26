

	function setMenuDetailsGeocoder() {

		plugins.innerHTML +=

			'<details open >' +

				'<summary><h3>Set location</p></summary>' +

				'<p>Enter a location:</p>' +

				'<p>' +
					'<input id=inpAddress class=controls placeholder="' + place.origin + '" onclick=this.select(); ' +
					' onchange=geocodeAddress(geocoder,googleMap.map); title="Thank you Google!" > ' +
				'<button onclick=geocodeAddress(geocoder,googleMap.map); > geocode </button></p>' +

				'<p>Latitude : <input id=inpLatitude size=12 value=' + place.latitude + ' onclick=this.select(); onchange=onChangeLatLon(); ></p>' +
				'<p>Longitude: <input id=inpLongitude size=12 value=' + place.longitude + ' onclick=this.select(); onchange=onChangeLatLon();  ></p>' +

				'<p id=menuPlaceMessage ></p>' +

			'</details>' + 

		b;

	}

	function onChangeLatLon() {

			//var lat, lon;
			lat = parseFloat( inpLatitude.value );
			lon = parseFloat( inpLongitude.value );

			googleMap.map.setCenter(  {lat: lat, lng: lon } );
			googleMap.map.setZoom( place.zoom );

			geocodeLatLng()

	}

	function initGoogleGeocoder() {

//		var origin_autocomplete, marker;

		geocoder = new google.maps.Geocoder();

		googleMap.origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		googleMap.origin_autocomplete.bindTo( 'bounds', googleMap.map );

/*
		googleMap.origin_autocomplete.addListener( 'place_changed', function() {

			googleMap.place = googleMap.origin_autocomplete.getPlace();

			expandViewportToFitPlace( googleMap.map, googleMap.place );

		} );
*/

		googleMap.origin_autocomplete.addListener( 'place_changed', onPlaceChanged );

//		googleMap.map.addListener( 'center_changed', onCenterChanged );

		googleMap.map.addListener( 'idle', onIdle );

	}


	function onPlaceChanged( ) {

		googleMap.place = googleMap.origin_autocomplete.getPlace();

console.log( 'googleMap.place', googleMap.place );

		place.origin = googleMap.place.name;

		menuPlaceMessage.innerHTML =

//				b + ( origin.vicinity ? 'Vicinity:\n' + origin.vicinity : '' ) +
				'Name:' + b + 
				place.origin +
			b;

		inpAddress.value = place.origin;

geocodeAddress( geocoder, googleMap.map ) 

	}

	function onIdle( event ) {

// console.log( 'onIdle' );

		lat = googleMap.map.getCenter().lat()
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

					menuPlaceMessage.innerHTML =

						'Name:' + b + 
						place.origin +

					b;

//					googleMap.origin_autocomplete = googleMap.origin_autocomplete.getPlace();

//					expandViewportToFitPlace( googleMap.map, googleMap.origin_autocomplete );


				} else {

					menuPlaceMessage.innerHTML = 'No results found';

				}

			} else {

				menuPlaceMessage.innerHTML = 'Geocoder failed due to: ' + status;

			}

		} );

	}


	function geocodeAddress( geocoder, map ) {

		var address;

		address = inpAddress.value;

		geocoder.geocode( { 'address': address }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				map.setCenter( results[ 0 ].geometry.location );
				map.setZoom( place.zoom );

				var marker = new google.maps.Marker( { map: map, position: results[ 0 ].geometry.location } );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}

/*
	function expandViewportToFitPlace( map, origin ) {

		if ( !origin ) {

			menuPlaceMessage.innerHTML = 'Autocomplete\'s returned place contains no geometry';

			return;

		} else {

o = origin
console.log( 'origin', origin );

			if ( origin.geometry ) {

				if ( origin.geometry.viewport ) {

					map.fitBounds( origin.geometry.viewport );

				} else {

					map.setCenter( origin.geometry.location );
					map.setZoom( 17 );

					lat = origin.geometry.location.lat()
					lon = origin.geometry.location.lng();

					inpLatitude.value = lat;
					inpLongitude.value = lon;

				}

			}



				place.origin = origin.name;

				menuPlaceMessage.innerHTML +=

//				b + ( origin.vicinity ? 'Vicinity:\n' + origin.vicinity : '' ) +
				'Name:' + b + 
				place.origin +
			b;

				center = googleMap.map.getCenter();


				lat = googleMap.map.getCenter().lat()
				lon = googleMap.map.getCenter().lng();

				inpLatitude.value = lat;
				inpLongitude.value = lon;

		}

	}
*/
