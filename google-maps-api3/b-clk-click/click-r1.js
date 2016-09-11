

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

		var marker;

		COR.getPlaceDefaults();
		var place = COR.place;

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

		googleMap.map.addListener( 'click', CLK.onClickGoogleMap );

		CLK.onClickGoogleMap();

		googleMap.center = googleMap.click;

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

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
			title: 'lat: ' + lat + ', lng: ' + lon,
			position: {lat: lat, lng: lon } ,
			map: googleMap.map

		});

		googleMap.markings.push( marker );

		googleMap.click = marker;

	}


	CLK.setCenter = function( lat, lon ) {

		var place = COR.place;

		googleMap.clearAll();

		place.latitude = lat ? parseFloat( lat ) : place.latitude;

		place.longitude = lon ? parseFloat( lon ) : place.longitude;

		marker = new google.maps.Marker({

			icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
			position: {lat: place.latitude, lng: place.longitude },
			title: 'lat: ' + place.latitude + ', lng: ' + place.longitude,
			map: googleMap.map

		});

		googleMap.markings.push( marker );

		googleMap.center = marker;

		googleMap.map.setCenter( marker.position );

		if (  TIL.tiles ) { TIL.getTilesData(); }

		return marker;

	}
