
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

		service.nearbySearch( {

			location: googleMap.center.position,
			radius: ( 1.4 * 111111 * COR.place.latitudeDelta),
//			type: ['natural_feature']
//			type: ['colloquial_area']
//			type: ['locality']
//			type: ['sublocality']
//			type: ['point_of_interest']
			types: [ 'locality', 'natural_feature','colloquial_area' ]

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

	}


