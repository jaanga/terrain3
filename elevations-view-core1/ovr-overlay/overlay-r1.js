// Copyright &copy; 2016 Jaanga authors. MIT License

//	var map = {};

	COR.getMenuPlugins = function() {

		return OVR.getMenuDetailsOverlay();

	};


	var OVR = {};


	OVR.getMenuDetailsOverlay = function() {

		menuDetailsOverlay =

			'<details id=detailsOverlay open >' +
				'<summary><h3>Overlay settings</h3></summary>' +
				'<small>Adjust 2D bitmaps</small>' +

				'<p>Map overlay provider<br><select id=selMap onchange=OVR.drawMapOverlay(); size=5 /></select></p>' +

				'<p>' +
					'Map overlay quality' + b +
					'<select id=selMapZoom onchange=OVR.drawMapOverlay(); ></select> + zoom level</p>' + b +

				'<details>' +

					'<summary><h4>overlay parameters</h4></summary>' +
					'<div id=menuDetailsOverlayParameters ></div>' +

				'</details>' +

			'</details>' +

		b;

		return menuDetailsOverlay;

	}



	OVR.setMenuDetailsOverlay = function() {

		for ( i = 0; i < COR.place.mapTypes.length; i++ ) {

			selMap.appendChild( document.createElement( 'option' ) );
			selMap.children[ i ].text = COR.place.mapTypes[ i ][ 0 ];

		}

		selMap.selectedIndex = 2;

		for ( var i = 0; i < 4; i++ ) {

			selMapZoom.appendChild( document.createElement( 'option' ) );
			selMapZoom.children[ i ].text = + i;

		}

	}



	OVR.getMapOverlayParameters = function() {

		var delta;
		var place = COR.place;

		place.deltaOverlay = selMapZoom.selectedIndex;
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

		menuDetailsOverlayParameters.innerHTML =

			'Zoom level: ' + MAP.zoomOverlay + b + b +

			'UL tile X: ' + MAP.ULtileXOverlay + b +
			'UL tile Y: ' + MAP.ULtileYOverlay + b + b +

			'Tiles X: ' + MAP.tilesXOverlay + b +
			'Tiles Y: ' + MAP.tilesYOverlay + b + b +

		b;

	}



	OVR.drawMapOverlay = function( updateCamera ) {

		OVR.getMapOverlayParameters();

	}
