

	var CLK = CLK || {};


	CLK.getMenuDetailsAPIKey = function() {

		var menuDetailsAPIKey =

			'<details id=CLKapiKey >' +

				'<summary><h3>Set api key</h3></summary>' +

				'<small>If small request, no need for API key</small>' +

				'<p>api key: <input id=CLKinpAPI onclick=this.select(); title="Obtain API key from Google Maps" ></p>' +
				'<p><button onclick=CLK.onEventAPIKeyUpdate(); >Set API key</button></p>' +

			'</details>' + 

		b;

		return menuDetailsAPIKey;

	}


	CLK.getMenuDetailsMapClick = function() {

		var menuDetailsMapClick =

			'<details id=CLKclickDetails open >' +

				'<summary><h3>Click details</h3></summary>' +

				'<div id=menuClickDetails ></div>' +

			'</details>' +

		b;

		return menuDetailsMapClick;

	}


	CLK.onEventAPIKeyUpdate = function() {

		if ( googleMap.script ) { googleMap.script.src = ''; google = {}; }

		googleMap.script = document.body.appendChild( document.createElement('script') );
		googleMap.script.onload = CLK.initGoogleMap;

		if ( CLKinpAPI.value !== '' ) {

			googleMap.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + CLKinpAPI.value;

		} else {

			googleMap.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places';

		}

	}



	CLK.initGoogleMap = function() {

		var place, marker;

		place = COR.place;

		mapDiv = document.body.appendChild( document.createElement( 'div' ) );
		mapDiv.id = 'mapDiv';

		googleMap.map = new google.maps.Map( mapDiv, {

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

		googleMap.map.addListener( 'click', CLK.onClickGoogleMap );
		googleMap.markings = [];

		CLK.infowindow = new google.maps.InfoWindow();
		CLK.createMarker( googleMap.map.center );

		if ( geocoder !== undefined ) { GEO.initGoogleGeocoder(); }

		if ( PAR.setMapParameters ) { PAR.setMapParameters(); }

		if ( threejs && divThreejs.style ) { divThreejs.style.display = 'none'; }

	}



	CLK.onClickGoogleMap = function( event ) {

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

			'<p><button onclick=CLK.setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';

		CLK.createMarker( event.latLng, 'green' );

	}


	CLK.setCenter = function( lat, lon ) {

		var place, marker;

		place = COR.place;

		var bounds = googleMap.map.getBounds();



		googleMap.clearAll();

		place.latitude = lat ? parseFloat( lat ) : place.latitude;

		place.longitude = lon ? parseFloat( lon ) : place.longitude;

		placeLocation = { lat: place.latitude, lng: place.longitude };

		if ( bounds.contains( placeLocation ) === true ) {

			googleMap.map.setCenter( placeLocation );

			CLK.createMarker( placeLocation );

			if ( TIL.tiles ) { TIL.getTilesData(); }

		} else {

			alert( 'curent marker is outside the visible area' );

		}

	}


	CLK.createMarker = function( placeLoc, color = 'yellow' ) {

		var place;
		place = COR.place;

		var marker = new google.maps.Marker( {

			icon: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
			title: 'lat: ' + place.latitude + ', lng: ' + place.longitude,
			map: googleMap.map,
			position: placeLoc

		} );

		google.maps.event.addListener( marker, 'click', function() {

			address = place.address ? 'address: ' + place.addreess + b : '';
			vicinity = place.vicinity ? 'viciity: ' + place.vicinity + b : '';

			CLK.infowindow.setContent( 

			'<div>' +
				'<strong>' + place.name + '</strong>' + b +
                'Place ID: ' + place.place_id + b +
					address +
					vicinity + 
					'types: ' + place.types + b +
					'lat: ' + placeLoc.lat().toFixed( 3 ) + ' lon: ' + placeLoc.lng().toFixed( 3 ) +
			'</div>'

			);

			CLK.infowindow.open( googleMap.map, this );

		} );

		googleMap.markings.push( marker );

	}

	googleMap.clearAll = function() {

		for ( var i = 0; i < googleMap.markings.length; i++ ) {

			googleMap.markings[ i ].setMap( null );

		}

		googleMap.markings = [];

	};

