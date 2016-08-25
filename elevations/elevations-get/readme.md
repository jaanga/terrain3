<span style=display:none; >[You are now in GitHub source code view - click this link to view Read Me file as a web page]
( https://jaanga.github.io/terrain3/#elevations/elevations-get/ "View file as a web page." ) </span>
<input type=button onclick=window.location.href='https://github.com/jaanga/terrain3/tree/gh-pages/elevations/elevations-get/'; value='You are now in GitHub web page view - Click this button to view Read Me file as source code' >

[Jaanga]( http://jaanga.github.io ) &raquo; [terrain3]( https://jaanga.github.io/terrain3/ ) &raquo; 
[elevations]( https://jaanga.github.io/terrain3/#elevations/ ) &raquo;

[Elevations Get Read Me]( https://jaanga.github.io/terrain3/#elevations/elevations-get/ )
===

## Full Screen - stable: [Elevations Get]( https://jaanga.github.io/terrain3/elevations/elevations-get/index.html )

## Full Screen - latest: [Elevations Get]( https://jaanga.github.io/terrain3/elevations/elevations-get/dev/index.html )


<img src="https://cloud.githubusercontent.com/assets/547626/16904516/d98fa098-4c4c-11e6-88f0-e668d12da07c.png" style=display:none; width=800 >

<iframe sandbox='allow-same-origin allow-scripts' src=https://jaanga.github.io/terrain3/elevations/elevations-get/index.html width=800px height=600px onload=this.contentWindow.googleMap.setOptions({scrollwheel:false}); ></iframe>

_Elevations Get_

***

## Concept

This is part of an investigation into writing very simple code that can access the [Google Maps API]( https://developers.google.com/maps/documentation/javascript/tutorial )


### Mission

* Obtain the latest most accurate 3D elevations as quickly and as easily as possible

### Vision

* Create digital terrain models for interesting new uses


## Features

* Obtain latitude and longitude for any location using Google Maps Geocoding
* Given latitude, longitude, zoom level, number of tiles per side, number of samples per side
	* App obtains - using Google Maps API - elevations for every sample
* Choose the quality of the data - can be sub-meter accurate where such data is available
* Respects Google's usage limits
* Tested to 
	* 250,000 elevations gathered in just over an hour.
	* 900 elevations in a few seconds
* Displays elevations in 3D in window
* Save data to a local file
* Reports on many aspects of the of the data 
* Save partial file and restart - much faster

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
	https://jaanga.github.io/terrain3/elevations/elevations-get/elevations-get-r9.js' width=800px height=600 ></iframe>

<input type=button onclick=window.location.href='https://github.com/jaanga/terrain3/tree/gh-pages/elevations/elevations-get/elevations-get-r9.js';
value='Source code listing' >


* Open this file: https://github.com/jaanga/terrain3/tree/gh-pages/elevations/elevations-get/elevations-get-r9.js
* Click the 'Raw' icon and save the raw file to your computer
* Once you've downloaded the file, you can click it to run it.
* Open the file with a text editor


## To Do / Wish List


* Add input tag to edit place name
* Add better height scaling system
* Drag map updates location
* Update 3D Display while drawing 
* Able to do 1000x1000 maps reliably and quickly
* Add ability to send directly to View Elevations 3D Display script in new tab

### Code




## Interesting sites

Fun possibilities for making new maps

* For family and friends
	* Maps of Armenia and China
* Gibralter
* Haiti
* Island Fernando de Noronha, brazil
* http://forums.simviation.com/
* Pythagoreio, Samos Prefecture, Greece
* BGBW Narsarsuaq Airport
* EGNS / isle of Man
* PHOG hawaii
* Walks KML data for Europe

## Issues

* meters per tile is broken


### Usage limits

The Google Maps Elevations API has strict [usage limits]( https://developers.google.com/maps/documentation/elevation/usage-limits ) for downloading elevations.

Figuring out how stay stay under the rate limits and yet be as fast as possible is an amusing challenge.
There seem to be a variety of speed bumps

* No more than 512 elevations in a single ask
* No more than 1000 elevations in under a second
* No more than ?? elevations in under a minute?
* No more than ?? elevations in under x minutes>
 

## Users

Intended for general use


## Goals


## Links of Interest

* https://developers.google.com/maps/documentation/elevation/start
* https://developers.google.com/maps/documentation/geocoding/start


## Change Log


### 2016-08-24 ~ R15

* Partially in smaller modules
	* See google maps api2
	* Code gets tighter and tighter

### 2016-08-22

* Erase all markings with change of center or updates of parameters
* If map center and last click position not equal, give notice and correct if user OKs

Issues mostly dealt with:
* 2016-08-09 ~ All menus into functions
* Erase previous boundaries before a new get elevations
* Add back addresses and lat/lon entry 
* When you load elevations, there must be a way to go there
	* Otherwise wrong elevations requested
* Cannot see some error messages such as rate limit exceeded

### 2016-08-21 ~ R14

* Add tiles object and finally cleaned up the tiles code

### 2016-08-20 ~ R13

* Add 'view elevations full screen' button - opens new tab and transfers data
* Good effort on making variable and function names more obvious
* Big code cleanup

### 2016-08-13 ~ R11

* Big code cleanup

### 2016-08-08 ~ R9

* Continued objectification
* Save to JSON file
* Better handling of origin and file namr text


### 2016-08-05 ~ R8

* Move variable declarations functions into a separate JavaScript file


### 2016-07-29 ~ R7

* Streamline menu
* Cleanup and streamline center tile data
* Add scale indicator to map
* Add open saved file of partial elevations


### 2016-07-28 ~ R6

* Add Google maps API key menu entry and setter
* Many changes

### 2016-07-26 ~ R5

Becoming a large and unweildy script. ;-(

* Mostly objectified
* Add close icon to 3D window
* Add click readout of lat/lon and more
* Save files to single digit accuracy
* Improve saving
* Fixes Not able to close tab or Google Chrome  - for a very, very long time - after saving
* Update menus
	* Add explanatory text
	* More details tags


### 2016-07-21 ~ R4.1

* Add more samples per tile choices

### 2016-07-17 ~ R4

* Enable choice of tile width and height - not just squares
* Enable sample size by tile
* Continue improvements to menu data display
* Revise file naming to place, zoom, upper left tile X, upper left tile Y, tiles X, tiles Y, samples X, samples Y

### 2016-07-14 ~ R3

* Add click to update center
* Add colored markers with lat/lon tool tips in many places
* Add user help messages 
* Re-jig file naming system to use tiles and place names


### 2016-07-11 ~ R2

* Rename to 'elevatuons get'
* Add flight path line;

### 2016-07-09 ~ R10

* Change lat/lon updates location
* Permalinks: Input lat/lon, zoom, place name via location hash
* Many small fixes

### 2016-07-07 ~ R8

* Fix min/max errors when large number of elevations
* Keep correct number of elevations
* Ignoring over_query_limit for most part
* Add delay to console output

### 2016-07-06 ~ R7

* Drop internal 3D display
* Switch to 3D display using iframe
	* Link to 'View Elevation 3D'


### 2016-07-04 ~ R6

* Add 3D display
* Add 3D Display menu items
	* Visible checkbox
	* Wireframe checkbox
	* Auto-rotate checkbox
	* Vertical scale
* Tiles and Samples both dropdown lists


### 2016-07-04 ~ R5

* Update meta data
* Add new Jaanga titling
* Add Google Maps Geocoding to get lan & lon of any location
* Move messages into textarea

### 2016-07-03 ~ R4

* Add about box
* Add messages div, re-jig elevations messages
* Add tiles input
* Adjust menu spacing
* Add selective delay
* Add multi-tile capability
* UI to set samples and tiles
* Display borders of individual tiles
* Fix a variety of variable-related errors


### 2016-07-02 ~ R3

* Menu uses details/summary
* Many updates to the data display
* Add zoom and samples input
* Add latitude/longitude input
* Add link to OSM source of algorithms for lat/lon to tile numbers and vice versa


### 2016-07-01 ~ R2

* Update read me / add index

### 2016-06-30 ~ R1

* First commit
* Add Read Me


***

<center title='Jaanga ~ your 3D happy place' >
# <a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > ❦ </a>
</center>
