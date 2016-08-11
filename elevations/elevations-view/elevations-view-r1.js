// 2016-08-10

// R10.1

//	var defaultFile = '../elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';
//	var defaultFile = 'https://jaanga.github.io/terrain3/elevations/elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';
	var defaultFile; // if no default, select a random file

//	location.hash = 'file=https://jaanga.github.io/terrain3/elevations/elevations-data-03/tenzing-hillary-airport-lukla-nepal_12_3033_1718_3_4_510_680_.txt';

	var verticalScale = 0.00002;
	var plainOpacity = 0.5;
	var deltaOverlay= 1;


	var fogNear = 0.5;
	var fogFar = 1;
	var backgroundColor = 0x7ec0ee ;

	var map;

	var mapTypes = [

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

	var urlAPITreeContents = 'https://api.github.com/repos/jaanga/terrain3/git/trees/gh-pages?recursive=1';

	var urlBase = 'https://jaanga.github.io/terrain3/elevations/elevations-data-03/';
//	var urlBase = '../elevations-data-03/';

	var searchInFolder = 'elevations-data-03/';


	var updateCamera = true; // is this needed?
	var pixelsPerTile = 256;

	var b = '<br>';
	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };


	function initMapViewMenu() {

		if ( location.hash && location.hash.match( 'file=' ) ) {

			start = location.hash.indexOf( 'file=' ) + 5;
			end = location.hash.indexOf( '.txt' ) + 4;

			defaultFile = location.hash.slice( start, end );

		}

		setMenuDetailsAPIKey();

		setMenuDetailsSelectFile();

		setMenuDetailsOverlay();

		setMenuDetailsTerrain();

// default action here

		getGitHubAPITreeContents( onGitHubTreeLoad );

		function onGitHubTreeLoad() {

// map could have beec created by iframe parent

			if ( map === undefined ) {

// add location.hash
// add selFiles update

				file = defaultFile ? defaultFile : urlBase + selFiles.value;

				selFiles.selectedIndex = defaultFile ? 0 : selFiles.selectedIndex;

				getElevationsFileXHR( file );

			}

		}

	}

// inits

	function setMenuDetailsAPIKey() {

		menuDetailsAPIKey.innerHTML =

			'<details>' +
				'<summary><h3>api key</h3></summary>' +
				'<small>If small request, no need for API key</small>' +
				'<p>api key: <input id=inpAPI onclick=this.select(); title="Obtain API key from Google Maps" ></p>' +
				'<p><button onclick=setAPIkey(); >Set API key</button></p>' +
			'</details>' + b;

		function setAPIkey() {

			script = document.body.appendChild( document.createElement('script') );
			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + inpAPI.value;

		}

	}

	function setMenuDetailsSelectFile() {

		menuDetailsSelectFile.innerHTML = 

		'<details open >' +
			'<summary><h3>Select file to view</h3></summary>' +
			'<small>Select or open a file to view in 3D</small>' +
			'<p>' +
				'<select id=selFiles onchange=file=urlBase+this.value;getElevationsFileXHR(file); size=12 style=width:100%; >' +
					'<option>Select a file</option></select>' +
			'</p>' +
			'<p><input type=file id=inpFile onchange=getElevationsFileReader(this); /></p>' +

			'<details>' +

				'<summary><h4>file name parameters</h4></summary>' +

				'<div id=menuDetailsFileNameParameters >cccc</div>' +

			'</details>' + b +

		'</details>';

	}

	function setMenuDetailsOverlay() {

		menuDetailsOverlay.innerHTML =

			'<details open >' +
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


		for ( i = 0; i < mapTypes.length; i++ ) {

			selMap.appendChild( document.createElement( 'option' ) );
			selMap.children[ i ].text = mapTypes[ i ][ 0 ];

		}

		selMap.selectedIndex = 2;

		for ( var i = 0; i < 4; i++ ) {

			selMapZoom.appendChild( document.createElement( 'option' ) );
			selMapZoom.children[ i ].text = + i;

		}

	}

	function setMenuDetailsTerrain() {

		menuDetailsTerrain.innerHTML = 

			'<details open >' +
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

	}

	function setMenuDetailsFileNameParameters() {

		menuDetailsFileNameParameters.innerHTML =

			'Location:<br>' + map.origin + b + b +

			'Zoom level: ' + map.zoom + b + b +

			'Samples X: ' + map.samplesX + b +
			'Samples Y: ' + map.samplesY + b + b +

			'UL tile X: ' + map.ULtileX + b +
			'UL tile Y: ' + map.ULtileY + b + b +

			'Tiles X: ' + map.tilesX + b +
			'Tiles Y: ' + map.tilesY + b +

		b;

	}


