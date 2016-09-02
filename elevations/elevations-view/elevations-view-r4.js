// 2016-08-25

// R4

	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

//	location.hash = 'file=https://jaanga.github.io/terrain3/elevations/elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';

//	var defaultFile = '../elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';
//	var defaultFile = 'https://jaanga.github.io/terrain3/elevations/elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';
	var defaultFile; // if no default, select a random file

	var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

	var searchInFolder = 'elevations-data-03/';
//	var searchInFolder = 'elevations-data-family+friends/';

	var urlBase = 'https://jaanga.github.io/terrain3/elevations/' + searchInFolder;
//	var urlBase = '../elevations-data-03/' + searchInFolder;

	var updateCamera = true; // is this needed?

	var place;

	var map = {};
	map.pixelsPerTile = 256;

	map.mapTypes = [

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

	function initMapViewMenu() {

		if ( location.hash && location.hash.match( 'file=' ) ) {

			start = location.hash.indexOf( 'file=' ) + 5;
			end = location.hash.indexOf( '.txt' ) + 4;

			defaultFile = location.hash.slice( start, end );

			selFiles.selectedIndex = -1;

		}

		if ( location.hash && location.hash.match( 'cat=' ) ) {

			start = location.hash.indexOf( 'cat=' ) + 4;
			end = location.hash.indexOf( '/' ) + 1;

			searchInFolder = location.hash.slice( start, end );

			urlBase = 'https://jaanga.github.io/terrain3/elevations/' + searchInFolder;

		}

		setMenuDetailsOverlay();

// default action here

		getGitHubAPITreeContents( onGitHubTreeLoad );

		function onGitHubTreeLoad() {

// place may be created by iframe parent

			if ( place === undefined ) {

// add location.hash
// add selFiles update

				file = defaultFile ? defaultFile : urlBase + selFiles.value;

				selFiles.selectedIndex = defaultFile ? 0 : selFiles.selectedIndex;

				getElevationsFileXHR( file );

			}

		}

	}

// inits

	function getMenuDetailsSelectFile() {

		menuDetailsSelectFile =

		'<details id=detailsSelectFile open >' +
			'<summary><h3>Select file to view</h3></summary>' +
			'<small>Select or open a file to view in 3D</small>' +
			'<p>' +
				'<select id=selFiles onchange=file=urlBase+this.value;getElevationsFileXHR(file); size=12 style=width:100%; ></select>' +
			'</p>' +

			'<p><input type=file id=inpFile onchange=getElevationsFileReader(this); /></p>' +

			'<details>' +

				'<summary><h4>file name parameters</h4></summary>' +

				'<div id=menuDetailsFileNameParameters ></div>' +

			'</details>' + b +

		'</details>';

		return menuDetailsSelectFile;

	}

	function getMenuDetailsOverlay() {

		menuDetailsOverlay =

			'<details id=detailsOverlay open >' +
				'<summary><h3>Overlay settings</h3></summary>' +
				'<small>Adjust 2D bitmaps</small>' +

				'<p>Map overlay provider<br><select id=selMap onchange=drawMapOverlay(); size=5 /></select></p>' +

				'<p>' +
					'Map overlay quality' + b +
					'<select id=selMapZoom onchange=drawMapOverlay(); ></select> + zoom level</p>' +

				'<details>' +

					'<summary><h4>overlay parameters</h4></summary>' +
					'<div id=menuDetailsOverlayParameters ></div>' +

				'</details>' +

			'</details>' + b +

		'';

		return menuDetailsOverlay;

	}

	function setMenuDetailsOverlay() {

		for ( i = 0; i < map.mapTypes.length; i++ ) {

			selMap.appendChild( document.createElement( 'option' ) );
			selMap.children[ i ].text = map.mapTypes[ i ][ 0 ];

		}

		selMap.selectedIndex = 2;

		for ( var i = 0; i < 4; i++ ) {

			selMapZoom.appendChild( document.createElement( 'option' ) );
			selMapZoom.children[ i ].text = + i;

		}

	}

	function getMenuDetailsTerrain() {

		menuDetailsTerrain =

			'<details id=detailsTerrain open >' +
				'<summary><h3>Terrain settings</h3></summary>' +
				'<small>Adjust 3D terrain</small>' +

				'<p>Vertical scale: <output id=outVertical >value</output>' +
					'<input type=range id=inpVertical min=0 max=10 step=0.1 value=5 oninput=updateTerrain() title="" style=width:100%; >' +

				'</p>' +

				'<p>' +

					'<input type=checkbox onchange=map.material.wireframe=!map.material.wireframe; > Wireframe' + b +

					'<input type=checkbox onchange=map.plain.visible=!map.plain.visible; checked > Sea level' + b +

					'<input type=checkbox onchange=map.boxHelper.visible=!map.boxHelper.visible; checked > Box helper' + b +

					'<input type=checkbox id=chkFog onchange=toggleFog(); checked > Fog' +

				'</p>' +

				'<details>' +

					'<summary><h4>terrain parameters</h4></summary>' +
					'<div id=menuDetailsTerrainParameters ></div>' +

				'</details>' + b +

			'</details>' +

		'';

		return menuDetailsTerrain;

	}

	function setMenuDetailsFileNameParameters() {

		menuDetailsFileNameParameters.innerHTML =

			'Location:<br>' + place.origin + b + b +

			'Zoom level: ' + place.zoom + b + b +

			'Samples X: ' + place.samplesX + b +
			'Samples Y: ' + place.samplesY + b + b +

			'UL tile X: ' + place.ULtileX + b +
			'UL tile Y: ' + place.ULtileY + b + b +

			'Tiles X: ' + place.tilesX + b +
			'Tiles Y: ' + place.tilesY + b +

		b;

	}


// Gather data when using the default

	function getElevationsFileXHR( fName ) {

console.time( 'timer0' );

		var xhr;
//		place = {};

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', fName, true );
		xhr.onload = function callback() {

			place = JSON.parse( xhr.responseText );
			place.fileName = fName.split( '/' ).pop();

			location.hash = 'file=' + fName;

			onLoadElevations();

		};

		xhr.send( null );

	}

// gather the data using file open dialog

	function getElevationsFileReader( files ) {

console.time( 'timer0' );

		var reader;

		reader = new FileReader();
		reader.onloadend = function( event ) {

			place = JSON.parse( reader.result );
			place.fileName = files.files[ 0 ].name;
			onLoadElevations();

		};

		reader.readAsText( files.files[ 0 ] );

	}

	function onLoadElevations() {

			scene = new THREE.Scene();

			place.deltaOverlay = place.deltaOverlay || defaults.deltaOverlay;

			place.fogNear = place.fogNear || defaults.fogNear;
			place.fogFar = place.fogFar || defaults.fogFar;

			place.plainOpacity = place.plainOpacity || defaults.plainOpacity;

//			place.verticalScale = place.verticalScale || defaults.verticalScale;
			place.verticalScale = defaults.verticalScale;

			inpVertical.value = place.verticalScale;
			inpVertical.max = 3 * place.verticalScale;
			outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );
			selMapZoom.selectedIndex = place.deltaOverlay;

			setMenuDetailsFileNameParameters();

			initElevations();

			toggleFog();

			otherInits();

	}


	function otherInits() {}


