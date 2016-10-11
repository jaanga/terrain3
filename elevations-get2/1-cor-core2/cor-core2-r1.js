// Copyright &copy; 2016 Jaanga authors. MIT License


	COR.menuHeaderTagline = 

		'<div><small>' +
			'Tools to market your apps' + b +
			'Apps that market your tools' + b +
		'</small></div>';


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
//			'select { width: 100%; }' +
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



/*
	COR.getMenuBreadCrumbs = function() {

		return '<div id=CORdivBreadCrumbs ></div>';

	}



	COR.setMenuBreadCrumbs = function( dir ) {

//console.log( 'dir', dir );

		var CORbreadCrumbs, dirArray, dirString;

		dirArray = dir === '/' ? [] : dir.split( '/' );

		if ( dirArray.length > 0 ) {

			CORbreadCrumbs =

			'<h3 class=>' +
				'<a href=http://' + DEF.user + '.github.io title="' + DEF.user + ' - ' + DEF.titleTagline + '" >' + DEF.logo + ' ' + DEF.user + '</a> &raquo; ' +
				'<a href="" >' + DEF.repo + '</a> &raquo; ' +
			'</h3>';

		} else {

			CORbreadCrumbs =

			'<h3>' +
				'<a href=http://' + DEF.user + '.github.io title="' + DEF.user + ' - ' + DEF.titleTagline + '" >' + DEF.logo + ' ' + DEF.user + '</a> &raquo; ' +
			'</h3>' +
			'<h2><a href="" >' + DEF.repo + '</a> &raquo; </h2>';

		}

		for ( var i = 0; i < dirArray.length; i++ ) {

			dirString = dirArray.slice( 0, i + 1 ).join( '/' );

			if ( dirString.endsWith( '.md' ) || dirString.endsWith( '.html' ) ) { continue; }

			CORbreadCrumbs += '<h2><a href=#' + dirString + ' >' + dirArray[ i ].replace( /-/g, ' ' ) + '</a> &raquo </h2>';

		}

		COR.title = dirArray.length ? dirArray.pop().replace( /-/g, ' ' ) : DEF.repo;

		CORdivBreadCrumbs.innerHTML = CORbreadCrumbs;

	};


*/


	COR.getMenuDetailsHeader = function() {

		tt = DEF.repo.link( 'http://' + DEF.user + '.github.io/' + DEF.repo, 'howdy' );
		var menuDetailsHeader =

			'<h3 title="' + DEF.user + ' - ' + DEF.titleTagline + '" >' +
//				'<a href=http://' + DEF.user + '/github.io/ >' + DEF.logo + '</a> &raquo; ' +
				DEF.logo.link( 'http://' + DEF.user + '.github.io/') + ' &raquo; ' +
//				'<a href=http://' + DEF.user + '.github.io/' + DEF.repo + ' title="your happy templates place" > ' + DEF.repo + ' </a> &raquo; ' + 
				DEF.repo.link( 'http://' + DEF.user + '.github.io/' + DEF.repo ) + ' &raquo; ' +
			'</h3>' +
			'<h2 title="Click here to refresh this page" >' +
				'<a href="" >' + document.title + '</a> ~ ' +
//				'<a href=' + DEF.urlReadMeFile + ' title="Click here for help and information" > &#x24D8; </a>' +
				'<a href=' + DEF.urlReadMeFile + ' onmouseover=popHelp.style.display=""; onmouseout=popHelp.style.display="none"; > ' + DEF.logoInfoIcon + ' </a>' +

			'</h2>' +

			COR.menuHeaderTagline +

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
					'<a href=jaanga.github.io/license.md >MIT license</a>' +
				'</p>' +

				'<p>Thank you <a href=https://developer.github.com/v3/ > GitHub API </a> ' +
//					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +

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

			'<div class=popUp id=pop2 style=display:none;bottom:100px; >' +
				'Jaanga - your 3D happy place.<br>Click here to return to the top of the page' +
			'</div>' +

		b;

		return footer;

	};


// Template

//			COR.getMenuDetailsTemplate() +

//		detailsTemplate.setAttribute('open', 'open');

	COR.getMenuDetailsTemplate = function() {

		var menuDetailsTemplate =

			'<details id=detailsTemplate >' +

				'<summary><h3>Template</h3></summary>' +

				'<p id=pTemplate >' +

					'<button > button </button>' + b +

					COR.txt +

			'</p>' +

			'</details>' +

		b;

		return menuDetailsTemplate;

	};


// better in DEF??

	COR.getMenuDetailsObjectProperties = function( obj ) {

		obj = obj || DEF;

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
		obj = obj || DEF;

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

// reset what needs resetting

		COR.nearby = [];
		COR.placards = [];

		keys = Object.keys( COR.defaults ); 

		for ( var i = 0; i < keys.length; i++ ) {

			COR.place[ keys[ i ] ] = COR.place[ keys[ i ] ] || COR.defaults[ keys[ i ] ];

		}

	};


	COR.requestFile = function( url, callback ) {

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.crossOrigin = 'anonymous';
		xhr.open( 'GET', url, true );
		xhr.onload = callback;
		xhr.send( null );

	}
