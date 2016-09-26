
	var tiles = {};

	function getMenuDetailsTilesData() {

		menuDetailsTilesData =

			'<details open>' +

			'<summary><h3>Get tile data</h3></summary>' +

			'<small>Information on current map</small>' +

				'<details>' +

					'<summary><h4>center tile data</h4></summary>' +
					'<div id=divCenterTilesData ></div>' +

				'</details>' +

				'<details>' +

					'<summary><h4>sample tile</h4></summary>' +
					'<div id=divSampleTile ></div>' +

				'</details>' +

				'<details>' +

					'<summary><h4>tiles data</h4></summary>' +
					'<div id=divTilesData ></div>' +

				'</details>' +

			'</details>' + 

		b;

		return menuDetailsTilesData;

	}

	function getTiles() {

//console.log( 'tiles', tiles );

		var p, t, boundary, marker;

		p = place;
		t = tiles;

		t.samples = selSamples.valueAsNumber;

		t.cenTileX = lon2tile( p.longitude, p.zoom );
		t.cenTileY = lat2tile( p.latitude, p.zoom );

		t.offsetX = Math.floor( 0.5 * p.tilesX );
		t.offsetY = Math.floor( 0.5 * p.tilesY );

		t.cenULlat = tile2lat( t.cenTileY + t.offsetX, p.zoom );
		t.cenULlon = tile2lon( t.cenTileX + t.offsetY, p.zoom );

		t.cenLRlat = tile2lat( t.cenTileY - t.offsetY + ( p.tilesY % 2 ? 1 : 0 ), p.zoom );
		t.cenLRlon = tile2lon( t.cenTileX - t.offsetX + ( p.tilesX % 2 ? 1 : 0 ), p.zoom );

		t.cenLat = t.cenLRlat + 0.5 * ( t.cenULlat - t.cenLRlat );
		t.cenLon = t.cenULlon + 0.5 * ( t.cenLRlon - t.cenULlon );


// https://en.wikipedia.org/wiki/Earth_radius#Polar_radius

		var equatoriaCircumferenceLocal = pi2 * 6378137 * Math.cos( p.latitude * d2r );
		var meridionalCircumference = pi2 * 6356752.3;

		var mDegLat = meridionalCircumference / 360;
		var mDegLon = equatoriaCircumferenceLocal  / 360;

		var mTileLat = meridionalCircumference / Math.pow( 2, p.zoom );
		var mTileLon = equatoriaCircumferenceLocal / Math.pow( 2, p.zoom );

		divCenterTilesData.innerHTML =

			'Location latitude : ' + p.latitude.toFixed( 4 ) + '&deg;' + b +
			'Location longitude: ' + p.longitude.toFixed( 4 ) + '&deg;' + b + b +
			'Zoom: ' + p.zoom + b + b +

			'Tiles width : ' + p.tilesX + b +
			'Tiles height: ' + p.tilesY + b + b +

			'Samples width: ' + p.samplesX + b +
			'Samples height: ' + p.samplesY + b + b +

			'Tile X: ' + t.cenTileX + b +
			'Tile Y: ' + t.cenTileY + b + b +

			'UL lat: ' + t.cenULlat.toFixed( 4 ) + '&deg;' + b +
			'LR lat: ' + t.cenLRlat.toFixed( 4 ) + '&deg;' + b +
			'UL lon: ' + t.cenULlon.toFixed( 4 ) + '&deg;' + b +
			'LR lon: ' + t.cenLRlon.toFixed( 4 ) + '&deg;' + b + b +

			'&Del;lat: ' + ( t.cenULlat - t.cenLRlat ).toFixed( 3 ) + '&deg;' + b +
			'&Del;lon: ' + ( t.cenULlon - t.cenLRlon ).toFixed( 3 ) + '&deg;' + b + b +

			'Center latitude: ' + t.cenLat.toFixed( 4 ) + '&deg;' + b +
			'Center longitude: ' + t.cenLon.toFixed( 4 ) + '&deg;' + b + b +

			'Meters/degree latitude : ' + Math.round( mDegLat ).toLocaleString() + b +
			'Meters/degree longitude: ' + Math.round( mDegLon ).toLocaleString() + b + b +

			'Meters/tile latitude : ' + Math.round( mTileLat ).toLocaleString() + b +
			'Meters/tile longitude: ' + Math.round( mTileLon ).toLocaleString() + b + b +

			'Meters/' + p.tilesX + ' tiles latitude : ' + Math.round( mTileLat * p.tilesX ).toLocaleString() + b +
			'Meters/' + p.tilesY + ' tiles longitude: ' + Math.round( mTileLon * p.tilesY ).toLocaleString() + b + b +

			'Meters/sample (' + t.samples + '/tile) lat: ' + Math.round( ( meridionalCircumference / Math.pow( 2, p.zoom ) ) * p.tilesY / p.samplesY ).toLocaleString() + b +
			'Meters/sample (' + t.samples + '/tile) lon: ' + Math.round( ( equatoriaCircumferenceLocal / Math.pow( 2, p.zoom ) ) * p.tilesX / p.samplesX ).toLocaleString() + b +

		'';

//		boundary = drawTileBoundary( t.cenULlat, t.cenULlon, t.cenLRlat, t.cenLRlon, '#0000ff' );

//		googleMap.markings.push( boundary );

		marker = new google.maps.Marker({

			position: {lat: t.cenLat, lng: t.cenLon } ,
			map: googleMap.map

		});

		googleMap.markings.push( marker );
//

		source = 'http://c.tile.opencyclemap.org/cycle/' + p.zoom + '/' + t.cenTileX + '/' + t.cenTileY + '.png';

		divSampleTile.innerHTML =

			'<img src=' + source + ' >' + b +
			'<a href=' + source + ' >' + source.slice( 7 ) + '</a>' +

		b;

//

		drawTilesOnMap();

		getMenuDetailsTilesData();


		function drawTilesOnMap() {

			var ULlat, ULlon, LRlat, LRlon, boundary;

			for ( var x = 0; x < p.tilesX; x++ ) {

				for ( var y = 0; y < p.tilesY; y++ ) {

					ULlat = tile2lat( t.cenTileY + y - t.offsetY, p.zoom );
					ULlon = tile2lon( t.cenTileX + x - t.offsetX, p.zoom );

					LRlat = tile2lat( t.cenTileY + y - t.offsetY + 1, p.zoom );
					LRlon = tile2lon( t.cenTileX + x - t.offsetX + 1, p.zoom );

					boundary = drawTileBoundary( ULlat, ULlon, LRlat, LRlon, '#ff0000' );

					googleMap.markings.push( boundary );

				}

			}

		}


		function getMenuDetailsTilesData() {

			var marker;

			t.ULlat = tile2lat( t.cenTileY - t.offsetY, p.zoom );
			t.ULlon = tile2lon( t.cenTileX - t.offsetX, p.zoom );

			t.LRlat = tile2lat( t.cenTileY + t.offsetY + ( p.tilesY % 2 ? 1 : 0 ), p.zoom );
			t.LRlon = tile2lon( t.cenTileX + t.offsetX + ( p.tilesX % 2 ? 1 : 0 ), p.zoom );

			t.LRtileX = ( t.cenTileX - t.offsetX + p.tilesX );
			t.LRtileY = ( t.cenTileY - t.offsetY + p.tilesY );

			t.ULtileX = ( t.cenTileX - t.offsetX );
			t.ULtileY = ( t.cenTileY - t.offsetY );

			p.ULtileX = t.ULtileX;
			p.ULtileY = t.ULtileY;

			divTilesData.innerHTML =

				'UL TileY: ' + t.ULtileY + ' Lat: ' + t.ULlat.toFixed( 4 ) + '&deg;' + b +
				'LR TileY: ' + t.LRtileY + ' Lat: ' + t.LRlat.toFixed( 4 ) + '&deg;' + b +

				'UL TileX: ' + t.ULtileX + ' Lon: ' + t.ULlon.toFixed( 4 ) + '&deg;' + b +
				'LR TileX: ' + t.LRtileX + ' Lon: ' + t.LRlon.toFixed( 4 ) + '&deg;' +

			b;

			marker = new google.maps.Marker({

				icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
				title: 'lat: ' + t.ULlat.toFixed( 4 ) + ', lng: ' + t.ULlon.toFixed( 4 ),
				position: {lat: parseFloat( t.ULlat.toFixed( 4 ) ), lng: parseFloat( t.ULlon.toFixed( 4 ) )  },
				map: googleMap.map

			});

			googleMap.markings.push( marker );

			marker = new google.maps.Marker({

				icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
				title: 'lat: ' + t.LRlat.toFixed( 4 ) + ', lng: ' + t.LRlon.toFixed( 4 ),
				position: {lat: parseFloat( t.LRlat.toFixed( 4 ) ), lng: parseFloat( t.LRlon.toFixed( 4 ) )  },
				map: googleMap.map

			});

			googleMap.markings.push( marker );

		}

	}


// drawing on map

	function drawPline( pline, gMap, color, width ) {

		var polyline;

		polyline  = new google.maps.Polyline({

			path: pline,
			strokeColor: color,
			opacity: 0.1,
			strokeWeight: width || 1,
			map: gMap

		});

		return polyline;

	}


	function drawTileBoundary( ULlat, ULlon, LRlat, LRlon, color ) {

		var tileCoordinates, tilePath;

		tileCoordinates = [
			{ lat: ULlat, lng: ULlon },
			{ lat: ULlat, lng: LRlon },
			{ lat: LRlat, lng: LRlon },
			{ lat: LRlat, lng: ULlon },
			{ lat: ULlat, lng: ULlon }
		];

		tilePath = new google.maps.Polyline( {

			path: tileCoordinates,
//			fillOpacity: 0.075,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 2
		} );

		tilePath.setMap( googleMap.map );

		return tilePath;

	}
