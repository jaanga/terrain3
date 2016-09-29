
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

		var service, bounds;

		COR.place.nearby = [];
		COR.results = [];

		NEA.infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService( googleMap.map );

/*
		bounds = new google.maps.LatLngBounds(

			new google.maps.LatLng( TIL.tiles.ULlat, TIL.tiles.ULlon ),
			new google.maps.LatLng( TIL.tiles.LRlat, TIL.tiles.LRlon )

		);
*/

		bounds = new google.maps.LatLngBounds(

			new google.maps.LatLng( TIL.tiles.LRlat, TIL.tiles.ULlon ),
			new google.maps.LatLng( TIL.tiles.ULlat, TIL.tiles.LRlon )


		);

		service.nearbySearch( {

			bounds: bounds,

// https://developers.google.com/places/supported_types
//			type: [ 'colloquial_area' ]
//			type: [ 'locality' ]
			type: [ 'natural_feature' ]
//			type: [ 'point_of_interest']
//			type: [ '(regions)' ]
//			type: [ 'political' ]
//			type: [ 'postal_code' ]
//			type: [ 'postal_town' ]
//			type: [ 'route' ]
//			type: [ 'sublocality' ]

//			type: [ 'administrative_area_level_5' ]
//			type: [ 'sublocality_level_5' ]
//			type: [ '(regions)' ]
//			type: [ '' ]

//			types: [ 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'administrative_area_level_4', 'administrative_area_level_5', ]
//			types: [ 'locality, sublocality, natural_feature, colloquial_area' ]

//			types: [ '(regions), colloquial_area, locality, natural_feature, route, sublocality'  ]
//			types: [ '(cities)' ]

//			types: [  ]

		}, NEA.callback );


		service.nearbySearch( {

			bounds: bounds,
			type: [ 'locality' ]

		}, NEA.callback );



		var rectangle = new google.maps.Rectangle({

			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.25,
			map: googleMap.map,
			bounds: bounds

		});

		googleMap.markings.push( rectangle );

	}



	NEA.callback = function( results, status ) {

		if ( status === google.maps.places.PlacesServiceStatus.OK ) {

			for ( var i = 0, result; i < results.length; i++ ) {

				result = results [ i ];
				loc = result.geometry.location;
				NEA.createMarker( result );

				COR.place.nearby.push( { name: result.name, lat: loc.lat(), lon: loc.lng(), types: result.types } );

				COR.results.push( result );

			}

console.log( 'place', COR.place );
console.log( 'results', results );

		} else {

console.log( 'error status', status )

		}

	}



	NEA.createMarker = function( place ) {

		var placeLoc = place.geometry.location;

		var marker = new google.maps.Marker( {

			map: googleMap.map,
			position: place.geometry.location,
			label: place.types[ 0 ][ 0 ].toUpperCase(),
			title: place.types[ 0 ]

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
