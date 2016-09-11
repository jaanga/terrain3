
	var PAR = PAR || {};

//	PAR.mapParameters = true;

	PAR.getMenuDetailsMapParameters = function() {

		var menuDetailsMapParameters =

			'<details open>' +

				'<summary><h3>Set map parameters</p></summary>' +

				'<p>Zoom: <select id=selZoom onchange=PAR.onEventMapParameters(); title="Select the zoom" size=1 ></select></p>' +

				'<p>' +
					'Map overlay: <select id=selMap onchange=PAR.onEventMapParameters(); title="images courtesy of Google Maps API" size=1 />' +
					'<option> Hybrid </option>' +
					'<option> Roadmap </option>' +
					'<option> Satellite </option>' +
					'<option> Terrain </option>' +
					'</select>' +
				'</p>' +

				'<p>Tiles width: <select id=selTilesX onchange=PAR.onEventMapParameters(); type=number size=1 ></select></p>' +
				'<p>Tiles height: <select id=selTilesY onchange=PAR.onEventMapParameters(); type=number size=1 ></select></p>' +

				'<p>Samples per tile: <select id=selSamples onchange=PAR.onEventMapParameters(); title="Select the number of samples per tile" size=1 ></select></p>' +

			'</details>' +

		b;

		return menuDetailsMapParameters;

	}



	PAR.setMapParameters = function() {

		var samplesDefaultIndex = 0; // 10 samples per tile

		for ( var i = 0; i < 20; i++ ) {

			selZoom[ selZoom.length ] = new Option( i + 1 );

		}

		selZoom.selectedIndex = COR.defaults.zoom - 1;

		selMap.selectedIndex = 0;

		for ( i = 0; i < 12; i++ ) {

			selTilesX[ selTilesX.length ] = new Option( i + 1 );

		}

		selTilesX.selectedIndex = COR.defaults.tilesX - 1;


		for ( i = 0; i < 12; i++ ) {

			selTilesY[ selTilesY.length ] = new Option( i + 1 );

		}

		selTilesY.selectedIndex = COR.defaults.tilesY - 1;

		samps = [
			[ 10, 'Takes about a second' ],
			[ 20, 'takes about ?? seconds' ],
			[ 30, 'takes about ?? seconds' ],
			[ 40, 'takes about ?? seconds' ],
			[ 50, 'takes about 75 seconds' ],
			[ 60, 'takes about ?? seconds' ],
			[ 70, 'takes about ?? seconds' ],
			[ 80, 'takes about ?? seconds' ],
			[ 90, 'takes about ?? seconds' ],
			[ 100, 'takes about ?? seconds' ],
			[ 128, 'takes about ?? seconds' ],
			[ 150, 'takes about ?? seconds' ],
			[ 170, 'takes about 2,500 seconds' ],
			[ 200, 'takes 5 to 6 minutes' ], [ 250, 'takes 8 to 9 minutes' ], [ 500, 'takes about an hour' ] ];

		for ( i = 0; i < samps.length; i++ ) {

			selSamples.options[ i ] = new Option( samps[ i ][ 0 ] );
			selSamples.options[ i ].title = samps[ i ][ 1 ];
		}

		selSamples.selectedIndex = samplesDefaultIndex;

	}


	PAR.onEventMapParameters = function() {

		var place = COR.place;

		place.zoom = selZoom.selectedIndex + 1;

		place.mapTypeId = selMap.value.toLowerCase();

		googleMap.map.setZoom( place.zoom );

		googleMap.map.setMapTypeId( place.mapTypeId );

		place.tilesX = selTilesX.selectedIndex + 1;
		place.tilesY = selTilesY.selectedIndex + 1;

		place.samplesX = parseInt( selSamples.value, 10 ) * place.tilesX;
		place.samplesY = parseInt( selSamples.value, 10 ) * place.tilesY;

		if ( googleMap.map ) { CLK.setCenterInit(); }

	}