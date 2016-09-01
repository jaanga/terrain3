// copyright &copy 2016 jaanga authors 

	var place;
	var googleMap;
	var geocoder;
	var tiles;
	var mapParameters;
	var divThreejs = true;


	defaults = {};

	defaults.backgroundColor = 0x7ec0ee ;
	defaults.deltaOverlay = 1;

	defaults.fogNear = 0.5;
	defaults.fogFar = 1;

	defaults.latitude = 27.6878; // 27.71110193545;
	defaults.longitude = 86.7314; // 86.71228385040001;

	defaults.mapTypeId = 'hybrid';
	defaults.mapTypes = [

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


	defaults.origin = 'Tenzing-Hillary Airport, Lukla, Nepal';
	defaults.pixelsPerTile = 256;
	defaults.plainOpacity = 0.5;

	defaults.tilesX = 3;
	defaults.tilesY = 3;

	defaults.verticalScale = 5;

	defaults.zoom = 12;

// shortcuts

	var b = '<br>';


//

	function getPlaceDefaultsCore() {

		if ( !place ) { place = {}; }

		place.name = 'Place';

		keys = Object.keys( defaults ); 

		for ( var i = 0; i < keys.length; i++ ) {

			place[ keys[ i ] ] = place[ keys[ i ] ] || defaults[ keys[ i ] ];

		}

	}


	function getCSSCore() {

		var css;

		css = document.body.appendChild( document.createElement('style') );
		css.innerHTML =

			'html { height: 100%; }' +
			'body { font: 12pt monospace; height: 100%; margin: 0; padding: 0; }' +
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

			'.popUp { background-color: white; left: 150px; border: 1px solid red; opacity: 1.0; padding: 5px; position: absolute; width: 120px; z-index: 10; }' +

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

	}


	function getCSSThreejsCore() {

		var css;

		css = document.body.appendChild( document.createElement('style') );
		css.innerHTML =

			'body { font: 12pt monospace; margin: 0; overflow: hidden; padding: 0; }' +
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

	}


// menus


	function getMenuDetailsHeaderCore() {

		var menuDetailsHeader = 

			'<h2>' +
				'<a href=https://jaanga.github.io/ title="Jaanga - your 3D happy place" > &#x2766 </a>' + b +
				'<a href="" title="Click here to refresh this page" >' + document.title + '</a> ~ ' +
				'<a href=index.html#readme.md title="Click here for help and information" > &#x24D8; </a>' +
			'</h2>' +

		b

		return menuDetailsHeader;

	}


	function getMenuDetailsAboutCore() {

		var menuDetailsAbout =

			'<details>' +

				'<summary><h3>About</h3></summary>' +

				'<p>' +
					'Copyright &copy; 2016 <a href=https://github.com/orgs/jaanga/people target="_blank">Jaanga authors</a>.' + b +
					'<jaanga.github.io/license.md >MIT license</a>' +
				'</p>' +

				'<p>Thank you <a href=https://developers.google.com/maps/documentation/javascript/elevation > Google Maps </a> and ' +
					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +

				'<p>Click the \'i in a circle\' info icon for more <a href=index.html#readme.md >help</a></p>' +

			'</details>' +

		b;

		return menuDetailsAbout;

	}


	function getMenuFooterCore() {

		var footer = 

			'<hr>' +

			'<center>' +
				'<a href=javascript:menu.scrollTop=0; style=text-decoration:none; onmouseover=pop2.style.display=""; onmouseout=pop2.style.display="none"; ><h1> &#x2766 <h1></a>' +
			'</center>' +

			'<div class=popUp id=pop2 style=display:none;bottom:10px; >' +
				'Jaanga - your 3D happy place.<br>Click here to return to the top of the page' +
			'</div>' +

		b;

		return footer;

	}


	function getMenuDetailsObjectPropertiesCore( obj ) {

		var keys, objProperties, menuDetailsObjectProperties;

		keys = Object.keys( obj );

		var objProperties = '';

		for ( var i = 0; i < keys.length; i++ ) {

			objProperties += keys[ i ] + ': ' + obj[ keys[ i ] ] + '<br>';

		}

		 menuDetailsObjectPropertiesCore =

			'<details open>' +

				'<summary><h3>Object Properties: ' + obj.name + ' </h3></summary>' +

				'<p>' + objProperties + '</p>' +

			'</details>' +

		b;

		return menuDetailsObjectPropertiesCore;

	}



// utils


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