// start second stage of processing

	function initElevations() {

		var LRlat, LRlon, deltaLat, deltaLon, deltaLatTile;

//		map = {};
//		map.pixelsPerTile = pixelsPerTile;
		map.mesh = new THREE.Object3D();

// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values

		map.min = arrayMin( place.elevations );
		map.max = arrayMax( place.elevations );

//		inpVertical.value = map.verticalScale ;
//		inpVertical.max = 3 * map.verticalScale ;

		ULlat = tile2lat( place.ULtileY, place.zoom );
		ULlon = tile2lon( place.ULtileX, place.zoom );

		LRlat = tile2lat( place.ULtileY + place.tilesY, place.zoom );
		LRlon = tile2lon( place.ULtileX + place.tilesX, place.zoom );

		deltaLat = ULlat - LRlat;
		deltaLon = LRlon - ULlon;

		map.deltaLonTile = deltaLon / place.tilesX;
		map.deltaLatTile = deltaLat / place.tilesY;

		map.cenLat = LRlat + 0.5 * ( ULlat - LRlat );
		map.cenLon = ULlon + 0.5 * ( LRlon - ULlon );

		initMapGeometry();
		drawMapOverlay( true );

		menuDetailsTerrainParameters.innerHTML =

			'Number of data points: ' + place.elevations.length.toLocaleString() + b + b +

			'Elevation maximum: ' + Math.round( map.max ).toLocaleString() + 'm' + b +
			'Elevation minimum: ' + Math.round( map.min ).toLocaleString() + 'm' +b + b +

//			'Scale: ' + scale.toFixed( 6 ) + b + b +

			'Delta latitude : ' + deltaLat.toFixed( 4 ) + '&deg;' + b +
			'Delta latitude/tile : ' + map.deltaLatTile.toFixed( 4 ) + '&deg;' + b +
			'Delta longitude: ' + deltaLon.toFixed( 4 ) + '&deg;' + b + b +

			'Center latitude : ' + map.cenLat.toFixed( 4 ) + '&deg;' + b +
			'Center longitude: ' + map.cenLon.toFixed( 4 ) + '&deg;' + b +

		b;

	}

	function initMapGeometry() {

		var vertices;

		map.geometry = new THREE.PlaneBufferGeometry( map.deltaLonTile * place.tilesX, map.deltaLatTile * place.tilesY, place.samplesX - 1, place.samplesY - 1 );

		vertices = map.geometry.attributes.position.array;

		for ( var i = 2, j = 0; j < place.elevations.length; i += 3, j++ ) {

			vertices[ i ] = place.elevations[ j ];

		}

//		scale = map.verticalScale / ( map.max - map.min );

//		map.geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, place.verticalScale ) );
		map.geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, place.verticalScale / 111111 ) );

		map.geometry.computeFaceNormals();
		map.geometry.computeVertexNormals();

