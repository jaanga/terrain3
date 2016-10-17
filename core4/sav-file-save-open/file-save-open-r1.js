
	var SAV = SAV || {};

	SAV.getMenuDetailsSaveOpen = function() {

		var menuDetailsSaveOpen  =

			'<details id=SAVdetailsSaveOpen open >' +

				'<summary id=SAVmenuSummarySaveOpen ><h3>SaveOpen</h3></summary>' +

				'<div id=SAVdivOpen >' +

				'<p>' +

					'<input type=file id=inpFile onchange=SAV.openFile(this); >' +

				'</p>' +

				'<div id=SAVdivOpenFile ></div>' +

				'<textarea id=textArea style=height:500px;overflow:auto;width:100%; ></textarea>' +

				'</div>' +

				'<p>' +

					'<button onclick=SAV.saveFile(); >save file</button>' +

				'</p>' +

			'</details>' +

		b;

		return menuDetailsSaveOpen;

	};


	SAV.saveFile = function() {

// http://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/

		var place = COR.place;
		var pl, blob, a;

		place.fileName = '' +

			place.origin.toLowerCase() + '_'  +
			place.zoom + '_' +
			place.ULtileX + '_' +
			place.ULtileY + '_' +
			place.tilesX + '_' +
			place.tilesY + '_' +
			place.samplesX + '_' + 
			place.samplesY + '_' +
			'.json';

		pl = JSON.stringify( place );
		pl = pl.replace ( /,\"/g, ',\n"' );
		blob = new Blob( [ pl ] );

		a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = place.fileName;
		a.click();

//		delete a;

		a = null;

	};

	SAV.openFile = function( files, type ) {

		var fileData, reader, data;

		reader = new FileReader();
		reader.onload = function( event ) {

				COR.place = JSON.parse( reader.result );

				if ( COR.place.latitude ) {

					CLK.setCenter(  COR.place.latitude, COR.place.longitude );

				}

				row =  COR.place.elevations.length / COR.place.samplesX;

				textArea.innerHTML = reader.result;

				SAVdivOpenFile.innerHTML =

					'file: ' + files.files[0].name + b +
					'Samples width: ' + COR.place.samplesX + b +
					'Rows scanned: ' + row + b +

				b;

//				place.resolutions = [];
//				count = row;
//				nextElevations();
//console.log( 'elevations', place.elevations );
//console.log( '', files.files[0].lastModifiedDate );

		};

		reader.readAsText( files.files[0] );

	}
