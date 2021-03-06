
	var NEA = NEA || {};


	NEA.getMenuDetailsNearby = function() {

		var menuDetailsNearby =

			'<details id=NEAdetailsNearby open >' +

				'<summary id=NEAmenuSummaryNearby ><h3>Nearby</h3></summary>' +

				'<p id=NEApTemplate >' +

					'<button onclick=NEA.getNearby(); > get Nearby </button>' + b +

			'</p>' +

			'</details>' +

		b;

		return menuDetailsNearby;

	};


	NEA.getNearby = function() {

		var service;

		NEA.infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService( googleMap.map );

		COR.center = { lat: COR.place.latitudeCenter, lng: COR.place.longitudeCenter };

		service.nearbySearch( {

			location: COR.center,
			radius: ( 1.75 * 111111 * COR.place.latitudeDelta ),

// https://developers.google.com/places/supported_types

//			type: [ 'colloquial_area' ]
//			type: [ 'locality' ]
//			type: [ 'natural_feature' ]
//			type: [ 'point_of_interest']
//			type: [ 'postal_code' ]
			type: [ 'postal_town' ]
//			type: [ 'route' ]
//			type: [ 'sublocality' ]
//			type: [ '' ]

//			types: [ 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'administrative_area_level_4', 'administrative_area_level_5', ]

//			types: [ 'locality', 'sublocality', 'natural_feature', 'colloquial_area' ]
//			types: [ '(regions)', 'natural_feature', 'colloquial_area' ]

//			types: [  ]

		}, NEA.callback );

	}



	NEA.callback = function( results, status ) {

		if ( status === google.maps.places.PlacesServiceStatus.OK ) {

			COR.place.nearby = [];

			for ( var i = 0, result; i < results.length; i++ ) {

				result = results [ i ];
				loc = result.geometry.location;
				NEA.createMarker( result );

				COR.place.nearby.push( { name: result.name, lat: loc.lat(), lon: loc.lng(), types: result.types } );

			}

			circle = new google.maps.Circle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: googleMap.map,
				center: COR.center,
				radius: ( 1.75 * 111111 * COR.place.latitudeDelta ),
			});

			googleMap.markings.push( circle );

console.log( 'place', COR.place );
console.log( 'results', results );

		}

	}



	NEA.createMarker = function( place ) {


		var placeLoc = place.geometry.location;

		var marker = new google.maps.Marker( {

			map: googleMap.map,
			position: place.geometry.location

		} );

		google.maps.event.addListener(marker, 'click', function() {

			address = place.address ? 'address: ' + place.addreess + b : '';
			vicinity = place.vicinity ? 'viciity: ' + place.vicinity + b : '';
			NEA.infowindow.setContent( 

			'<div>' +
				'<strong>' + place.name + '</strong>' + b +
                'Place ID: ' + place.place_id + b +
					address +
					vicinity + 
					'types: ' + place.types + b +
					'lat: ' + placeLoc.lat().toFixed( 3 ) + ' lon: ' + placeLoc.lng().toFixed( 3 ) +
			'</div>'

			);

			NEA.infowindow.open( googleMap.map, this );

		} );

		googleMap.markings.push( marker );

	}


	NEA.clearAll = function() {

		for ( var i = 0; i < googleMap.markings.length; i++ ) {

			googleMap.markings[ i ].setMap( null );

		}

		googleMap.markings = [];

	};
