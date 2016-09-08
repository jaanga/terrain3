<span style=display:none; >[You are now in GitHub source code view - click this link to view Read Me file as a web page]
( https://jaanga.github.io/terrain3/#sandbox/elevations-view-oakland-gran-fondo/ "View file as a web page." ) </span>
<input type=button onclick=window.location.href='https://github.com/jaanga/terrain3/tree/gh-pages/sandbox/elevations-view-oakland-gran-fondo/'; value='You are now in GitHub web page view - Click this button to view Read Me file as source code' >

[Jaanga]( http://jaanga.github.io ) &raquo; [terrain3]( https://jaanga.github.io/terrain3/ ) &raquo;
[sandbox]( https://jaanga.github.io/terrain3/#elevations/ ) &raquo;


[Oakland Gran Fondo 2016 ~ 3D Route Viewer Read Me]( https://jaanga.github.io/terrain3/#sandbox/elevations-view-oakland-gran-fondo/ )
===


## full screen: [Oakland Gran Fondo 2016 ~ 3D Route Viewer R6]( https://jaanga.github.io/terrain3/sandbox/elevations-view-oakland-gran-fondo/index.html )
## Full screen - 'dev' release: [Oakland Gran Fondo 100 2016 ~ 3D Route Viewer R7]( https://jaanga.github.io/terrain3/sandbox/elevations-view-oakland-gran-fondo/dev/index.html )

## Concept

Load and replay a Google Earth KML path into a map and display it in 3D.


<img src="" style=display:none; width=800 >

<iframe src="https://jaanga.github.io/terrain3/sandbox/elevations-view-oakland-gran-fondo/index.html" width=800px height=500px onload=this.contentWindow.controls.enableZoom=false; ></iframe>

_Oakland Gran Fondo 2016 ~ 3D Route Viewer_

***

## Issues


## Links of Interest


* [Oakland Gran Fond)( http://www.oaklandgranfondo.com/ )
	* The Oakland Gran Fondo in Jack London Square. Rides of 13.5, 28, 55, &amp; 100 miles highlight Downtown Oakland, East Bay Hills &amp; Valley&#039;s.  Join this
* [Petite Oakland Gran Fondo - 28M]( https://www.strava.com/routes/6190234 )
* [Oakland Gran Fondo - 55]( https://www.strava.com/routes/5700000 )
* [Okaland Gran Fondo 100]( https://www.strava.com/routes/5698881 )
* [Strava]( https://www.strava.com/onboarding )
* Translate files: [Veloroutes]( http://veloroutes.org/upload/ )
## Change Log


### 2016-09-07 ~ R7

* Complete rebuild
* JavaScript split into nine small files
* Each file has its own unique namespace JavaScript parent object
	* The object name also appears in the file name and in the folder name
	* You can identify the source and location of declaration for every function and variable just by looking at its name
		* Reduces the hunting through files to find the source
* Progress in building a template system
	* Each file has its own parent HTML file for viewing and testing in isolation
	* Each file can load any menu it needs at load time
	* Each file can manipulate the Three.js scene, after the scene has been created
	* All scheduling and callback handling carried out by simple, easy to understand functions
* Support four separate camera protocols
	* World camera: camera fixed at position in the air, follows nothing
	* Track camera: camera fixed at position on ground, follows actor
	* Chase camera: camera fixed inside actor, follows a point just ahead of the actor
	* Inside camera: camera fixed a distance from actor, follows actor position and rotation
* Slight temporary reduction in some feature
	* Old and new features to be introduced in the next few days


### 2016-09-01 ~ R6

* Settling down a bit

### 2016-08-19 ~ R4

* Added the four cameras
	* Took a while


### 2016-08-12 ~ R1

* First commit script and read me
* Add ability to acquire altitude for each 2D way point and turn into 3D



***

<center title='Jaanga ~ your 3D happy place' >
# <a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > ❦ </a>
</center>
