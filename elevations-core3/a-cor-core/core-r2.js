// Copyright &copy; 2016 Jaanga authors. MIT License

	var CAS = {};
	var KML = {};
	var MAP = {};
	var MSH = {};
	var OVR = {};
	var SEL = {};
	var TER = {};
	var THR = {};

	var PAR = {};
	var TIL = {};
	var DAT = {};
	var ELV = {};


// !!!

	var googleMap = {};
	var geocoder;
	var mapParameters;
	var threejs;
	var divThreejs;
	var tiles;


// should these place defaults not be in map.js?? No better here because the data is used in so many places

	var COR = {};
	COR.defaults = {};

	COR.defaults.backgroundColor = 0x7ec0ee ;
	COR.defaults.deltaOverlay = 1;

	COR.defaults.fogNear = 0.5;
	COR.defaults.fogFar = 1;

	COR.defaults.latitude = 27.6878; // 27.71110193545;
	COR.defaults.longitude = 86.7314; // 86.71228385040001;

	COR.defaults.mapTypeId = 'hybrid';

	COR.defaults.objectName = 'defaults';
	COR.defaults.origin = 'Tenzing-Hillary Airport, Lukla, Nepal';
	COR.defaults.pixelsPerTile = 256;
	COR.defaults.plainOpacity = 0.5;

	COR.defaults.tilesX = 3;
	COR.defaults.tilesY = 3;

	COR.defaults.ULtileX = 3033;
	COR.defaults.ULtileY = 1718;

	COR.defaults.verticalScale = 5;

	COR.defaults.zoom = 12;

	COR.mapTypes = [

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


// shortcuts

	var b = '<br>';

	COR.taglineHeader = 

		'<p><small>' +
			'Rotate|Zoom|Pan => 1|2|3 finger/button' + b +
			'Rotation => spacebar' +
		'</small></p>';


	COR.aboutCredits = '<p>Thank you <a href=https://developer.github.com/v3/ > GitHub API </a> ';
//					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +


	COR.txt = '<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>';
//	COR.txt = '<p>GitHub API responses will appear here.</p>';

// https://github.com/showdownjs/showdown
//	COR.converter = new showdown.Converter( { strikethrough: true, literalMidWordUnderscores: true, simplifiedAutoLink: true, tables: true } );


// inits

	COR.initLeftMenu = function() {

		var hamburger, menu, contents;

		COR.getCSSLeft();

		hamburger = document.body.appendChild( document.createElement( 'div' ) );
		hamburger.id = 'hamburger';
		hamburger.innerHTML = '<div id=bars title="Click this hamburger to slide the menu" > &#9776 </div>';

		bars.id = 'bars';
		bars.onclick = function() { hamburger.style.left = hamburger.style.left === "0px" ? "325px" : 0; };

		COR.menu = hamburger.appendChild( document.createElement( 'div' ) );
		COR.menu.id = 'menu';
		COR.menu.innerHTML =

			COR.getMenuDetailsHeader() +

			COR.getMenuDetailsAbout() +

			COR.getMenuFooter() +

		b;

		COR.onLeftMenuLoaded();

	}

	COR.onLeftMenuLoaded = function (){};

	COR.initThreeColumns = function() {

		COR.getCSS();

		COR.menu = document.body.appendChild( document.createElement( 'div' ) );
		COR.menu.id = 'menu';
		COR.menu.innerHTML =

			COR.getMenuDetailsHeader() +

			COR.getMenuDetailsTemplate() +

			COR.getMenuDetailsAbout() +

			COR.getMenuFooter() +

		b;


		COR.contents = document.body.appendChild( document.createElement( 'div' ) );
		COR.contents.id = 'contents';
		COR.contents.innerHTML = '<h1>contents</h1><div id=divContents >' + COR.txt + '</div>';


		COR.updates = document.body.appendChild( document.createElement( 'div' ) );
		COR.updates.id = 'updates';
		COR.updates.innerHTML = '<h1>updates</h1><div id=divUpdates >' + COR.txt + '</div>';

		detailsTemplate.setAttribute('open', 'open');

	};



// CSS

	COR.getCSSLeft = function() {

		var css;

		css = document.body.appendChild( document.createElement('style') );
		css.innerHTML =

			'html { height: 100%; margin: 0; overflow: hidden; }' +
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
			'#hamburger { left: 325px; position: absolute; top: 20px; transition: left 1s;  z-index: 1;}' +
			'#mapDiv { height: 100%; text-align: center; }' +
			'#menu { background-color: #eee; border: 1px #ccc solid; left: -325px; max-height: ' + ( window.innerHeight - 10 ) + 'px; ' +
				'opacity: 0.85; overflow: auto; padding: 0 10px; position: absolute; top: -20px; transition: left 1s; width: 300px; z-index: 1;}' +


			'#divThreejs { background-color: #ccc; border: 2px solid #888; height: 80%; min-width: 70%;' +
				'overflow: hidden; left: 350px; position: absolute; resize: none; top: 100px; }' +
			'#threejsHeader { text-align: right; }' +

			'#txtElevations { min-height: 50px; width: 100%; }' +
			'#txtPath { min-height: 60px; width: 100%; }' +

		'';

	}

	COR.getCSS = function() {

		var css;

		css = document.body.appendChild( document.createElement( 'style' ) );
		css.innerHTML =

			'body { font: 12pt monospace; margin: 0; }' +

			'a { color: crimson; text-decoration: none; }' +

			'button, input[type=button] { background-color: #ccc; border: 2px #fff solid; color: #322; }' +

			'h2, h1 { margin: 0 }' +

			'iframe { width: 100%; }' +

			'select { width: 100%; }' +
			'summary h2, summary h3, summary h4 { display: inline; }' +
			'summary { outline: none; }' +

			'.butt2 { width: 108px; }' +
			'.popUp { background-color: white; left: 150px; border: 1px solid red; opacity: 1.0; padding: 5px; position: absolute; width: 120px; z-index: 10; }' +

			'#contents { border: 0px red solid; left: 25%; position: absolute; top: 0; max-width: 50%; }' +

//			'#menu { box-sizing: border-box; background-color: #ccc; padding: 0 10px 0 10px; position: absolute; max-width: 20%; }' +
			'#menu { background-color: #eee; height: ' + window.innerHeight + 'px; padding: 0 5px 0 10px; overflow-x: hidden; overflow-y: auto; position: fixed; width: 20%; }' +
			'#menu img { max-width: 200px; }' +

			'#updates { box-sizing: border-box; background-color: #eee; float: right; max-width: 25%; padding: 0 20px; }' +

			'#repositoryEvents h4 { margin: 0; }' +
			'#repositoryEvents { max-height: 200px; overflow-y: scroll; font-size: 9pt; }' +

			'#divSplash { background-color: #ccc; border: 2px solid #888; height: 80%; width: 500px;' +
				'overflow: hidden; left: 350px; position: absolute; resize: none; top: 100px; }' +
			'#splashHeader { text-align: right; }' +

		b;

	};


// Menus

	COR.getMenuDetailsHeader = function() {

		var menuDetailsHeader =

			'<h3>' +

				'<a href=http://jaanga.github.io/ title="Jaanga - your 3D happy place" > &#x2766 </a> &raquo; ' +
				'<a href=http://jaanga.github.io/terrain3/ title="your happy mappy place" > Terrain3 </a> &raquo; ' + 
			'</h3>' +
			'<h2>' +
				'<a href="" title="Click here to refresh this page" >' + document.title + '</a> ~ ' +
//				'<a href=index.html#readme.md title="Click here for help and information" > &#x24D8; </a>' +
				'<a href=../../../index.html#sandbox/elevations-view-oakland-gran-fondo onmouseover=popHelp.style.display=""; onmouseout=popHelp.style.display="none"; > &#x24D8; </a>' +

			'</h2>' +

			COR.taglineHeader +

			'<div class=popUp id=popHelp style=display:none; ><p>Hi there!</p>Click the i-in-circle, info icon for latest updates.</div>' +

		b;

		return menuDetailsHeader;

	};



	COR.getMenuDetailsAbout = function() {

		var menuDetailsAbout =

			'<details id=detailsAbout >' +

				'<summary><h3>About</h3></summary>' +

				'<p>' +
					'Copyright &copy; 2016 <a href=https://github.com/orgs/jaanga/people target="_blank">Jaanga authors</a>.' + b +
					'<jaanga.github.io/license.md >MIT license</a>' +
				'</p>' +

				COR.aboutCredits +

				'<p>Click the \'i in a circle\' info icon for more <a href=index.html#readme.md >help</a></p>' +

			'</details>' +

		b;

		return menuDetailsAbout;

	};



	COR.getMenuFooter = function() {

		var footer =

			'<hr>' +

			'<center>' +
				'<a href=javascript:menu.scrollTop=0; style=text-decoration:none; onmouseover=pop2.style.display=""; onmouseout=pop2.style.display="none"; ><h1> &#x2766 <h1></a>' +
			'</center>' +

			'<div class=popUp id=pop2 style= display:none;bottom:100px; >' +
				'Jaanga - your 3D happy place.<br>Click here to return to the top of the page' +
			'</div>' +

		b;

		return footer;

	};



	COR.getMenuDetailsTemplate = function() {

		var menuDetailsTemplate =

			'<details id=detailsTemplate open >' +

				'<summary id=menuSummaryTemplate ><h3>Template</h3></summary>' +

				'<p id=pTemplate >' +

					'<button onclick=alert("Howdy!"); > button </button>' + b +

					COR.txt +

			'</p>' +

			'</details>' +

		b;

		return menuDetailsTemplate;

	};



	COR.getMenuDetailsObjectProperties = function( obj ) {

		obj = obj || COR.defaults;

		var menuDetailsObjectProperties =

			'<details> ' +

				'<summary id=MenuSummaryObjectProperties ><h3>Object Properties: ' + ( obj.objectName || '' ) + ' </h3></summary>' +

				'<p>' +
					'<button onclick=properties.innerHTML=COR.getObjectProperties(COR.place); >Get place properties</button> ' +
					'<button onclick=properties.innerHTML=COR.getObjectProperties(); >Get defaults</button> ' +
				'</p>' +

				'<p id=properties ></p>' + b +

			'</details>' +

		'';

		return menuDetailsObjectProperties;

	};


// utils

	COR.getObjectProperties = function( obj ) {

		var keys, txt;
		obj = obj || COR.defaults;

		keys = Object.keys( obj );

		txt = '';

		for ( var i = 0; i < keys.length; i++ ) {

			txt += '<tr><td>' + keys[ i ] + ': </td><td> ' + obj[ keys[ i ] ] + '</td></tr>';

		}

		MenuSummaryObjectProperties.innerHTML = '<h3>Object Properties: ' + ( obj.objectName || '' ) + '</h3>';

		return '<table>' + txt + '</table>';

	}



	COR.getPlaceDefaults = function() {

		var keys;

		if ( !COR.place ) { COR.place = {}; }

		keys = Object.keys( COR.defaults ); 

		for ( var i = 0; i < keys.length; i++ ) {

			COR.place[ keys[ i ] ] = COR.place[ keys[ i ] ] || COR.defaults[ keys[ i ] ];

		}

	};



// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values

	COR.arrayMin = function( arr ) {

		var len = arr.length, min = Infinity;

		while ( len-- ) {

			if ( arr[ len ] < min) { min = arr[ len ]; }

		}

		return min;

	};


	COR.arrayMax = function( arr ) {

		var len = arr.length, max = -Infinity;

		while ( len-- ) {

			if (arr[len] > max) { max = arr[len]; }

		}

		return max;

	};