// Gather data when using the default

	function getElevationsFileXHR( fName ) {

console.time( 'timer0' );

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', fName, true );
		xhr.onload = function callback() {

			map = JSON.parse( xhr.responseText );
			onLoadElevations();

		}

		xhr.send( null );

	}

// gather the data using file open dialog

	function getElevationsFileReader( files ) { 

console.time( 'timer0' );

		var reader;

		reader = new FileReader();
		reader.onloadend = function( event ) {

			map = JSON.parse( reader.result );
			onLoadElevations();

		};

		reader.readAsText( files.files[ 0 ] );

	}

	function onLoadElevations() {

			scene = new THREE.Scene();

			toggleFog();

// console.log( 'map.verticalScale', map );

			map.verticalScale = map.verticalScale ? map.verticalScale : verticalScale;

			inpVertical.value =  100000 * map.verticalScale;
			inpVertical.max =  300000 * map.verticalScale;
			outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

			map.plainOpacity = map.plainOpacity ? map.plainOpacity : plainOpacity;

			map.fogNear = map.fogNear ? map.fogNear : fogNear;
			map.fogFar = map.fogFar ? map.fogFar : fogFar;

			map.pixelsPerTile = pixelsPerTile;
			map.deltaOverlay = map.deltaOverlay ? map.deltaOverlay : deltaOverlay;

			selMapZoom.selectedIndex = map.deltaOverlay;

			setMenuDetailsFileNameParameters();

			initElevations();

			otherInits();

	}


	function otherInits() {};


// start second stage of processing

	function initElevations() {

		var LRlat, LRlon, deltaLat, deltaLon, deltaLatTile;
		map.mesh = new THREE.Object3D();

// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values

		map.min = arrayMin( map.elevations );
		map.max = arrayMax( map.elevations );

//		inpVertical.value = map.verticalScale ;
//		inpVertical.max = 3 * map.verticalScale ;

		ULlat = tile2lat( map.ULtileY, map.zoom );
		ULlon = tile2lon( map.ULtileX, map.zoom );

		LRlat = tile2lat( map.ULtileY + map.tilesY, map.zoom );
		LRlon = tile2lon( map.ULtileX + map.tilesX, map.zoom );

		deltaLat = ULlat - LRlat;
		deltaLon = LRlon - ULlon;

		map.deltaLonTile = deltaLon / map.tilesX;
		map.deltaLatTile = deltaLat / map.tilesY;

		map.cenLat = LRlat + 0.5 * ( ULlat - LRlat );
		map.cenLon = ULlon + 0.5 * ( LRlon - ULlon );

		initMapGeometry();
		drawMapOverlay( true );

		menuDetailsTerrainParameters.innerHTML =

			'Number of data points: ' + map.elevations.length.toLocaleString() + b + b +

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

		map.geometry = new THREE.PlaneBufferGeometry( map.deltaLonTile * map.tilesX, map.deltaLatTile * map.tilesY, map.samplesX - 1, map.samplesY - 1 );

		vertices = map.geometry.attributes.position.array;

		for ( var i = 2, j = 0; j < map.elevations.length; i += 3, j++ ) {

			vertices[ i ] = map.elevations[ j ];

		}

//		scale = map.verticalScale / ( map.max - map.min );

		map.geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, map.verticalScale ) );

		map.geometry.computeFaceNormals();
		map.geometry.computeVertexNormals();

//		outVertical.value = ( 100000 * map.verticalScale );

	}


