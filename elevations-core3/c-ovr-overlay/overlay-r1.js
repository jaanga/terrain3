// Copyright &copy; 2016 Jaanga authors. MIT License

	var MAP = MAP || {};
	var OVR = OVR || {};

/*
	OVR.onLoad = function() {

		return OVR.getMenuDetailsOverlay();

	};
*/


	OVR.onLoadJSONFile = function() {

		OVR.setMenuDetailsOverlay();

		OVR.getMapOverlayParameters();

	};



	OVR.getMenuDetailsOverlay = function() {

		menuDetailsOverlay =

			'<details id=detailsOverlay >' +
				'<summary><h3>Overlay settings</h3></summary>' +
				'<small>Adjust 2D bitmaps</small>' +

				'<p>Map overlay provider<br><select id=OVRselMap onchange=OVR.getMapOverlayParameters();MAP.drawMapOverlay(); size=5 /></select></p>' +

				'<p>' +
					'Map overlay quality' + b +
					'<select id=OVRselMapZoom onchange=OVR.getMapOverlayParameters();MAP.drawMapOverlay(); ></select> + zoom level</p>' + b +

				'<details id=detailsOverlayParameters >' +

					'<summary><h4>overlay parameters</h4></summary>' +
					'<div id=OVRmenuDetailsOverlayParameters ></div>' +

				'</details>' +

			'</details>' +

		'';

		return menuDetailsOverlay;

	}


	OVR.setMenuDetailsOverlay = function() {

		if ( !OVRselMap.children.length ) {

			for ( i = 0; i < COR.mapTypes.length; i++ ) {

				OVRselMap.appendChild( document.createElement( 'option' ) );
				OVRselMap.children[ i ].text = COR.mapTypes[ i ][ 0 ];

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

