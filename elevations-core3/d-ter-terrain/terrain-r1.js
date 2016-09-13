// Copyright &copy; 2016 Jaanga authors. MIT License

	var TER = TER || {};


	TER.getMenuDetailsTerrain = function() {

		menuDetailsTerrain =

			'<details id=detailsTerrain >' +

				'<summary><h3>Terrain settings</h3></summary>' +

				'<small>Adjust 3D terrain</small>' +

				'<p>' +

					'Vertical scale: <output id=TERoutVertical >' + COR.defaults.verticalScale + '</output>' +
//					'<input type=range id=TERinpVertical min=0 max=10 step=0.1 value=' + COR.defaults.verticalScale + ' oninput=updateTerrain() title="" style=width:100%; >' +
					'<input type=range id=TERinpVertical min=0 max=10 step=0.1 value=' + COR.defaults.verticalScale + 
						' onchange=TER.TERinpVerticalOnChange(); title="" style=width:100%; >' +

				'</p>' +

				'<p>' +

					'<input type=checkbox id=TERchkRotate onchange=THR.controls.autoRotate=TERchkRotate.checked > scene rotation' + b +

					'<input type=checkbox id=TERchkFog onchange=THR.toggleFog(this.checked); checked > Fog' + b +

					'<input type=checkbox id=TERchkGroudPlane onchange=MAP.groundPlane.visible=!MAP.groundPlane.visible; checked > Sea level' + b +

					'<input type=checkbox id=TERchkAxisHelper onchange=THR.axisHelper.visible=!THR.axisHelper.visible; checked > Axis helper' + b +

					'<input type=checkbox id=TERchkBoxHelper onchange=MAP.boxHelper.visible=!MAP.boxHelper.visible; checked > Box helper' + b +

					'<input type=checkbox id=TERchkWireframe onchange=MAP.material.wireframe=!MAP.material.wireframe; > Wireframe' + b +


				'</p>' +

				'<details id=detailsTerrainParameters >' +

					'<summary><h4>terrain parameters</h4></summary>' +

					'<div id=menuDetailsTerrainParameters ></div>' +

				'</details>' +

			'</details>' +

		'';

		return menuDetailsTerrain;

	}


	TER.TERinpVerticalOnChange = function() {

		COR.place.verticalScale = parseFloat( TERinpVertical.value );

		TERoutVertical.value = COR.place.verticalScale;

//		if ( MAP.initMapGeometry ) { MAP.initMapGeometry(); }
		if ( MAP.drawMap ) { MAP.drawMap(); }

		if ( THR.lineX ) { THR.lineX.scale.y = COR.place.verticalScale; }

		if ( THR.line ) { THR.line.scale.y = COR.place.verticalScale; }
		if ( THR.line2 ) { THR.line2.scale.y = COR.place.verticalScale; }
		if ( THR.line3 ) { THR.line3.scale.y = COR.place.verticalScale; }

	}

	TER.setMenuDetailsTerrain = function() {

		var place = COR.place;

		var menuDetailsTerrainParameters =

			'Number of data points: ' + place.elevations.length.toLocaleString() + b + b +

			'Elevation maximum: ' + Math.round( MAP.max ).toLocaleString() + 'm' + b +
			'Elevation minimum: ' + Math.round( MAP.min ).toLocaleString() + 'm' +b + b +

			'Delta latitude : ' + MAP.deltaLat.toFixed( 4 ) + '&deg;' + b +
			'Delta lat/tile : ' + MAP.deltaLatTile.toFixed( 4 ) + '&deg;' + b +
			'Delta longitude: ' + MAP.deltaLon.toFixed( 4 ) + '&deg;' + b + b +

			'Center latitude : ' + MAP.cenLat.toFixed( 4 ) + '&deg;' + b +
			'Center longitude: ' + MAP.cenLon.toFixed( 4 ) + '&deg;' + b +

		b;

		return menuDetailsTerrainParameters;

	}


