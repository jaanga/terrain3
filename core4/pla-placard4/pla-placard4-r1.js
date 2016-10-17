// 2016-10-14 ~ https://github.com/jaanga/jaanga.github.io/tree/master/cookbook-threejs/examples/placards


	var PLA = PLA || {};

// 'Sprites' are images that always face toward the camera

	PLA.drawSprite = function( text, scale, color, x, y, z, rounded ) {

// 2016-02-27 ~ https://github.com/jaanga/jaanga.github.io/tree/master/cookbook-threejs/examples/placards

		var texture;

		var placard = new THREE.Object3D();
		var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

		if ( text ) { 

			if ( rounded ) {

				texture = PLA.canvasMultilineTextRounded( text, { fillColor: color } );

			} else {

				texture = PLA.canvasMultilineText( text, { fillColor: color } );

			}

		} else {

			texture = PLA.canvasRandomLines( { fillColor: color, lineWidth: 8 }   );

		}

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

	};


	PLA.canvasMultilineText = function( textArray, parameters ) {

		var canvas, context, parameters;
		var width, font, fillColor, strokeColor, strokeWidth;

		canvas = document.createElement( 'canvas' );
		context = canvas.getContext( '2d' );

		parameters = parameters || {} ;
		width = parameters.width || 0;
		font = parameters.font || '48px monospace';
		fillColor = parameters.fillColor || 120 ;
		strokeColor = parameters.strokeColor || Math.floor( 255 * Math.random() );

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( var i = 0; i < textArray.length; i++) {

			width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

		}

		canvas.width = width + 20;
		canvas.height =  parameters.height ? parameters.height : textArray.length * 65;

		context.fillStyle = 'hsl( ' + fillColor + ', 80%, 50% )' ;
		context.fillRect( 0, 0, canvas.width, canvas.height);

		context.lineWidth = 8 ;
		context.strokeStyle = 'hsl( ' + strokeColor + ', 80%, 50% )' ;
		context.strokeRect( 0, 0, canvas.width, canvas.height );

		context.fillStyle = 'hsl( ' + strokeColor + ', 80%, 50% )' ;
		context.font = font;

		for ( i = 0; i < textArray.length; i++) {

			context.fillText( textArray[ i ], 10, 48  + i * 60 );

		}

		var texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}


	PLA.canvasMultilineTextRounded = function( textArray, parameters ) {

		var canvas, context, parameters;
		var width, font, fillColor, strokeColor, strokeWidth;

		canvas = document.createElement( 'canvas' );
		context = canvas.getContext( '2d' );

		parameters = parameters || {} ;
		width = parameters.width || 0;
		font = parameters.font || '48px monospace';
		fillColor = parameters.fillColor || 120 ;
		strokeColor = parameters.strokeColor || Math.floor( 255 * Math.random() );

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( var i = 0; i < textArray.length; i++) {

			width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

		}

		canvas.width = width + 20;
		canvas.height =  parameters.height || textArray.length * 65;

		context.lineWidth = parameters.lineWidth || 3;
		halfWidth = 0.5 * context.lineWidth;

		var width = canvas.width
		var height = canvas.height
		radius = 20;
		startX = 0;
		startY = 0;

		context.beginPath();
		context.strokeStyle = 'hsl( ' + strokeColor + ', 80%, 50% )' ;
		context.moveTo( startX + radius + halfWidth, startY + halfWidth );
		context.arcTo( width - halfWidth, startY + halfWidth, width - halfWidth, startY + radius + halfWidth, radius );
		context.arcTo( width - halfWidth, height - halfWidth, width - radius - halfWidth, height - halfWidth, radius );

		context.arcTo( startX + halfWidth, height - halfWidth, startX + halfWidth, height - radius - halfWidth, radius );
		context.arcTo( startX + halfWidth, startY + halfWidth, startY + radius + halfWidth, startY + halfWidth, radius );
		context.closePath();
		context.stroke();
		context.fillStyle = 'hsl( ' + fillColor + ', 80%, 50% )' ;
		context.fill();

		context.fillStyle = 'hsl( ' + strokeColor + ', 80%, 50% )' ;
		context.font = font;

		for ( i = 0; i < textArray.length; i++) {

			context.fillText( textArray[ i ], 10, 48 + i * 60 );

		}

		var texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}



	PLA.canvasRandomLines = function( parameters ) {

		var canvas, context, parameters;
		var width, font, fillColor, strokeColor, strokeWidth;
		var ran = Math.random;

		canvas = document.createElement( 'canvas' );
		context = canvas.getContext( '2d' );

		parameters = parameters || {} ;
		fillColor = parameters.fillColor ? parameters.fillColor : 120 ;
		strokeColor = parameters.strokeColor || Math.floor( 255 * Math.random() );

		canvas.width =  parameters.width || 300 + 200 * ran();
		canvas.height =  parameters.height || 300 + 200 * ran();

		context.lineWidth = parameters.lineWidth || 3;
		halfWidth = 0.5 * context.lineWidth;

		var width = canvas.width
		var height = canvas.height
		var radius = 80
		startX = 0;
		startY = 0;

		context.beginPath();
		context.moveTo( startX + radius + halfWidth, startY + halfWidth );
		context.arcTo( width - halfWidth, startY + halfWidth, width - halfWidth, startY + radius + halfWidth, radius );
		context.arcTo( width - halfWidth, height - halfWidth, width - radius - halfWidth, height - halfWidth, radius );

		context.arcTo( startX + halfWidth, height - halfWidth, startX + halfWidth, height - radius - halfWidth, radius );
		context.arcTo( startX + halfWidth, startY + halfWidth, startY + radius + halfWidth, startY + halfWidth, radius );
		context.closePath();
		context.stroke();
		context.fillStyle = 'hsl( ' + fillColor + ', 80%, 50% )' ;
		context.fill();


		context.beginPath();
		context.moveTo( canvas.width * ran(), canvas.height * ran() );
		for ( i = 0; i < 15; i++) {

			context.lineTo( canvas.width * ran(), canvas.height * ran() );

		}
		context.closePath();
		context.stroke();
		context.fillStyle = 'hsl( ' + strokeColor + ', 80%, 50% )' ;
		context.fill();


		var texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

		}


	PLA.convertPosition = function( lat, lon, radius ) {

		var rc = radius * Math.cos( lat * d2r );
		return v( rc * Math.cos( - lon * d2r ), radius * Math.sin( lat * d2r ), rc * Math.sin( - lon * d2r) );

	};



