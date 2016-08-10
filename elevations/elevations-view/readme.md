<span style=display:none; >[You are now in GitHub source code view - click this link to view Read Me file as a web page]
( https://jaanga.github.io/terrain3/#elevations/elevations-view/ "View file as a web page." ) </span>
<input type=button onclick=window.location.href='https://github.com/jaanga/terrain3/tree/gh-pages/elevations/elevations-view/'; value='You are now in GitHub web page view - Click this button to view Read Me file as source code' >

[Jaanga]( http://jaanga.github.io ) &raquo; [terrain3]( https://jaanga.github.io/terrain3/ ) &raquo; 
[elevations]( https://jaanga.github.io/terrain3/#elevations/ ) &raquo;

[Elevations View Read Me]( https://jaanga.github.io/terrain3/#elevations/elevations-view/ )
===

_Interact with maps in 3D_

## Full Screen: [Elevations View ]( https://jaanga.github.io/terrain3/elevations/elevations-view/index.html )


<img src="https://cloud.githubusercontent.com/assets/547626/17420676/0f062930-5a59-11e6-9e9d-040cdfaddbd6.png" style=display:none; width=800 >

<iframe src="https://jaanga.github.io/terrain3/elevations/elevations-view/index.html" width=800px height=600px onload=this.contentWindow.controls.enableZoom=false; ></iframe>

_[Elevations View ]( https://jaanga.github.io/terrain3/elevations/elevations-view/index.html )_

***

## Concept




### Mission

* Read elevation files and create 3D display
* Get data via iframe parent, file open dialog or location.hash
* Work well in an iframe


### Vision

* TBD


## Features

* TBD


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



## Things you can do by editing the code

<iframe src='https://jaanga.github.io/cookbook-html/examples/libraries/ace-editor/ace-view-r1.html#
	https://jaanga.github.io/terrain3/elevations/elevations-view/elevations-view-3d-core-r9.js' width=100% height=600 ></iframe>

<input type=button onclick=window.location.href='https://github.com/jaanga/jaanga.github.io/tree/gh-pages/terrain3/elevations/elevations-view/elevations-view-3d-core-r9.js';
value='Source code listing' >


* Open this file: https://github.com/jaanga/jaanga.github.io/tree/gh-pages/terrain3/elevations/elevations-view/elevations-view-3d-core-r9.js
* Click the 'Raw' icon and save the raw file to your computer
* Once you've downloaded the file, you can click it to run it.
* Open the file with a text editor


## To Do / Wish List

* 2016-08-05 ~ Save changes to data file
* 2016-08-05 ~ JSON data file that takes all kinds of data
* 2016-08-05 ~ add paths
* 2016-08-05 ~ Add skybox, background
* Add pokemons?
* Add placards
* Info about metres per side of map
* Accurate elevation measurement
* Link to escape iframe
* More overlays?



## Issues


## Users

Intended for generating flightpaths

* [FGx Sandbox]( http://fgx.github.io/sandbox/index.html );


## Goals


## Links of Interest


## Change Log

### 2016-08-10 ~ R11

* Many changes
* Vertical scale slide no OK


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


***

<center title='Jaanga ~ your 3D happy place' >
# <a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > ❦ </a>
</center>