// Good to go. Send to the screen

	function drawMapOverlay( updateCamera ) {

		var baseURL, count;
		var texture, tilesTotal;

		map.deltaOverlay = selMapZoom.selectedIndex;

		if ( selMap.selectedIndex > 8 ) {

			map.material = new THREE.MeshNormalMaterial( { side: 2 } );

			drawMap( updateCamera );

			return;

		}

		getMapOverlayParameters();

		baseURL = mapTypes[ selMap.selectedIndex ][ 1 ];

		for ( var x = map.ULtileXOverlay; x < map.ULtileXOverlay + map.tilesXOverlay; x++ ) {

			for ( var y = map.ULtileYOverlay; y < map.ULtileYOverlay + map.tilesYOverlay; y++ ) {

				if ( selMap.selectedIndex < 4 ) {

					loadImage( x + '&y=' + y + '&z=' + map.zoomOverlay, x - map.ULtileXOverlay, y - map.ULtileYOverlay );

				} else {

					loadImage( map.zoom + '/' + x + '/' + y + '.png', x - map.ULtileXOverlay , y - map.ULtileYOverlay );

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

						map.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: 2 } );

						drawMap( updateCamera );

					}

				};

			}

	}

	function getMapOverlayParameters() {

		var delta;

		delta = map.deltaOverlay;

		map.zoomOverlay = delta + map.zoom;
		map.ULtileXOverlay = Math.pow( 2, delta ) * map.ULtileX;
		map.ULtileYOverlay = Math.pow( 2, delta ) * map.ULtileY;
		map.tilesXOverlay = Math.pow( 2, delta ) * map.tilesX;
		map.tilesYOverlay = Math.pow( 2, delta ) * map.tilesY;

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
		map.mesh.name = map.origin;
		map.mesh.position.set( map.cenLon, map.cenLat, 0 );
		scene.add( map.mesh );

		map.boxHelper = new THREE.BoxHelper( map.mesh, 0xff0000 );
		map.boxHelper.name = 'boxHelper';
		scene.add( map.boxHelper );
//		map.boxHelper.visible = false;

		geometry = new THREE.PlaneBufferGeometry( 1, 1 );
//		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -1.5707 ) );
//		material = new THREE.MeshBasicMaterial( { color: 0x223322, specular: 0x222222, shininess: 0.5, side: 2 } );
		material = new THREE.MeshBasicMaterial( { color: 0x223322, opacity: map.plainOpacity, side: 2, transparent: true } );

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

		map.verticalScale = 0.00001 * inpVertical.valueAsNumber;

		outVertical.value = inpVertical.valueAsNumber.toFixed( 1 );

		initMapGeometry();

		drawMapOverlay();

		setCamera();

		otherInits();

	}

	function setCamera() {

		var cameraPosition;

		map.radius = map.boxHelper.geometry.boundingSphere.radius;

		cameraPosition = 0.7 * map.radius;

		controls.target.copy( map.boxHelper.geometry.boundingSphere.center );
		controls.maxDistance = 3 * map.radius;

		camera.position.copy( map.boxHelper.geometry.boundingSphere.center ).add( v( 0, -cameraPosition, cameraPosition ) );

	}

	function toggleFog() {

		if ( chkFog.checked === true ) {

			scene.fog = new THREE.Fog( 0x7ec0ee, map.fogNear, map.fogFar );

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


// coding utilities

// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values

	function arrayMin( arr ) {

		var len = arr.length, min = Infinity;

		while ( len-- ) {

			if ( arr[ len ] < min) { min = arr[ len ]; }

		}

		return min;

	}

	function arrayMax( arr ) {

		var len = arr.length, max = -Infinity;

		while ( len-- ) {

			if (arr[len] > max) { max = arr[len]; }

		}

		return max;

	}


// TMS
// Source http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29

	function lon2tile( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}

	function lat2tile( lat, zoom ) {

		var pi = Math.PI;
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}

	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {

		var pi = Math.PI;
		var n = pi - 2 * pi * y / Math.pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));

	}
