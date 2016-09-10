
	var meshLine;

	function getMeshLine( points, color, width ) {

		var geometry, line, material;

		geometry = new THREE.Geometry();
		line = new THREE.MeshLine();

		geometry.vertices = points;

		line.setGeometry( geometry );

		material = new THREE.MeshLineMaterial( { color: new THREE.Color( color ), lineWidth: width });

		return new THREE.Mesh( line.geometry, material );

	}