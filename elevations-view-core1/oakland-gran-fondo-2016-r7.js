
	SEL.defaultFile = '../../elevations-view-oakland-gran-fondo/oakland-gran-fondo-100-r1_11_328_791_3_3_510_510_.txt';

	var cameraOffsetChase = v( -5 * zoomScale, 5 * zoomScale, -5 * zoomScale );
	var cameraOffsetInside = v( 0.5 * zoomScale, 2 * zoomScale, -0.5 * zoomScale );
	var cameraOffsetTrack = v( -20 * zoomScale, 20 * zoomScale, 0 * zoomScale );
	var cameraOffsetWorld = v( 0 * zoomScale, 30 * zoomScale, 30 * zoomScale );

	THR.moreThreejsInits = function() {

		CAS.getActorBitmap( '../logo-beb-main-site.png' );

		CAS.cameraTrack();

		animatePlus = CAS.animatePlusLookAt;

		animatePlus();

	};
