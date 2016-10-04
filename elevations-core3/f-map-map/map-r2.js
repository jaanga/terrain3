
	var MAP = MAP || {};


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

		MAP.geometry = new THREE.PlaneBufferGeometry( MAP.deltaLonTile * place.tilesX, MAP.deltaLatTile * place.tilesY, place.samplesX - 1, place.samplesY - 1 );

		vertices = MAP.geometry.attributes.position.array;

		for ( var i = 2, j = 0; j < place.elevations.length; i += 3, j++ ) {

//			vertices[ i ] = place.elevations[ j ] * place.verticalScale / 111111;
			vertices[ i ] = place.elevations[ j ] / 111111;

		}

		MAP.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05) );

//		MAP.geometry.center();
//		MAP.geometry.computeFaceNormals();
//		MAP.geometry.computeVertexNormals();

		MAP.drawMapOverlay();

console.timeEnd( 'timer0' );

	}


	MAP.drawMapOverlay = function( updateCamera ) {

		var place = COR.place;
		var baseURL, count;
		var texture, tilesTotal;

		if ( OVRselMap.selectedIndex > 8 ) {

			MAP.material = new THREE.MeshNormalMaterial( { side: 2 } );

			MAP.geometry.computeFaceNormals();
			MAP.geometry.computeVertexNormals();

			MAP.drawMap( updateCamera );

			return;

		}


		OVR.getMapOverlayParameters();

		baseURL = COR.mapTypes[ OVRselMap.selectedIndex ][ 1 ];

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
console.log( 'count', count );
					}

				};

			}

	}



	MAP.drawMap = function() {

		var place, geometry, material;
		place = COR.place

		THR.scene.remove( MAP.mesh, MAP.boxHelper, MAP.groundPlane );

		MAP.mesh = new THREE.Mesh( MAP.geometry, MAP.material );
		MAP.mesh.position.set( MAP.cenLon, 0, -MAP.cenLat );
		MAP.mesh.scale.y = place.verticalScale;
		MAP.mesh.name = place.origin;
		THR.scene.add( MAP.mesh );

		MAP.boxHelper = new THREE.BoxHelper( MAP.mesh, 0xff0000 );
		MAP.boxHelper.name = 'boxHelper';
		THR.scene.add( MAP.boxHelper );
		MAP.boxHelper.visible = TERchkBoxHelper.checked;

		geometry = new THREE.PlaneBufferGeometry( 3, 3 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -pi05 ) );

		material = new THREE.MeshBasicMaterial( { color: 0x223322, opacity: place.plainOpacity, side: 2, transparent: true } );

		MAP.groundPlane = new THREE.Mesh( geometry, material );
		MAP.groundPlane.name = 'groundPlane';
		MAP.groundPlane.position.set( MAP.cenLon, - MAP.boxHelper.geometry.attributes.position.array[ 1 ], -MAP.cenLat ); // sea level
		MAP.groundPlane.visible = TERchkGroudPlane.checked;

		THR.scene.add( MAP.groundPlane );

		if ( THR.updateCamera === true && !CAS.center ) { THR.viewObject( MAP.mesh ); }


		if ( CAS.center ) { 

//			CAS.center = MAP.mesh.position.clone(); 
			CAS.cameraTrack();

		} else {

console.log( 'no cas', 23 );

		}

		if ( TERchkFog.checked === true ) { THR.toggleFog( true ) }


// could be called by HTML file ?
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

		if ( place.placards && PLA.drawPlacePlacards ) {

			PLA.drawPlacePlacards();

		}

		if ( place.nearby && PLA.drawPlaceNearby ) {

			PLA.drawPlaceNearby();

		}

		if ( TER.setMenuDetailsTerrain ) {

			menuDetailsTerrainParameters.innerHTML = TER.setMenuDetailsTerrain();

		}

//		place.latitude = MAP.cenLat;
//		place.longitude = MAP.cenLon;
		place.min = MAP.min;
		place.max = MAP.max;

	}

