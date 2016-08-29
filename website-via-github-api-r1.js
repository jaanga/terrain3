// copyright &copy 2016 Jaanga authors. MIT license.

	var user = 'jaanga';
	var tagLine ='your 3D happy place';
	var logo = '&#x2766';

	var urlEvents = 'https://api.github.com/orgs/jaanga/events';
//	var urlEvents = 'https://api.github.com/repos/mrdoob/three.js/events';
//	var urlEvents = 'https://api.github.com/orgs/sagemath/events';

/*
	var repo = 'jaanga.github.io';
	var branch = 'master';
//	var folder = 'cookbook-threejs/examples/';
	var folder = 'cookbook-html/examples/github-api-rss/';
*/

	var org = 'jaanga';
	var repo = 'terrain3';
	var branch = 'gh-pages';
	var folder = '';

	var urlGitHubTree = 'https://api.github.com/repos/' + user + '/' + repo + '/git/trees/' + branch + '?recursive=1';
	var urlGHPages = 'https://' + user + '.github.io/' + repo + '/';
	var urlSource = 'https://github.com/' + user + '/' + repo + '/tree/' + branch + '/';
	var urlIssues = 'https://api.github.com/repos/' + user + '/' + repo + '/issues';

	var filesAll, filesSelected;

	var b = '<br>';
	var converter = new showdown.Converter( { strikethrough: true, literalMidWordUnderscores: true, simplifiedAutoLink: true, tables: true });

	init();

	function init() {

		var css, menu;

		css = document.body.appendChild( document.createElement( 'style' ) );
		css.innerHTML =

			'body { font: 12pt monospace; margin: 0; }' +
			'a { text-decoration: none; }' +
			'button, input[type=button] { background-color: #eee; border: 2px #eee solid; color: #888; }' +

			'h2 a { color: crimson; }' +
			'img { max-width: 100%; }' +
			'iframe { width: 100%; }' +
			'summary h2, summary h3 { display: inline; }' +
			'summary { outline: none; }' +

			'#menu { box-sizing: border-box; background-color: #ccc; padding: 0 0 0 10px; position: absolute; max-width: 20%; }' +
			'#contents { border: 0px red solid; left: 22%; position: absolute; top: 0; max-width: 55%; }' +
			'#repositoryEvents h4 { margin: 0; }' +
			'#repositoryEvents { max-height: 200px; overflow-y: scroll; font-size: 9pt; }' +
			'#updates { box-sizing: border-box; background-color: #eee; float: right; max-width: 20%; padding: 0 20px; }' +

		'';

		menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'menu';
		menu.innerHTML =

			'<div id=menuBreadCrumbs ></div>' +

			'<div id=menuFolderNameTableOfContents ></div>' +

			'<div id=menuDetailsPageActions ></div>' +

			'<div id=menuDetailsRepositoryStatistics ></div>' +

			'<div id=menuDetailsRepositoryEvents ></div>' +

			'<div id=menuDetailsAbout ></div>' +

			'<hr>' +

			'<center>' +
				'<a href=javascript:window.scrollTo(0,0); style=text-decoration:none; title="' + user + ' - ' + tagLine + '" >' +
				'<h1>' + logo + '<h1></a>' +
			'</center>' +

		'';

		contents = document.body.appendChild( document.createElement( 'div' ) );
		contents.id = 'contents';

		updates = document.body.appendChild( document.createElement( 'div' ) );
		updates.id = 'updates';

		window.addEventListener ( 'hashchange', onHashChange, false );

		setMenuDetailsPageActions();

		requestGitHubAPIEvents();

		setMenuRepositoryEvents();

		setMenuDetailsAbout();

		requestFile( urlGitHubTree, function callbackGH( xhr ) {

			var tree;

			response = JSON.parse( xhr.target.response );

			tree = response.tree;

			itemsAll = tree.map( function( item ) { return item.path; } );

			onHashChange();

			setMenuDetailsRepositoryStatistics( tree );

		} );

		requestFile( urlIssues, function ( xhr ) {

			issues = JSON.parse( xhr.target.responseText );

			txt = '<h1><a href="" >' + repo + ' status updates</a> <a href=index.html#readme.md > &#x24D8; </a></h1>';

			for ( var i = 0; i < issues.length; i++ ) {

				issue = issues[ i ];

				txt += '<h2><a href=' + issue.html_url + ' >' + issue.title + '</a></h2>' +
					'<div class=issue >' + converter.makeHtml( issue.body ) + '</div>';

			}

			updates.innerHTML = txt;

		} );

	}


