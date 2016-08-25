
	googleMap = {};


	function getMenuDetailsMapClick() {

		var menuDetailsMapClick =

			'<details open >' +

				'<summary><h3>Click details</h3></summary>' +

				'<div id=menuClickDetails ></div>' +

			'</details>' +

		b;

		return menuDetailsMapClick;

	}


	function initGoogleMap() {

		var marker;

		getPlaceDefaults();



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

		googleMap.markings = [];

		googleMap.clearAll = function() {

			for ( var i = 0; i < googleMap.markings.length; i++ ) {

				googleMap.markings[ i ].setMap( null );

			}

			googleMap.markings = [];

		};

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
			position: {lat: place.latitude, lng: place.longitude },
			title: 'lat: ' + place.latitude + ', lng: ' + place.longitude,
			map: googleMap.map

		});

		googleMap.markings.push( marker );

		googleMap.map.addListener( 'click', onClickGoogleMap );

		onClickGoogleMap();

		if( geocoder !== undefined ) { initGoogleGeocoder(); }

		if ( menuDetailsMapParameters !== undefined ) { setMenuDetailsMapParameters(); }

		if ( divThreejs && divThreejs.style ) { divThreejs.style.display = 'none'; }

	}

	function onClickGoogleMap( event ) {

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

//			'Tile X: ' + lon2tile( lon, place.zoom ) + b +
//			'Tile Y: ' + lat2tile( lat, place.zoom ) + b + b +

//			'Pixel X: ' + event.pixel.x + 'px' + b +
//			'Pixel Y: ' + event.pixel.y + 'px' + b + b +

//			'<p><button onclick=inpLatitude.value=' + lat + ';inpLongitude.value=' + lon + ';initMap(); >Set click location as map center</button></p>' +
			'<p><button onclick=setCenter(' + lat + ',' + lon + '); >Set location as map center</button></p>' +

		'';

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
			title: 'lat: ' + lat + ', lng: ' + lon,
			position: {lat: lat, lng: lon } ,
			map: googleMap.map

		});

		googleMap.markings.push( marker );

		googleMap.click = marker;

	}
