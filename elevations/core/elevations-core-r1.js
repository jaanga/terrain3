
	var b = '<br>';

	var JT3 = {};

	JT3.css = document.body.appendChild( document.createElement('style') );
	JT3.css.innerHTML =

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

	var place = {};

	place.vicinity = place.origin = 'Tenzing-Hillary Airport, Lukla, Nepal';

	place.latitude = 27.6878; // 27.71110193545;
	place.longitude = 86.7314; // 86.71228385040001;

	place.zoom = 12;

	place.tilesX = 3;
	place.tilesY = 3;
	place.verticalScale = 0.00001;

	var divThreejs;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180;

	var b = '<br>';

