
	var MSH = MSH || {};


	MSH.getMenuDetailsMeshLine = function() {

		var menuDetailsMeshLine =

			'<details id=CORdetailsMeshLine open >' +

				'<summary id=MSHmenuSummaryMeshLine ><h3>Mesh Line</h3></summary>' +

				'<div id=MSHdivMeshLine >' +

					'<p><button onclick=demo(); >demo</button></p>' +

					'<p><button onclick=spiral(); >spiral</button></p>' +

					'<p><button onclick=getRandom(); >random</button></p>' +

					'<p><button onclick=getNicePath(); >nice path</button></p>' +

				'</div>' + b +

			'</details>' +

		'';

		return menuDetailsMeshLine;

	};

	MSH.getMeshLine = function( points, color, width ) {

		var geometry, line, material;

		geometry = new THREE.Geometry();
		line = new MeshLine();

		geometry.vertices = points;

		line.setGeometry( geometry );

		material = new MeshLineMaterial( { color: new THREE.Color( color ), lineWidth: width });

		return new THREE.Mesh( line.geometry, material );

	};

