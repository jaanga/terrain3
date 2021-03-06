

	var b = '<br>';
	var n = '\n';

//
	var DEF = DEF || {};
	var COR = COR || {};
	var API = API || {};

	var SER = SER || {};
	var DAT = DAT || {};
	var EUS = EUS || {};
	var GET = GET || {};

//

	DEF.aboutCredits = '<p>Thank you <a href=https://developer.github.com/v3/ > GitHub API </a> ';
//					'<a href=http://threejs.org target="_blank">Mr.doob.</a></p>' +


	DEF.branch = 'gh-pages';

	DEF.carousels = [ '/', 'elevations-core3' ];

	DEF.defaultFile	= 'readme.md'; // if no default, select a random file

//	DEF.extension = '.md';
//	DEF.extension = '.json';

	DEF.includeFullScreenChoices = true;

	DEF.logo = '&#x2766';
	DEF.logoInfoIcon = '&#x24D8';

/*
// back to COT
	DEF.menuHeaderTagline = 

		'<div><small>' +
			'Tools to market your apps' + b +
			'Apps that market your tools' + b +
		'</small></div>';
*/




	DEF.objectName = 'defaults';

	DEF.repo = 'terrain3';


//	DEF.searchInFolder = 'elevations-data-04/';
	DEF.searchInFolder = '/';

	DEF.titleTagline ='your 3D mappy place';

//	DEF.txt = '<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>';
	DEF.txt = '<p>GitHub API responses will appear here.</p>';


	DEF.urlGITHubAPITreeContents = 'https://api.github.com/repos/' + DEF.user + '/' + DEF.repo + '/git/trees/' + DEF.branch + '?recursive=1';

	DEF.user = 'jaanga';
	DEF.urlBase = 'https://github.com/' + DEF.user + '/' + DEF.repo + DEF.searchInFolder;

	DEF.urlEvents = 'https://api.github.com/users/' + DEF.user + '/events';
	DEF.urlIssues = 'https://api.github.com/repos/' + DEF.user + '/' + DEF.repo + '/issues';


	DEF.urlGHPages = 'https://' + DEF.user + '.github.io/' + DEF.repo + '/';

	DEF.readmeURL = DEF.urlGHPages + DEF.searchInFolder;
	DEF.urlReadMeFile = DEF.urlGHPages + '#readme.md';

	DEF.urlSource = 'https://github.com/' + DEF.user + '/' + DEF.repo + '/tree/' + DEF.branch + '/';


// ren to MAP
// spit into what needed for Google API and what needed for Three.js

	COR.defaults = {};

	COR.defaults.backgroundColor = 0x7ec0ee ;
	COR.defaults.deltaOverlay = 1;

//	COR.defaults.fogNear = 0.5;
//	COR.defaults.fogFar = 1;

	COR.defaults.latitude = 27.6878; // 27.71110193545;
	COR.defaults.longitude = 86.7314; // 86.71228385040001;

	COR.defaults.mapTypeId = 'hybrid';

	COR.defaults.nearby = '';

	COR.defaults.objectName = 'defaults';
	COR.defaults.origin = 'Tenzing-Hillary Airport, Lukla, Nepal';


	COR.defaults.pixelsPerTile = 256;
	COR.defaults.plainOpacity = 0.5;
	COR.defaults.points = '';

	COR.defaults.tilesX = 3;
	COR.defaults.tilesY = 3;

	COR.defaults.ULtileX = 3033;
	COR.defaults.ULtileY = 1718;

	COR.defaults.verticalScale = 2;

	COR.defaults.zoom = 12;

