<span style=display:none; >[You are now in a GitHub source code view - click this link to view the home page]
( httpa://jaanga.github.io/terrain3/#coding-style.md "View file as a web page." )</span>
<input type=button onclick=window.location.href='https://github.com/jaanga/terrain3/blob/gh-pages/coding-style.md'; 
value='You are now in the home page view - Click this button to view the read me file and the source code' >

[jaanga]( https://jaanga.github.io ) &raquo; [terrain3]( https://jaanga.github.io/terrain3/  ) &raquo;

[Terrain3 Coding Style]( https://jaanga.github.io/terrain3/#coding-style.md )
===


## Cookbook Format

Sometimes known as 'Cut and Paste' coding

The code herein is:

* Made up of individual HTML files
	* Each file contains all the styling and JavaScript it requires
* Minimal external dependecies
	* Only Three.js and ShowDown
	* Can copy and paste code into a file on your computer, hit `enter` and it runs
* Designed for students and non-programmers
	* Any script can be 'digested' in less than an hour


## Client-side not server-side

* Scripts must access a GPU
	* 'Cause no GPU then no 3D
	* Can be edited and run on any device
* Means can be hosted on static servers
	* Such as GitHub, DropBox or GDrive
	* So penniless kids around the world can play and experiment


## Everything in Git plus more

* Everything gitted in GitHub
* AND code in older releases is not just viewable BUT also runnable
	* You can see the evolution of the design process
	* Think of an artist and a sketchbook

## 3D is not 2D

* 3D is its own special world
	* You get, say, 18 milleseconds about 60 times a second
	* You need to multiply, say, a 1000x1000 matrix by 0x456789
	* Crazy stuff happens
	* jQuery, React, Go whatever are of no use at all here - and mostly just get in the way
	* Needs it own way
	* Therefore, simply, follow Mr.doob - author of Three.js
* Communucate to the 2D world using iframes
	* Just about every script here has been tested in an iframe
	* 3Dcripts in iframes are happy having ongoing dialogs with their 2D parents

## Design and develop for the future / Build production for the past

* We are here to teach peeps how to code
* We start with the easiest and simplest methods
* Newer versions of JavaScript are usually simpler than previous version
	* Example: doctype
	* script tag
* Because code our uses the latest, it often hases issues with legacy apps
	* Safari and iOS we are looking at you


 
## Links of interest

Examples of coding styles similar to the one used here:

* [Three.js Examples]( http://threejs.org/examples/ )
* [Stemkoski]( http://stemkoski.github.io/Three.js/ )
* [Dirksen ]( http://www.smartjava.org/content/all-109-examples-my-book-threejs-threejs-version-r63 )
* [Parisi]( https://github.com/tparisi/WebGLBook )

See also

* [Mr.doob's Code Style™]( https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2 )



## Change Log

### 2016-08-04

* First commit
* Add Read Me


***

<center title='FGx ~ a place to fly' >
# <a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > ❦ </a>
</center>