//		outVertical.value = ( 100000 * map.verticalScale );

	}


// Good to go. Send to the screen

	function drawMapOverlay( updateCamera ) {

		var baseURL, count;
		var texture, tilesTotal;

		if ( selMap.selectedIndex > 8 ) {

			map.material = new THREE.MeshNormalMaterial( { side: 2 } );

			drawMap( updateCamera );

			return;

		}

		getMapOverlayParameters();

		baseURL = map.mapTypes[ selMap.selectedIndex ][ 1 ];

		for ( var x = map.ULtileXOverlay; x < map.ULtileXOverlay + map.tilesXOverlay; x++ ) {

			for ( var y = map.ULtileYOverlay; y < map.ULtileYOverlay + map.tilesYOverlay; y++ ) {

				if ( selMap.selectedIndex < 4 ) {

					loadImage( x + '&y=' + y + '&z=' + map.zoomOverlay, x - map.ULtileXOverlay, y - map.ULtileYOverlay );

				} else {

					loadImage( place.zoom + '/' + x + '/' + y + '.png', x - map.ULtileXOverlay , y - map.ULtileYOverlay );

				}

			}

		}

		texture = new THREE.Texture( map.canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		tilesTotal = map.tilesXOverlay * map.tilesYOverlay;
		count = 0;

			function loadImage( fName, x, y ) {

				var img;

				img = document.createElement( 'img' );
				img.crossOrigin = 'anonymous';
				img.src = baseURL + fName;

				img.onload = function(){

					map.context.drawImage( img, 0, 0, 256, 256, x * map.pixelsPerTile, y * map.pixelsPerTile, map.pixelsPerTile, map.pixelsPerTile );

					count++;

					if ( count === tilesTotal ) {

						map.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: 0 } );

						drawMap( updateCamera );

					}

				};

			}

	}

	function getMapOverlayParameters() {

		var delta;

		place.deltaOverlay = selMapZoom.selectedIndex;
		delta = place.deltaOverlay;

		map.zoomOverlay = delta + place.zoom;
		map.ULtileXOverlay = Math.pow( 2, delta ) * place.ULtileX;
		map.ULtileYOverlay = Math.pow( 2, delta ) * place.ULtileY;
		map.tilesXOverlay = Math.pow( 2, delta ) * place.tilesX;
		map.tilesYOverlay = Math.pow( 2, delta ) * place.tilesY;

		map.canvas = document.createElement( 'canvas' );
		map.context = map.canvas.getContext( '2d' );

		map.canvas.width = map.pixelsPerTile * map.tilesXOverlay;
		map.canvas.height = map.pixelsPerTile * map.tilesYOverlay;

		menuDetailsOverlayParameters.innerHTML =

			'Zoom level: ' + map.zoomOverlay + b + b +

			'UL tile X: ' + map.ULtileXOverlay + b +
			'UL tile Y: ' + map.ULtileYOverlay + b + b +

			'Tiles X: ' + map.tilesXOverlay + b +
			'Tiles Y: ' + map.tilesYOverlay + b + b +

		b;

	}


