
	var MAP;

	COR.getMenuPlugins = function() {

		return SEL.getMenuDetailsSelectFile() +
			OVR.getMenuDetailsOverlay() + 
			TER.getMenuDetailsTerrain();

	};

	SEL.onLoadJSONFile = function() {

		COR.place = SEL.fileJSON;
		var place = COR.place;
		place.name = SEL.fileName;

		THR.scene = new THREE.Scene();

		axisHelper = new THREE.AxisHelper( 90 );
		THR.scene.add( axisHelper );

		COR.getPlaceDefaults();

console.log( 'loaded', place );

		inpVertical.value = place.verticalScale;
		inpVertical.max = 3 * place.verticalScale;
		outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

		selMapZoom.selectedIndex = place.deltaOverlay;

		MAP = {};

		MAP.min = COR.arrayMin( place.elevations );
		MAP.max = COR.arrayMax( place.elevations );

		ULlat = tile2lat( place.ULtileY, place.zoom );
		ULlon = tile2lon( place.ULtileX, place.zoom );

		LRlat = tile2lat( place.ULtileY + place.tilesY, place.zoom );
		LRlon = tile2lon( place.ULtileX + place.tilesX, place.zoom );

		deltaLat = ULlat - LRlat;
		deltaLon = LRlon - ULlon;

		MAP.deltaLonTile = deltaLon / place.tilesX;
		MAP.deltaLatTile = deltaLat / place.tilesY;

		MAP.cenLat = LRlat + 0.5 * ( ULlat - LRlat );
		MAP.cenLon = ULlon + 0.5 * ( LRlon - ULlon );

		menuDetailsTerrainParameters.innerHTML = TER.setMenuDetailsTerrain();

		initMapGeometry();

	}



	function initMapGeometry() {

		var place = COR.place;
		var vertices;

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

		drawMapOverlay();

console.timeEnd( 'timer0' );

	}


	function drawMapOverlay( updateCamera ) {

		var place = COR.place;
		var baseURL, count;
		var texture, tilesTotal;

		if ( selMap.selectedIndex > 8 ) {

			MAP.material = new THREE.MeshNormalMaterial( { side: 2 } );

			drawMap( updateCamera );

			return;

		}

		OVR.getMapOverlayParameters();

		baseURL = COR.place.mapTypes[ selMap.selectedIndex ][ 1 ];

		for ( var x = MAP.ULtileXOverlay; x < MAP.ULtileXOverlay + MAP.tilesXOverlay; x++ ) {

			for ( var y = MAP.ULtileYOverlay; y < MAP.ULtileYOverlay + MAP.tilesYOverlay; y++ ) {

				if ( selMap.selectedIndex < 4 ) {

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

						drawMap()

					}

				};

			}

	}

	function drawMap() {

		MAP.mesh = new THREE.Mesh( MAP.geometry, MAP.material );
//		MAP.mesh.name = place.origin;

		THR.scene.add( MAP.mesh );

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

		THR.viewObject( MAP.mesh );

	}

