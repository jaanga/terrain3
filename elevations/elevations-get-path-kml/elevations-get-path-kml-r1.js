
	var kmlLeig = 'https://jaanga.github.io/terrain3/google-api/data-kml/LEIG-L1500-01.kml';
	var kmlVhsk = 'https://jaanga.github.io/terrain3/google-api/data-kml/VHSK-22-01.kml';

	var kmlSnowMountainActual = 'https://jaanga.github.io/terrain3/google-api/data-kml/Snow_Mountain_Actual.kml';
	var kmlSnowMountainWilderness = 'https://jaanga.github.io/terrain3/google-api/data-kml/Snow_Mountain_Wilderness.kml';



	function setMenuDetailsPathKMLExamples() {

		menuDetailsPathKMLExamples.innerHTML =

			'<details open >' +
				'<summary><h3>path kml examples</h3></summary>' +

//				'<p><a href=# onclick=openKML(kmlLeig); >Open LEIG KML</a></p>' +
//				'<p><a href=# onclick=openKML(kmlVhsk); >VHSK KML</a></p>' +
				'<p><a href=# onclick=openKML(kmlSnowMountainActual); >Snow Mountain Actual KML</a></p>' +
				'<p><a href=# onclick=openKML(kmlSnowMountainWilderness); >Sbow Mountain Wilderness KML</a></p>' +

			'</details>' +

		'';

	}


	function setMenuDetailsPathKMLOpen() {

		menuDetailsPathKMLOpen.innerHTML =

			'<details open >' +
				'<summary><h3>path kml open</h3></summary>' +

				'<small>Open path file and draw it on map</small>' +
				'<p><input type=file id=inpFile onchange=openFile(this,"path"); ></p>' +
				'<div>' +
					'<textarea id=txtPath >' +
						'Open a KML file to view its path on the map. ' +
						'If location is remote, press \'Set location as map center\' when it appears. ' +
						'You may load multiple paths.' +
					'</textarea>' +
				'</div>' +

				'<div id=menuOpenFile ></div>' +

				'<div id=menuPathBoundaries >' +
					'<details>' +
					'<summary><h4>path boundaries</h4></summary>' +
					'<small>When you open a path file, its boundary details appear here</small>' +
				'</div>' +

			'</details>' +

		'';

	}

	function openKML( url ) {

		layer = new google.maps.KmlLayer({

			url: url,
			map: googleMap

		});

	}