// Three.js

	function drawMap( updateCamera ) {

		map.mesh = new THREE.Mesh( map.geometry, map.material );
		map.mesh.name = place.origin;
		map.mesh.position.set( map.cenLon, map.cenLat, 0 );
		scene.add( map.mesh );

		map.boxHelper = new THREE.BoxHelper( map.mesh, 0xff0000 );
		map.boxHelper.name = 'boxHelper';
		scene.add( map.boxHelper );
//		map.boxHelper.visible = false;

		geometry = new THREE.PlaneBufferGeometry( 1, 1 );
//		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -1.5707 ) );
//		material = new THREE.MeshBasicMaterial( { color: 0x223322, specular: 0x222222, shininess: 0.5, side: 2 } );
		material = new THREE.MeshBasicMaterial( { color: 0x223322, opacity: place.plainOpacity, side: 2, transparent: true } );

		map.plain = new THREE.Mesh( geometry, material );
		map.plain.name = 'plain';
		map.plain.position.set( map.cenLon, map.cenLat, 0 ); // sea level
		scene.add( map.plain );

		if ( updateCamera === true ) { setCamera(); }

console.timeEnd( 'timer0' );

	}


	function updateTerrain() {

		scene = new THREE.Scene();

		toggleFog();

		place.verticalScale = inpVertical.valueAsNumber;

		outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

		initMapGeometry();

		drawMapOverlay();

		setCamera();

		otherInits();

	}


	function setCamera() {

		var cameraPosition;

		map.radius = map.boxHelper.geometry.boundingSphere.radius;
		map.center = map.boxHelper.geometry.boundingSphere.center;

		controls.target.copy( map.center );
		controls.maxDistance = 3 * map.radius;
//		controls.autoRotate = true;

		cameraPosition = 0.7 * map.radius;
		camera.position.copy( map.center.clone() ).add( v( 0, -cameraPosition, cameraPosition ) );

		postInits();

	}

	function postInits(){}

	function toggleFog() {

		if ( chkFog.checked === true ) {

			scene.fog = new THREE.Fog( 0x7ec0ee, place.fogNear, place.fogFar );

		} else {

			scene.fog.far = 0 ;

		}

	}


// GitHub API

	function getGitHubAPITreeContents( callback ) {

		var xhr, response, files, file;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', urlAPITreeContents, true );
		xhr.onload = onLoadGitHubTreeContents;
		xhr.send( null );

		function onLoadGitHubTreeContents() {

			response = JSON.parse( xhr.response );
			files = [];

			for ( var i = 0; i < response.tree.length; i++ ) {

				file = response.tree[ i ].path;

				if ( file.indexOf( 'archive' ) !== -1 ) { continue; }
				if ( file.indexOf( searchInFolder ) === -1 || file.slice( -4 ) !== '.txt' ) { continue; }

				file = file.split( '\/' ).pop();

				files.push( file );

				selFiles[ selFiles.length ] = new Option( file, file );

			}

			selFiles.selectedIndex = Math.floor( Math.random() * selFiles.length );

			callback();

		}

	}
