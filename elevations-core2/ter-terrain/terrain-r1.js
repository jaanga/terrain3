// Copyright &copy; 2016 Jaanga authors. MIT License

	var TER = TER || {};

	TER.onLoad = function() {

		return TER.getMenuDetailsTerrain();

	};

	TER.getMenuDetailsTerrain = function() {

		menuDetailsTerrain =

			'<details id=detailsTerrain >' +

				'<summary><h3>Terrain settings</h3></summary>' +

				'<small>Adjust 3D terrain</small>' +

				'<p>' +

					'Vertical scale: <output id=TERoutVertical >' + COR.place.verticalScale + '</output>' +
//					'<input type=range id=TERinpVertical min=0 max=10 step=0.1 value=' + COR.place.verticalScale + ' oninput=updateTerrain() title="" style=width:100%; >' +
					'<input type=range id=TERinpVertical min=0 max=10 step=0.1 value=' + COR.place.verticalScale + 
						' onchange=TERoutVertical.value=COR.place.verticalScale=parseFloat(this.value);MAP.initMapGeometry(); title="" style=width:100%; >' +

				'</p>' +

				'<p>' +

					'<input type=checkbox id=TERchkRotate onchange=THR.controls.autoRotate=TERchkRotate.checked > scene rotation' + b +

					'<input type=checkbox id=TERchkFog onchange=THR.toggleFog(this.checked); checked > Fog' + b +

					'<input type=checkbox id=TERchkGroudPlane onchange=MAP.groundPlane.visible=!MAP.groundPlane.visible; checked > Sea level' + b +

					'<input type=checkbox id=TERchkAxisHelper onchange=THR.axisHelper.visible=!THR.axisHelper.visible; checked > Axis helper' + b +

					'<input type=checkbox id=TERchkBoxHelper onchange=MAP.boxHelper.visible=!MAP.boxHelper.visible; checked > Box helper' + b +

					'<input type=checkbox id=TERchkWireframe onchange=MAP.material.wireframe=!MAP.material.wireframe; > Wireframe' + b +


				'</p>' +

				'<details>' +

					'<summary><h4>terrain parameters</h4></summary>' +

					'<div id=menuDetailsTerrainParameters ></div>' +

				'</details>' +

			'</details>' +

		'';

		return menuDetailsTerrain;

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