// menu items

	function setMenuDetailsPageActions() {

		menuDetailsPageActions.innerHTML =

			'<details open>' +

				'<summary><h3>page actions</h3></summary>' +

				'<p><a href=JavaScript:location.href=urlSource+location.hash.slice(1); >View source on GitHub</a></p>' +
				'<p><a href=JavaScript:window.open(urlGHPages+location.hash.slice(1),"_blank"); >Open page in new tab</a></p>' +

			'</details>' +

		'';

	}


	function setMenuDetailsRepositoryStatistics( tree ) {

		var dirs, files, filesSize, item;

		dirs = 0;
		files = 0;
		filesSize = 0;

		for ( var i = 0; i < tree.length; i++ ) {

			item = tree[ i ];

			if ( item.type === 'blob' ) {

				files++;
				filesSize += item.size;

			} else {

				dirs++;

			}

		}

		menuDetailsRepositoryStatistics.innerHTML =

			'<details open>' +

				'<summary><h3>repository statistics</h3></summary>' +
				'Items in repo: ' + itemsAll.length.toLocaleString() + b +
				'&bull; Folders &nbsp;  &nbsp: ' + dirs.toLocaleString() + b +
				'&bull; Files &nbsp  &nbsp  &nbsp: ' + files.toLocaleString() + b + b +

				'Size of files: ' + filesSize.toLocaleString() + ' bytes' + b +

			'</details>' + b;

	}

	function setMenuRepositoryEvents() {

		menuDetailsRepositoryEvents.innerHTML =

			'<details open>' +

				'<summary><h3>repository events</h3></summary>' +

				'<div id=repositoryEvents ></div>' +

			'</details>' + b +

		'';

	}


	function setMenuDetailsAbout() {

		menuDetailsAbout.innerHTML =

			'<details>' +

				'<summary><h3>about</h3></summary>' +

				'<p>This menu/<a href=https://en.wikipedia.org/wiki/Content_management_system >cms</a> is created on-the-fly by:' + b + b +
					'<a href=http://jaanga.github.io/cookbook-html/templates/website-via-github-api/#readme.md >webSite via GitHub API</a></p>' +

				'<p>' +
					'Copyright &copy; 2016 <a href=https://github.com/orgs/jaanga/people target="_blank">Jaanga authors</a>.' + b +
					'<jaanga.github.io/license.md >MIT license</a>' +
				'</p>' +

				'<p>Thank you <a href=https://developers.google.com/maps/documentation/javascript/elevation > Google Maps </a> and ' +
					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +

//				'<p>Click the \'i in a circle\' info icon for more <a href=index.html#readme.md >help</a></p>' +

			'</details>' +

		'';

	}

