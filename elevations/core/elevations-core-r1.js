
	var JT3 = {};

	JT3.setCSSGet = function() {

		JT3.cssGet = document.body.appendChild( document.createElement('style') );
		JT3.cssGet.innerHTML =

			'html { height: 100%; }' +
			'body { font: 12pt monospace; height: 100%; margin: 0; }' +
			'h2, h3 { margin: 0; }' +
			'a { color: crimson; text-decoration: none; }' +
			'button, input[type=button] { background-color: #ccc; border: 2px #fff solid; color: #322; }' +
			'iframe { background-color: white; border: 0px; height: 100%; margin-top: 0px; width: 100%; }' +
			'input[type=range] { -webkit-appearance: none; -moz-appearance: none; background-color: #ddd; width: 160px; }' +
			'input[type=range]::-moz-range-thumb { background-color: #888; border-radius: 0; width: 10px; }' +
			'input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; background-color: #888; height: 20px; width: 10px; }' +
			'p { margin: 0 0 5px 0; }' +
			'summary h3, summary h4 { display:inline; }' +
			'summary { outline: none; }' +

			'#bars { background-color: #eee; color: crimson; cursor: pointer; font-size: 24pt; text-decoration: none; }' +
			'#hamburger { left: 325px; position: absolute; top: 20px; transition: left 1s; }' +
			'#mapDiv { height: 100%; text-align: center; }' +
			'#menu { background-color: #eee; border: 1px #ccc solid; left: -325px; max-height: ' + ( window.innerHeight - 10 ) + 'px; ' +
				'opacity: 0.85; overflow: auto; padding: 0 10px; position: absolute; top: -20px; transition: left 1s; width: 300px; }' +

			'#divThreejs { background-color: #ccc; border: 2px solid #888; height: 80%; min-width: 70%;' +
				'overflow: hidden; left: 350px; position: absolute; resize: none; top: 100px; }' +
			'#threejsHeader { text-align: right; }' +
			'#txtElevations { min-height: 50px; width: 100%; }' +
			'#txtPath { min-height: 60px; width: 100%; }' +

		'';

	};


	JT3.setCSSView = function() {

		JT3.cssView = document.body.appendChild( document.createElement('style') );
		JT3.cssView.innerHTML =

			'body { font: 12pt monospace; margin: 0; overflow: hidden; }' +
			'a { color: crimson; text-decoration: none; }' +

			'button, input[type=button] { background-color: #ccc; border: 2px #fff solid; color: #322; }' +

			'input[type=range] { -webkit-appearance: none; -moz-appearance: none; background-color: #ddd; width: 160px; }' +
			'input[type=range]::-moz-range-thumb { background-color: #888; border-radius: 0; width: 10px; }' +
			'input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; background-color: #888; height: 20px; width: 10px; }' +

			'summary { outline: none; }' +
			'summary h3, summary h4 { display:inline; }' +

			'.popUp { background-color: white; left: 150px; border: 1px solid red; opacity: 1.0; padding: 5px; position: absolute; width: 120px; z-index: 10; }' +

			'#bars { color: crimson; cursor: pointer; font-size: 24pt; text-decoration: none; }' +

			'#container { left: 0; position: absolute; transition: left 1s; }' +

			'#hamburger { background-color: #eee; left: 325px; position: absolute; top: 20px; }' +

			'#menu { background-color: #eee; border: 1px #ccc solid; max-height: ' + window.innerHeight + 'px; overflow: auto; padding: 0 10px; position: absolute; width: 300px; }' +
			'#menu h2 { margin: 0; }' +

		'';

	};

	defaults = {};

	defaults.backgroundColor = 0x7ec0ee ;
	defaults.origin = 'Tenzing-Hillary Airport, Lukla, Nepal';

	defaults.latitude = 27.6878; // 27.71110193545;
	defaults.longitude = 86.7314; // 86.71228385040001;

	defaults.zoom = 12;

	defaults.tilesX = 3;
	defaults.tilesY = 3;

	defaults.verticalScale = 0.00002;

	defaults.plainOpacity = 0.5;
	defaults.deltaOverlay = 1;

	defaults.fogNear = 0.5;
	defaults.fogFar = 1;


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


	var divThreejs;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;
	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };
	var b = '<br>';


	JT3.setPlaceDefaults = function() {

			place.origin = place.origin ? place.origin : defaults.origin;

			place.latitude = place.latitude ? place.latitude : defaults.latitude;
			place.longitude = place.longitude ? place.longitude : defaults.longitude;

			place.zoom = place.zoom ? place.zoom : defaults.zoom;

			place.tilesX = place.tilesX ? place.tilesX : defaults.tilesX;
			place.tilesY = place.tilesY ? place.tilesY : defaults.tilesY;


			place.plainOpacity = place.plainOpacity ? place.plainOpacity : defaults.plainOpacity;
			place.deltaOverlay = place.deltaOverlay ? place.deltaOverlay : defaults.deltaOverlay;

			place.fogNear = place.fogNear ? place.fogNear : defaults.fogNear;
			place.fogFar = place.fogFar ? place.fogFar : defaults.fogFar;



	}