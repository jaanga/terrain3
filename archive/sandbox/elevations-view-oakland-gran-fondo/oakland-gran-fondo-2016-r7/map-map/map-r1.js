
	var MAP = MAP || {};


	MAP.onLoadJSONFile = function() {

		MAP.initMapGeometry();

	}



	MAP.initMapGeometry = function() {

		var place = COR.place;
		var vertices;

		MAP.min = COR.arrayMin( place.elevations );
		MAP.max = COR.arrayMax( place.elevations );

		MAP.ULlat = tile2lat( place.ULtileY, place.zoom );
		MAP.ULlon = tile2lon( place.ULtileX, place.zoom );

		MAP.LRlat = tile2lat( place.ULtileY + place.tilesY, place.zoom );
		MAP.LRlon = tile2lon( place.ULtileX + place.tilesX, place.zoom );

		MAP.deltaLat = MAP.ULlat - MAP.LRlat;
		MAP.deltaLon = MAP.LRlon - MAP.ULlon;

		MAP.deltaLonTile = MAP.deltaLon / place.tilesX;
		MAP.deltaLatTile = MAP.deltaLat / place.tilesY;

		MAP.cenLat = MAP.LRlat + 0.5 * ( MAP.ULlat - MAP.LRlat );
		MAP.cenLon = MAP.ULlon + 0.5 * ( MAP.LRlon - MAP.ULlon );

		menuDetailsTerrainParameters.innerHTML = TER.setMenuDetailsTerrain();

		MAP.geometry = new THREE.PlaneBufferGeometry( MAP.deltaLonTile * place.tilesX, MAP.deltaLatTile * place.tilesY, place.samplesX - 1, place.samplesY - 1 );

		vertices = MAP.geometry.attributes.position.array;

		for ( var i = 2, j = 0; j < place.elevations.length; i += 3, j++ ) {

			vertices[ i ] = place.elevations[ j ];

		}

		MAP.geometry.applyMatrix( new THREE.Matrix4().makeScale( 100, 100, 100 * place.verticalScale / 111111 ) );
		MAP.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -1.5707 ) );

		MAP.geometry.computeFaceNormals();
		MAP.geometry.computeVertexNormals();

		MAP.geometry.center();

//		if ( updateCamera === true ) { setCamera(); }

		MAP.drawMapOverlay();

console.timeEnd( 'timer0' );

	}


	MAP.drawMapOverlay = function( updateCamera ) {

		var place = COR.place;
		var baseURL, count;
		var texture, tilesTotal;

		if ( OVRselMap.selectedIndex > 8 ) {

			MAP.material = new THREE.MeshNormalMaterial( { side: 2 } );

			MAP.drawMap( updateCamera );

			return;

		}


		OVR.getMapOverlayParameters();

		baseURL = COR.place.mapTypes[ OVRselMap.selectedIndex ][ 1 ];

		for ( var x = MAP.ULtileXOverlay; x < MAP.ULtileXOverlay + MAP.tilesXOverlay; x++ ) {

			for ( var y = MAP.ULtileYOverlay; y < MAP.ULtileYOverlay + MAP.tilesYOverlay; y++ ) {

				if ( OVRselMap.selectedIndex < 4 ) {

					loadImage( x + '&y=' + y + '&z=' + MAP.zoomOverlay, x - MAP.ULtileXOverlay, y - MAP.ULtileYOverlay );

				} else {

					loadImage( place.zoom + '/' + x + '/' + y + '.png', x - MAP.ULtileXOverlay , y - MAP.ULtileYOverlay );

				}

			}

		}

		texture = new THREE.Texture( MAP.canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		tilesTotal = MAP.tilesXOverlay * MAP.tilesYOverlay;
		count = 0;

			function loadImage( fName, x, y ) {

				var img;

				img = document.createElement( 'img' );
				img.crossOrigin = 'anonymous';
				img.src = baseURL + fName;

				img.onload = function(){

					MAP.context.drawImage( img, 0, 0, 256, 256, x * place.pixelsPerTile, y * place.pixelsPerTile, place.pixelsPerTile, place.pixelsPerTile );

					count++;

					if ( count === tilesTotal ) {

						MAP.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: 2 } );

						MAP.drawMap()

					}

				};

			}

	}

	MAP.drawMap = function() {

		THR.scene.remove( MAP.mesh );

		MAP.mesh = new THREE.Mesh( MAP.geometry, MAP.material );
		MAP.mesh.name = COR.place.origin;

		THR.scene.add( MAP.mesh );

//		THR.viewObject( MAP.mesh );

/*

		MAP.mesh.name = place.origin;
		MAP.mesh.scale.set( 100, 100, 100 );
//		MAP.mesh.position.set( MAP.cenLon, MAP.cenLat, 0 );
		THR.scene.add( MAP.mesh );

		MAP.boxHelper = new THREE.BoxHelper( MAP.mesh, 0xff0000 );
		MAP.boxHelper.name = 'boxHelper';
		THR.scene.add( MAP.boxHelper );
//		MAP.boxHelper.visible = false;


		geometry = new THREE.PlaneBufferGeometry( 300, 300 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -1.5707 ) );
//		material = new THREE.MeshBasicMaterial( { color: 0x223322, specular: 0x222222, shininess: 0.5, side: 2 } );
		material = new THREE.MeshBasicMaterial( { color: 0x223322, opacity: place.plainOpacity, side: 2, transparent: true } );

		MAP.plain = new THREE.Mesh( geometry, material );
		MAP.plain.name = 'plain';
		MAP.plain.position.set( 0, -10, 0 ); // sea level
		THR.scene.add( MAP.plain );
*/



	}

