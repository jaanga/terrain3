
// https://developers.google.com/maps/documentation/javascript/places#place_search_requests
// https://developers.google.com/places/supported_types

	var NEA = NEA || {};

// types could be in COR.places and hold the data

	NEA.types = {

		natural_feature: { type: 'natural_feature', color: 'green' },
		locality: { type: 'locality', color: 'blue' },
		point_of_interest: { type: 'point_of_interest', color: 'red' }

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
						'<input type=radio name=radPlaceType id=but1 onclick=NEA.updateType("natural_feature"); checked />Natural feature (green)' + b +
						'<input type=radio name=radPlaceType id=but2 onclick=NEA.updateType("locality"); />Locality (blue)' + b +
						'<input type=radio name=radPlaceType id=but3 onclick=NEA.updateType("point_of_interest"); />point_of_interest (red)' +
					'</p>' +

					'<button id=NEAbutMore onclick=NEA.getNearby(); > get nearby </button>  ' +
					'<button id=NEAbutClearAll onclick=NEA.clearAll();API.clearAll(); > clear all </button>  ' +

			'</div>' + b +

			'<div id=NEAdivResults ></div>' +

			'</details>' +

		'';

		return menuDetailsNearby;

	};

	NEA.updateType = function( type ) {

console.log( '\n\ntype', type );

		NEAbutMore.disabled = false;
		NEA.type = NEA.types[ type ];
		COR.place[ type ] = [];

console.log( 'NEA.type', NEA.type.type );
console.log( 'COR.place[ type ]', COR.place[ type ] );

		NEAdivResults.innerHTML = updateResults()

		finished = false;
	}


	NEA.getNearby = function() {

count = 0;

		var service, bounds;

		NEA.type = NEA.type || NEA.types.natural_feature;

//console.log( '\n NEA.type', NEA.type.type );

		COR.place[ NEA.type.type ] = [];
		COR.results = [];

//		if ( !COR.place.types ) { COR.place.types = []; }

//		if ( !COR.place.types.includes( NEA.type.type ) ) { COR.place.types.push( NEA.type.type ); }

//		NEA.infowindow = new google.maps.InfoWindow();

		service = new google.maps.places.PlacesService( API.map );

// add event handler in TIL...

		if ( !TIL.tiles.LRlat ) {

			PAR.onEventMapParameters();

		}

		bounds = new google.maps.LatLngBounds(

			new google.maps.LatLng( TIL.tiles.LRlat, TIL.tiles.ULlon ),
			new google.maps.LatLng( TIL.tiles.ULlat, TIL.tiles.LRlon )

		);

		service.nearbySearch( {

			bounds: bounds,

			type: NEA.type.type

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

			strokeColor: NEA.type.color,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#00ff00',
			fillOpacity: 0,
			map: API.map,
			bounds: bounds

		});

		API.markings.push( rectangle );

	}



	NEA.callback = function( results, status, pagination ) {

		if ( status === google.maps.places.PlacesServiceStatus.OK ) {

			res = results;

console.log( NEA.type.type, COR.place[ NEA.type.type ].length, pagination.hasNextPage, count++ );

			COR.results = [];

			for ( var i = 0, result; i < results.length; i++ ) {

				result = results [ i ];

//console.log( 'result.types[ 0 ][ 0 ] ', result.types  );

				if ( result.types.includes( NEA.type.type ) === true ) {

					loc = result.geometry.location;
					API.createMarker( result, NEA.type.color, result.types[ 0 ][ 0 ].toUpperCase() );

					COR.place[ NEA.type.type ].push( { name: result.name, lat: loc.lat(), lon: loc.lng(), types: result.types, id: result.place_id } );

					COR.results.push( result );

				}
			}

//console.log( 'place', COR.place );
//console.log( 'results', results );
//console.log( 'pagination.hasNextPage', pagination.hasNextPage );

//			NEAdivResults.innerHTML = updateResults();

			if ( pagination.hasNextPage === true ) {

// console.log( 'pagination', pagination );

				NEAbutMore.disabled = false;

				NEAdivResults.innerHTML = updateResults() + ' More places available...';

				NEAbutMore.addEventListener( 'click', function() {

					NEAbutMore.disabled = true;

					pagination.nextPage();

				});

			} else {

console.log( 'haspage false', pagination.hasNextPage );

				NEAbutMore.disabled = true;

				NEAdivResults.innerHTML = updateResults() + ' No more places.';

			}

		} else {

			NEAdivResults.innerHTML  = 'error status: ' + status;

		}






//console.log( 'COR.place.natural_feature', COR.place.natural_feature.length );
//console.log( 'COR.place.locality', COR.place.locality.length );
//console.log( 'COR.place.point_of_interest', COR.place.point_of_interest.length );

	}

		function updateResults() {

			var txt;

			txt = 
				COR.place.natural_feature.length + ' natural features' + b +
				COR.place.locality.length + ' localities' + b + 
				COR.place.point_of_interest.length + ' points of interest' + b + 
			'';

			return txt;

		}

	NEA.clearAll = function() {

//		if ( !COR.results ) { return; }

// console.log( 'NEA clear'  );

		COR.place.natural_feature = [];
		COR.place.locality = [];
		COR.place.point_of_interest = [];

		NEAbutMore.disabled = false;

		NEAdivResults.innerHTML = '';

	}
