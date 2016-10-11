
// https://developers.google.com/maps/documentation/javascript/places#place_search_requests

	var NEA = NEA || {};

	NEA.types = {

		naturalFeature: { type: 'natural_feature', color: 'green' },
		locality: { type: 'locality', color: 'blue' },
		pointOfInterest: { type: 'point_of_interest', color: 'red' }


	}


//		NEA.getMenuDetailsNearby() +

//		NEAdetailsNearby.setAttribute('open', 'open');


	NEA.getMenuDetailsNearby = function() {

		var menuDetailsNearby =

			'<details id=NEAdetailsNearby open >' +

				'<summary id=NEAmenuSummaryNearby ><h3>Get Places Nearby</h3></summary>' +

				'<small>Use Google Maps API to find places nearby</small>' + b +

				'<div id=NEAdivNearby >' +

					'<p>' +
						'<input type=radio name=radPlaceType id=but1 onclick=butMore.disabled=false;NEA.type=NEA.types.naturalFeature; checked />Natural feature' + b +
						'<input type=radio name=radPlaceType id=but2 onclick=butMore.disabled=false;NEA.type=NEA.types.locality; />Locality' + b +
						'<input type=radio name=radPlaceType id=but3 onclick=butMore.disabled=false;NEA.type=NEA.types.pointOfInterest; />point_of_interest' +
					'</p>' +

					'<button id=butMore onclick=NEA.getNearby(); > get Nearby </button>  ' +

			'</div>' + b +

			'<div id=NEAdivResults ></div>' +

			'</details>' +

		'';

		return menuDetailsNearby;

	};



	NEA.getNearby = function() {

		var service, bounds;

		if ( NEA.latitude !== COR.place.latitude && NEA.longitude !== COR.place.longitude ) {

			butMore.disabled=false;
			NEAdivResults.innerHTML = '';

			NEA.latitude = COR.place.latitude;
			NEA.longitude = COR.place.longitude;

		}

		NEA.type = NEA.type || NEA.types.naturalFeature;

		COR.place[ NEA.type.type ] = [];
		COR.results = [];

		if ( !COR.place.types ) {  COR.place.types = []; }

		if ( !COR.place.types.includes( NEA.type.type ) ) { COR.place.types.push( NEA.type.type ); }

//		NEA.infowindow = new google.maps.InfoWindow();

		service = new google.maps.places.PlacesService( API.map );

		if ( !TIL.tiles.LRlat ) {

			PAR.onEventMapParameters();

		}

		bounds = new google.maps.LatLngBounds(

			new google.maps.LatLng( TIL.tiles.LRlat, TIL.tiles.ULlon ),
			new google.maps.LatLng( TIL.tiles.ULlat, TIL.tiles.LRlon )


		);

		service.nearbySearch( {

			bounds: bounds,

			type: [ NEA.type.type ]

// https://developers.google.com/places/supported_types
//			type: [ 'colloquial_area' ]
//			type: [ 'locality' ]
//			type: [ 'natural_feature' ]
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


		var rectangle = new google.maps.Rectangle({

			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.01,
			map: API.map,
			bounds: bounds

		});

		API.markings.push( rectangle );

	}



	NEA.callback = function( results, status, pagination ) {

		if ( status === google.maps.places.PlacesServiceStatus.OK ) {

//			var res = results;

			for ( var i = 0, result; i < results.length; i++ ) {

				result = results [ i ];
				loc = result.geometry.location;
				API.createMarker( result, NEA.type.color, result.types[ 0 ][ 0 ].toUpperCase() );

				COR.place[ NEA.type.type ].push( { name: result.name, lat: loc.lat(), lon: loc.lng(), types: result.types, id: result.place_id } );

				COR.results.push( result );

			}

//console.log( 'place', COR.place );
//console.log( 'results', results );
//console.log( 'pagination.hasNextPage', pagination.hasNextPage );

			NEAdivResults.innerHTML = COR.results.length + ' results found';

			if ( pagination.hasNextPage ) {

				butMore.disabled = false;

				butMore.addEventListener( 'click', function() {

					butMore.disabled = true;

					pagination.nextPage();

				});

				NEAdivResults.innerHTML = COR.results.length + ' results found. More available,';

			} else {

				butMore.disabled = true;

				NEAdivResults.innerHTML = COR.results.length + ' results found. No more places.';

			}

		} else {

			NEAdivResults.innerHTML  = 'error status: ' + status;

		}

	}


/*

	NEA.createMarker = function( place ) {

		var placeLoc = place.geometry.location;

		var marker = new google.maps.Marker( {

			map: API.map,
			position: place.geometry.location,
			label: place.types[ 0 ][ 0 ].toUpperCase(),
			title: place.types[ 0 ]

		} );

		google.maps.event.addListener(marker, 'click', function() {

			address = place.address ? 'address: ' + place.addreess + b : '';
			vicinity = place.vicinity ? 'vicinity: ' + place.vicinity + b : '';
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

			NEA.infowindow.open( API.map, this );

		} );

		API.markings.push( marker );

	}


	NEA.clearAll = function() {

		for ( var i = 0; i < API.markings.length; i++ ) {

			API.markings[ i ].setMap( null );

		}

		API.markings = [];

	};

*/
