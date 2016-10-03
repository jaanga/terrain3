
## Concept


Most map apps display geography in flat 2D. Yes, some apps indicate building height and shadows. Some show contour lines.

The earth is covered in oceans and mountains, some places are bumpy and others are smooth.

We need to be able to see and feel this lumpiness.

Very few apps show this in 3D. Even fewer are FOSS. And almost none let you create, and edit your own terrain data.

This project is an attempt to remedy the situation.



### Mission

* Read elevation files and create 3D display
* Get data via iframe parent, file open dialog or location.hash
* Work well in an iframe

### Vision

* TBD

## Features

* TBD
* Click three bars( "hamburger" ) icon to slide menu in or out
* Direct link to this read me file
* Click on title to reload 



## To Do / Wish List

* Codebase
	* Create DEF file
* Plugins
	* 2016-08-22 ~ Add OBJ files
	* 2016-08-22 ~ Analemmas
	* Add pokemons?
	* 2016-08-11 ~ Add physics
	* Add accurate elevation measurement
		* Clock to read altitude
		* Accurate vertical scale readout
	* Add voice
	* geoJSON
	* CodePen Maps
	* Fiddle maps
* Paths ~ KML * CSV
	* 2016-10-02 Add current frame slider
	* Editing splines
* View settings
	* 2016-08-05 ~ Add skybox
	* 2016-08-11 ~ Add fog controls
*Overlay settings
	* Add more overlays?
* Terrain settings
	* 2016-08-15 ~ Add resolution details


## Issues

## Users


Intended for generating flightpaths

* [FGx Sandbox]( http://fgx.github.io/sandbox/index.html )




## Goals

## Links of Interest



## Things you can do using this script

* Use one/two/three fingers to rotate/zoom/pan the display in 3D
	* Or left/scroll/right with your pointing device 
* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the check box to display mesh as solid or wireframe
* Click the 'I' in the circle to go to the read me file
* Click on the title to reload the script
* Click the [Stats]( https://github.com/mrdoob/stats.js/ ) box in the top corner to toggle FPS / MS / MB views
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors



## Change Log


### 2016-10-02 ~ core3

Done

* Codebase
	* 2016-08-11 ~ Add overall name space
	* 2016-08-11 ~ Add separate init file
* Plugins
	* Add placards/signs
	* Link to escape iframe
	* 2016-08-13 ~ Google nearby places
	* 2016-08-11 ~ Add easy to make animated GIF
	* 2016-08-05 ~ Save changes to data file
* View settings
	* 2016-08-19 ~ for camera controllers everywhere
		* Smooth Fly controls parameters
	* 2016-08-05 ~ Add skybox, background
* Path Settings
	* Headings, pitch and roll everywhere
* View settings
	* 2016-08-19 ~ Add view settings menu item
	* 2016-08-15 ~ Add autoRotate checkbox

### 2016-08-15 ~ R1.1

* 2016-08-11 ~ Add read KML < see: elevations view path kml
* Add select searchInFolder by location.hash

### 2016-08-11 ~ R1

* Rename to simply 'elevations view rxx'
* 2016-08-11 ~ Fix half tile off error
* 2016-08-11 ~ Add location.hash

### 2016-08-10 ~ R11

* Many changes
* Vertical scale slide no OK
* Update mapZoomLevel
* Save file: no tabs and line feeds
* 2016-08-05 ~ JSON data file that takes all kinds of data
* Info about metres per side of map
* 2016-08-05 ~ add paths

### 2016-08-05 ~ R7.3

* Minor cleanup
* Dump processFile functions. Can do everything from parent

### 2016-08-01 ~ R7.2

* Looking good
* New scene with each load helps a lot
* Metadata added to all files
* Folder renamed to 'elevations view'
* Continued with variable and procedure renaming
	* Beginning to feel organized
* Cleaned up overlaying and zooming


### 2016-07-31 ~ R7

* Many changes
* Reads data embedded in elevations file
	* Converts text to variables
* Menus streamlined and cleaned up
* Continue work on logical var and procedure names



### 2016-07-28 ~ R5

* Many changes
* All objectified and in .js file.
* Zoom to radius on mesh
* Update camara and target to center of mesh
* Add sea level indicator - plain mesh at sea level
* Select tile overlay zoom level to control quality of overlay
 
* Add Google to about

### 2016-07-20 ~ R1

* Rename to 'elevations-view-3d-core' to align with folder came
* Code cleanup, and variable name tidy
* Add bounding box to display 
* Edit menu

### 2016-07-19 ~ R6/R7

Code - except for heights - all seems to handle most of the issues. 
But it can use a streamline / cleanup effort

* Calculates and displays in decimal degrees
* Add 'overlay details section to menu
* Add link to 'elevations get'


### 2016-07-17 ~ R5

* Many updates
* Able to read elevations with varying tile width and height
* Ditto samples per side
* Able to display TMS overlays of user selected zoom levels


### 2016-07-07 ~ R2

* Load file via location.hash

### 2016-07-06 ~ R1

* First commit
* Add Read Me



