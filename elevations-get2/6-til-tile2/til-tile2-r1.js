
	var TIL = TIL || {};

	TIL.tiles = {};

	var pi = Math.PI, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;


//		TIL.getMenuDetailsTilesData() +

//		TILtilesDataDetails.setAttribute('open', 'open');

	TIL.getMenuDetailsTilesData = function() {

		var menuDetailsTilesData =

			'<details id=TILtilesDataDetails >' +

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

				'</details>' + b +

			'</details>' +

		'';

		return menuDetailsTilesData;

	}

	TIL.getTilesData = function() {

//console.log( 'tiles', tiles );

		var p, t, boundary, marker;

		p = COR.place;
		t = TIL.tiles;

		p.samples = parseInt( selSamples.value, 10 );

		t.cenTileX = TIL.lon2tile( p.longitude, p.zoom );
		t.cenTileY = TIL.lat2tile( p.latitude, p.zoom );

		t.offsetX = Math.floor( 0.5 * p.tilesX );
		t.offsetY = Math.floor( 0.5 * p.tilesY );

//		t.cenULlat = TIL.tile2lat( t.cenTileY + t.offsetY, p.zoom );
//		t.cenULlon = TIL.tile2lon( t.cenTileX + t.offsetX, p.zoom );

//		t.cenLRlat = TIL.tile2lat( t.cenTileY - t.offsetY + ( p.tilesY % 2 ? 1 : 0 ), p.zoom );
//		t.cenLRlon = TIL.tile2lon( t.cenTileX - t.offsetX + ( p.tilesX % 2 ? 1 : 0 ), p.zoom );

		t.cenULlat = TIL.tile2lat( t.cenTileY, p.zoom );
		t.cenULlon = TIL.tile2lon( t.cenTileX, p.zoom );

		t.cenLRlat = TIL.tile2lat( t.cenTileY + t.offsetY, p.zoom );
		t.cenLRlon = TIL.tile2lon( t.cenTileX + t.offsetX, p.zoom );

		p.latitudeCenter = t.cenLRlat + 0.5 * ( t.cenULlat - t.cenLRlat );
		p.longitudeCenter = t.cenULlon + 0.5 * ( t.cenLRlon - t.cenULlon );


// https://en.wikipedia.org/wiki/Earth_radius#Polar_radius

		var equatoriaCircumferenceLocal = pi2 * 6378137 * Math.cos( p.latitude * d2r );
		var meridionalCircumference = pi2 * 6356752.3;

		var mDegLat = meridionalCircumference / 360;
		var mDegLon = equatoriaCircumferenceLocal  / 360;

		var mTileLat = meridionalCircumference / Math.pow( 2, p.zoom );
		var mTileLon = equatoriaCircumferenceLocal / Math.pow( 2, p.zoom );

		p.latitudeDelta = t.cenULlat - t.cenLRlat;
		p.longitudeDelta = t.cenULlon - t.cenLRlon;

		divCenterTilesData.innerHTML =

			'Location latitude : ' + p.latitude.toFixed( 4 ) + '&deg;' + b +
			'Location longitude: ' + p.longitude.toFixed( 4 ) + '&deg;' + b + b +
			'Zoom: ' + p.zoom + b + b +

			'Tiles width : ' + p.tilesX + b +
			'Tiles height: ' + p.tilesY + b + b +

			'Samples width: ' + ( p.samples * p.tilesX ) + b +
			'Samples height: ' + ( p.samples * p.tilesY ) + b + b +

			'Tile X: ' + t.cenTileX + b +
			'Tile Y: ' + t.cenTileY + b + b +

			'UL lat: ' + t.cenULlat.toFixed( 4 ) + '&deg;' + b +
			'LR lat: ' + t.cenLRlat.toFixed( 4 ) + '&deg;' + b +
			'UL lon: ' + t.cenULlon.toFixed( 4 ) + '&deg;' + b +
			'LR lon: ' + t.cenLRlon.toFixed( 4 ) + '&deg;' + b + b +

			'&Del;lat: ' + Math.abs( p.latitudeDelta ).toFixed( 3 ) + '&deg;' + b +
			'&Del;lon: ' + Math.abs( p.longitudeDelta ).toFixed( 3 ) + '&deg;' + b + b +

			'Center latitude: ' + p.latitudeCenter.toFixed( 4 ) + '&deg;' + b +
			'Center longitude: ' + p.longitudeCenter.toFixed( 4 ) + '&deg;' + b + b +

			'Meters/degree latitude : ' + Math.round( mDegLat ).toLocaleString() + b +
			'Meters/degree longitude: ' + Math.round( mDegLon ).toLocaleString() + b + b +

			'Meters/tile latitude : ' + Math.round( mTileLat ).toLocaleString() + b +
			'Meters/tile longitude: ' + Math.round( mTileLon ).toLocaleString() + b + b +

			'Meters/' + p.tilesX + ' tiles latitude : ' + Math.round( mTileLat * p.tilesX ).toLocaleString() + b +
			'Meters/' + p.tilesY + ' tiles longitude: ' + Math.round( mTileLon * p.tilesY ).toLocaleString() + b + b +

			'Meters/sample (' + p.samples + '/tile) lat: ' + Math.round( mTileLat / p.samples ).toLocaleString() + b +
			'Meters/sample (' + p.samples + '/tile) lon: ' + Math.round( mTileLon / p.samples ).toLocaleString() + b +

		'';

//		boundary = drawTileBoundary( t.cenULlat, t.cenULlon, t.cenLRlat, t.cenLRlon, '#0000ff' );

//		API.markings.push( boundary );

		marker = new google.maps.Marker({

			position: { lat: p.latitude, lng: p.longitude } ,
			map: API.map

		});

		API.markings.push( marker );
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

					ULlat = TIL.tile2lat( t.cenTileY + y - t.offsetY, p.zoom );
					ULlon = TIL.tile2lon( t.cenTileX + x - t.offsetX, p.zoom );

					LRlat = TIL.tile2lat( t.cenTileY + y - t.offsetY + 1, p.zoom );
					LRlon = TIL.tile2lon( t.cenTileX + x - t.offsetX + 1, p.zoom );

					boundary = TIL.drawTileBoundary( ULlat, ULlon, LRlat, LRlon, '#ff0000' );

					API.markings.push( boundary );

				}

			}

		}


		function getMenuDetailsTilesData() {

			var marker;

			t.ULlat = TIL.tile2lat( t.cenTileY - t.offsetY, p.zoom );
			t.ULlon = TIL.tile2lon( t.cenTileX - t.offsetX, p.zoom );

			t.LRlat = TIL.tile2lat( t.cenTileY + t.offsetY + ( p.tilesY % 2 ? 1 : 0 ), p.zoom );
			t.LRlon = TIL.tile2lon( t.cenTileX + t.offsetX + ( p.tilesX % 2 ? 1 : 0 ), p.zoom );

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
				map: API.map

			});

			API.markings.push( marker );

			marker = new google.maps.Marker({

				icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
				title: 'lat: ' + t.LRlat.toFixed( 4 ) + ', lng: ' + t.LRlon.toFixed( 4 ),
				position: {lat: parseFloat( t.LRlat.toFixed( 4 ) ), lng: parseFloat( t.LRlon.toFixed( 4 ) )  },
				map: API.map

			});

			API.markings.push( marker );

		}

	}



	TIL.drawTileBoundary = function( ULlat, ULlon, LRlat, LRlon, color ) {

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

		tilePath.setMap( API.map );

		return tilePath;

	}



// utils

// Source http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29

	TIL.lon2tile = function( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}

	TIL.lat2tile = function( lat, zoom ) {

		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}

	TIL.tile2lon = function( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	TIL.tile2lat = function( y, zoom ) {

		var n = pi - 2 * pi * y / Math.pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));

	}