//

	function onHashChange() {

		var item;

		item = location.hash ? location.hash.slice( 1 ) : folder;

		if ( item.endsWith( '.md' ) === true ) {

			setBreadCrumbs( folder );

			requestFile( urlGHPages + item, function callbackMD( xhr ) {

				contents.innerHTML = converter.makeHtml( xhr.target.responseText );
				contents.style.overflow = 'auto';

			} );

		} else {

			setBreadCrumbs( item );

			getFilesFromFolder( item );

			requestFile( urlGHPages + item + '/readme.md', function callbackMD( xhr ) {

				if ( xhr.target.status !== 404 ) {

					contents.innerHTML = converter.makeHtml( xhr.target.responseText );

				}

				contents.style.overflow = 'auto';

			} );

		}


		if ( folder === '' ) {

		}

	}


	function setBreadCrumbs( dir ) {

//		var breadCrumbs, dirArray;

		dirArray = dir.split( '/' );

		breadCrumbs =

		'<h2>' +

			'<a href=http://' + user + '.github.io title="' + user + ' - ' + tagLine + '" >' + logo + ' ' + user + '</a> &raquo; ' +
			'<a href=# >' + repo + '</a> &raquo; ' +

		'</h2>';

		for ( var i = 0; i < dirArray.length - 1; i++ ) {

			dirString = dirArray.slice( 0, i + 1 ).join( '/' );

			breadCrumbs += '<h3><a href=#' + dirString + ' >' + dirArray[ i ].replace( /-/g, ' ' ) + '</a> &raquo </h3>';

		}

		breadCrumbs += '<h3><a href=#' + dir + ' >' + dirArray[ i ].replace( /-/g, ' ' ) + '</a></h3>';

		menuBreadCrumbs.innerHTML = breadCrumbs;

	}


	function getFilesFromFolder( dir ) {

		var item, itemArray;

		dirsSelected = [];

		var dirArray = dir.split( '/' );

		var dirLen = dir === '' ? 0 : dirArray.length;

		for ( var i = 0; i < itemsAll.length; i++ ) {

			item = itemsAll[ i ];

			if ( !item.match( 'readme.md' ) ) { continue; }

			if ( !item.startsWith( dir ) ) { continue; }

			if ( item.match( 'archive' ) ) { continue; }

			itemArray = item.split( '/' );

			if ( itemArray.length - dirLen !== 2 ) { continue; }

			dirsSelected.push( item.replace( '/readme.md', '' ) );

		}

		createFolderNameTableOfContents( dir );

	}


	function createFolderNameTableOfContents( dir ) {

		var toc, fName, folder;

		toc = '';

		for ( var i = 0; i < dirsSelected.length; i++ ) {

			folder = dirsSelected[ i ];

			fName = folder.split( '/' ).pop();
			fName = fName.replace( /-/g, ' ' );

			toc += '<h3>&#x1f4c1; <a href=#' + folder + ' > ' + fName + '</a></h3>';

		}

		menuFolderNameTableOfContents.innerHTML = toc;

	}


	function requestFile( fName, callback ) {

		var xhr;

		xhr = new XMLHttpRequest();
		xhr.crossOrigin = 'anonymous';
		xhr.open( 'GET', fName, true );
		xhr.onload = callback;
		xhr.send( null );

	}



	function requestGitHubAPIEvents() {

		var xhr;
		var events, event, txt, dates, actor, repo;
		var eventSet = {};

		xhr = new XMLHttpRequest();
		xhr.open( 'get', urlEvents, true );
		xhr.onload = callback;
		xhr.send( null );

		function callback() {

			events = JSON.parse( xhr.responseText );

			txt = '';

			dates = [];

			for ( var i = 0; i < events.length; i++ ) {

				event = events[ i ];

				if ( dates.indexOf( event.created_at.slice( 0, 10 ) ) === -1 ) {

					dates.push( event.created_at.slice( 0, 10 ) );

					txt += '<h4>' + event.created_at.slice( 0, 10 ) + '</h4>';

				}

				actor = ' <a href=' + event.actor.url + ' > ' + event.actor.login + '</a> ';

				repo = ' <a href=' + event.repo.url + ' > ' + event.repo.name.replace ( org, '' ) + '</a> ';

				if ( eventSet[ 'on' + event.type ] !== undefined ) {

					txt += ( i + 1 ) + ' ' + event.created_at.slice( 11, -4 ) + actor + ' ' + repo + b + 
						eventSet[ 'on' + event.type ]( event ) + b;

				} else {

console.log( 'non-event', event );

				}

			}

			repositoryEvents.innerHTML = txt;

		}

		eventSet.onCommitCommentEvent = function( event ) { return 'commit comment <a href=' + event.payload.comment.html_url + ' >' + event.payload.comment.body + '</a>'; };

		eventSet.onCreateEvent = function( event ) { return 'create ' + event.payload.master_branch; };

		eventSet.onDeleteEvent = function( event ) { return 'delete ' + event.payload.ref_type; };

		eventSet.onForkEvent = function( event ) { return 'fork'; };

		eventSet.onGollumEvent = function( event ) { return 'wiki edited'; };

		eventSet.onIssuesEvent = function( event ) { return 'issue <a href=' + event.payload.issue.html_url + ' >' + event.payload.issue.title + '</a>'; };

		eventSet.onIssueCommentEvent = function( event ) { return 'issue comment <a href=' + event.payload.issue.html_url + ' >' + event.payload.issue.title + '<a>'; };

		eventSet.onMemberEvent = function( event ) { return 'member ' + event.payload.action; };

		eventSet.onPushEvent = function( event ) {

			commit = event.payload.commits[ 0 ];
			return 'push <a href=https://github.com/' + event.repo.name + '/commit/' + commit.sha + ' >' + commit.message + '</a>';

		};

		eventSet.onPullRequestEvent = function( event ) { return 'pull request ' + event.payload.pull_request.body; };

		eventSet.onPullRequestReviewCommentEvent = function( event ) { return 'pull comment ' + event.payload.comment.body; };

		eventSet.onReleaseEvent = function( event ) { return 'release ' + event.payload.release.name; };

		eventSet.onWatchEvent = function( event ) {	return 'watch ' + event.payload.action; };

	}
