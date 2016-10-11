
	var GEO = GEO || {};


// menu


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


// init

	GEO.initGoogleGeocoder = function() {

//console.log( '', 23 );

		menuDetailsGeocoder.innerHTML = GEO.getMenuDetailsGeocoder();

		GEO.geocoder = new google.maps.Geocoder();

		API.origin_autocomplete = new google.maps.places.Autocomplete( inpAddress );
		API.origin_autocomplete.bindTo( 'bounds', API.map );

		API.origin_autocomplete.addListener( 'place_changed', GEO.onPlaceChangedGeocoder );

		API.map.addListener( 'idle', GEO.onIdleGeocoder );

	}



// events

	GEO.onChangeLatLonGeocoder = function() {

			var p;

			p = COR.place;

			p.latitude = parseFloat( GEOinpLatitude.value );
			p.longitude = parseFloat( GEOinpLongitude.value );

			API.map.setCenter(  {lat: p.latitude, lng: p.longitude } );
			API.map.setZoom( p.zoom );

//			API.onClickGoogleMap();

			API.setClickMenuDetails( p.latitude, p.longitude  );

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

		lat = API.map.getCenter().lat();
		lon = API.map.getCenter().lng();

		GEOinpLatitude.value = lat;
		GEOinpLongitude.value = lon;

		API.setCenter( lat, lon, true );

	}



// get

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

			API.setCenter( API.map.center.lat(), API.map.center.lng(), true );

		} );

	}


	GEO.addressGeocoder = function() {

		var loc, marker;;

		GEO.geocoder.geocode( { 'address': inpAddress.value }, function( results, status ) {

			if ( status === google.maps.GeocoderStatus.OK ) {

				loc = results[ 0 ].geometry.location;
				API.map.setCenter( loc );
				API.map.setZoom( COR.place.zoom );

				API.setClickMenuDetails( loc.lat(), loc.lng() );

//				marker = new google.maps.Marker( { map: API.map, position: loc } );

				API.setCenter( API.map.center.lat(), API.map.center.lng(), true );

			} else {

				menuPlaceMessage.innerHTML = 'Geocode was not successful for the following reason: ' + status;

			}

		} );

	}
