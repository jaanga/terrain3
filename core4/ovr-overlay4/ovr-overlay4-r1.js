// Copyright &copy; 2016 Jaanga authors. MIT License

	var MAP = MAP || {};
	var OVR = OVR || {};

/*
	OVR.onLoad = function() {

		return OVR.getMenuDetailsOverlay();

	};
*/

	OVR.mapTypes = [

		['Google Maps','https://mt1.google.com/vt/x='],
		['Google Maps Terrain','https://mt1.google.com/vt/lyrs=t&x='],
		['Google Maps Satellite','https://mt1.google.com/vt/lyrs=s&x='],
		['Google Maps Hybrid','https://mt1.google.com/vt/lyrs=y&x='],
		['Open Street Map','http://tile.openstreetmap.org/'],
		['Open Cycle Map', 'http://tile.opencyclemap.org/cycle/'],
		['MapQuest OSM', 'http://otile3.mqcdn.com/tiles/1.0.0/osm/'],
		['MapQuest Satellite', 'http://otile3.mqcdn.com/tiles/1.0.0/sat/'],
		['Stamen terrain background','http://tile.stamen.com/terrain-background/'],
		['Mesh Normal Material', '']

	];


	OVR.onLoadJSONFile = function() {

		OVR.setMenuDetailsOverlay();

		OVR.getMapOverlayParameters();

	};


// 			OVR.getMenuDetailsOverlay() +

// 		OVRdetailsOverlay.setAttribute('open', 'open');

//		OVRdetailsOverlayParameters.setAttribute( 'open', 'open' );

	OVR.getMenuDetailsOverlay = function() {

		var menuDetailsOverlay =

			'<details id=OVRdetailsOverlay >' +
				'<summary><h3>Overlay settings</h3></summary>' +
				'<small>Adjust 2D bitmaps</small>' +

				'<p>Map overlay provider<br><select id=OVRselMap onchange=OVR.getMapOverlayParameters();MAP.drawMapOverlay(); size=5 /></select></p>' +

				'<p>' +
					'Map overlay quality' + b +
					'<small>+ number: better quality but slower</small>' + b +
					'<select id=OVRselMapZoom onchange=OVR.getMapOverlayParameters();MAP.drawMapOverlay(); ></select> + zoom level</p>' + b +


				'<details id=OVRdetailsOverlayParameters >' +

					'<summary><h4>overlay parameters</h4></summary>' +

					'<div id=OVRmenuDetailsOverlayParameters ></div>' +

				'</details>' +

			'</details>' +

		'';

		return menuDetailsOverlay;

	}


	OVR.setMenuDetailsOverlay = function() {

		if ( !OVRselMap.children.length ) {

			for ( i = 0; i < OVR.mapTypes.length; i++ ) {

				OVRselMap.appendChild( document.createElement( 'option' ) );
				OVRselMap.children[ i ].text = OVR.mapTypes[ i ][ 0 ];

			}

		}

		OVRselMap.selectedIndex = 2;

		if ( !OVRselMapZoom.children.length ) {

			for ( var i = 0; i < 4; i++ ) {

				OVRselMapZoom.appendChild( document.createElement( 'option' ) );
				OVRselMapZoom.children[ i ].text = + i;

			}

		}

		OVRselMapZoom.selectedIndex = COR.place.deltaOverlay;

	}



	OVR.getMapOverlayParameters = function() {

		var delta;
		var place = COR.place;

		place.deltaOverlay = OVRselMapZoom.selectedIndex;
		delta = place.deltaOverlay;

		MAP.zoomOverlay = delta + place.zoom;
		MAP.ULtileXOverlay = Math.pow( 2, delta ) * place.ULtileX;
		MAP.ULtileYOverlay = Math.pow( 2, delta ) * place.ULtileY;
		MAP.tilesXOverlay = Math.pow( 2, delta ) * place.tilesX;
		MAP.tilesYOverlay = Math.pow( 2, delta ) * place.tilesY;

		if ( !MAP.canvas ) { 

			MAP.canvas = document.createElement( 'canvas' ); 

		}

		MAP.context = MAP.canvas.getContext( '2d' );

		MAP.canvas.width = place.pixelsPerTile * MAP.tilesXOverlay;
		MAP.canvas.height = place.pixelsPerTile * MAP.tilesYOverlay;


		OVRmenuDetailsOverlayParameters.innerHTML =

			'Zoom level: ' + MAP.zoomOverlay + b + b +

			'UL tile X: ' + MAP.ULtileXOverlay + b +
			'UL tile Y: ' + MAP.ULtileYOverlay + b + b +

			'Tiles X: ' + MAP.tilesXOverlay + b +
			'Tiles Y: ' + MAP.tilesYOverlay + b +

		b;

	}