// older

	PLA.drawPlaceNearby = function() {


		var cpn, n, delta, height;

		height = COR.place.plaHeight || 0.00005;

		THR.scene.remove( PLA.nearby );

		PLA.nearby = new THREE.Object3D();

		if ( !COR.place.nearby ) { return; }

		cpn = COR.place.nearby;

		MAP.boxHelper.updateMatrixWorld()
		MAP.boxHelper.geometry.computeBoundingBox()

		delta = MAP.boxHelper.geometry.boundingBox.max.y - MAP.boxHelper.geometry.boundingBox.min.y;

//		height = 1 / ( COR.place.verticalScale * COR.place.verticalScale * COR.place.zoom * COR.place.zoom * 10 )
//		height = 0.00005;
// console.log( 'height', height );

		for ( var i = 0; i < cpn.length; i++ ) {

			n = cpn[ i ];

			nearby = PLA.drawPlacard( n.name, height, 30, 0, delta, 0 );
			nearby.position.set( n.lon, MAP.boxHelper.geometry.boundingBox.min.y, - n.lat );
			nearby.name = n.name;

			PLA.nearby.add( nearby );

		}

		THR.scene.add( PLA.nearby );

		PLA.nearby.visible = TERchkNearby.checked;

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
			var color = parameters.backgroundColor ? parameters.backgroundColor : 20 ;

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
