

	var PLA = PLA || {};


	PLA.drawPlacePlacards = function() {

		var cpp, p;

		THR.scene.remove( PLA.placards );

		PLA.placards = new THREE.Object3D();

		cpp = COR.place.placards;

		for ( var i = 0; i < cpp.length; i++ ) {

			p = cpp[ i ];
			placard = PLA.drawPlacard( p[ 0 ], p[ 1 ] , p[ 2 ], p[ 3 ], p[ 4 ], p[ 5 ] );
			placard.position.set( p[ 6 ], p[ 7 ], - p[ 8 ] );

			PLA.placards.add( placard );

		}

		THR.scene.add( PLA.placards );

	};

	PLA.drawPlaceNearby = function() {

		var cpn, n;

		THR.scene.remove( PLA.nearby );

		PLA.nearby = new THREE.Object3D();

		cpn = COR.place.nearby;

		for ( var i = 0; i < cpn.length; i++ ) {

			n = cpn[ i ];

			nearby = PLA.drawPlacard( n.name, 0.00005 , 120, 0, MAP.boxHelper.geometry.attributes.position.array[ 1 ], 0 );

			nearby.position.set( n.lon, 0, - n.lat );

			PLA.nearby.add( nearby );

		}

		THR.scene.add( PLA.nearby );

	};



	PLA.drawPlacard = function( text, scale, color, x, y, z ) {

// 2016-02-27 ~ https://github.com/jaanga/jaanga.github.io/tree/master/cookbook-threejs/examples/placards

		var placard = new THREE.Object3D();
		var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

		var texture = canvasMultilineText( text, { backgroundColor: color }   );
		var spriteMaterial = new THREE.SpriteMaterial( { map: texture, opacity: 0.9, transparent: true } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.position.set( x, y, z ) ;
		sprite.scale.set( scale * texture.image.width, scale * texture.image.height );

		var geometry = new THREE.Geometry();
		geometry.vertices = [ v( 0, 0, 0 ),  v( x, y, z ) ];
		var material = new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 3 } );
		var line = new THREE.Line( geometry, material );

		placard.add( sprite, line );

		return placard;


		function canvasMultilineText( textArray, parameters ) {

			var parameters = parameters || {} ;

			var canvas = document.createElement( 'canvas' );
			var context = canvas.getContext( '2d' );
			var width = parameters.width ? parameters.width : 0;
			var font = parameters.font ? parameters.font : '48px monospace';
			var color = parameters.backgroundColor ? parameters.backgroundColor : 120 ;

			if ( typeof textArray === 'string' ) textArray = [ textArray ];

			context.font = font;

			for ( var i = 0; i < textArray.length; i++) {

				width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

			}

			canvas.width = width + 20;
			canvas.height =  parameters.height ? parameters.height : textArray.length * 60;

			context.fillStyle = 'hsl( ' + color + ', 80%, 50% )' ;
			context.fillRect( 0, 0, canvas.width, canvas.height);

			context.lineWidth = 1 ;
			context.strokeStyle = '#000';
			context.strokeRect( 0, 0, canvas.width, canvas.height );

			context.fillStyle = '#000' ;
			context.font = font;

			for ( i = 0; i < textArray.length; i++) {

				context.fillText( textArray[ i ], 10, 48  + i * 60 );

			}

			var texture = new THREE.Texture( canvas );
			texture.minFilter = texture.magFilter = THREE.NearestFilter;
			texture.needsUpdate = true;

			return texture;

		}

	}

