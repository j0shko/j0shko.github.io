var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var mesh;

var fplRatio = 0.1;

init();
animate();

function init() {
	container = document.createElement('div');
	document.body.appendChild( container );
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	renderer.setClearColor( 0xeef8fc );
	
	container.appendChild( renderer.domElement );
	
	var light = new THREE.AmbientLight( 0xc9c9c9 ); // soft white light
	scene.add( light );
	
	var pointLight = new THREE.PointLight( 0xeef8fc, 1, 100 );
	pointLight.position.set( 1, 1, 3 );
	scene.add( pointLight );
	
	var loader= new THREE.JSONLoader();
	loader.load( 'head.json', function(geometry) {
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load('diffuse.png', function(texture) {
			material = new THREE.MeshPhongMaterial( { map: texture, shininess: 5, morphTargets: true } );
			mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );
		});
		console.log("Loaded mesh successfully");
	})
	
	camera.position.z = 5;
	
	window.addEventListener( 'resize', onWindowResize, false );
}

var fallingLetter;
var risingLetter;

var letterBuffer = [];

function setLetter(letters) {
	console.log("Adding letters to buffer : " + letters);
	for (i = 0; i < letters.length; i++) {
		letterBuffer.unshift(letters[i]);
	}
	risingLetter = letterBuffer.shift();
}

function animate() {
	requestAnimationFrame( animate );
	
	if (mesh !== undefined) {
		console.log("Letter buffer : " + letterBuffer);
		console.log("Rising letter : " + risingLetter);
		console.log("Falling letter : " + fallingLetter);
		var newFalling = fallingLetter;
		var newRising = risingLetter;
		if (risingLetter !== undefined) {
			var value = mesh.morphTargetInfluences[risingLetter];
			console.log("Rising letter - " + risingLetter + " : " + value);
			if (value >= 1) {
				newFalling = risingLetter;
			} else {
				mesh.morphTargetInfluences[risingLetter] += fplRatio;
			}
		}
		if (fallingLetter !== undefined) {
			var value = mesh.morphTargetInfluences[fallingLetter];
			console.log("Falling letter - " + fallingLetter + " : " + value);
			if (value <= 0) {
				if (letterBuffer.length > 0) {
					newRising = letterBuffer.shift();
				} else {
					newRising = undefined;
				}
			} else {
				mesh.morphTargetInfluences[risingLetter] -= fplRatio;
			}
		}
		fallingLetter = newFalling;
		risingLetter = newRising;
		/*
		if (fallingLetter !== undefined) {
			var currentLetterValue = mesh.morphTargetInfluences[currentLetter];
			console.log("Rising letter - " + currentLetter + " : " + currentLetterValue);
			if (currentLetterValue <= 0 && currentLetterRise === false) {
				currentLetter = undefined;
				
			} else {
				if (currentLetterValue >= 1) {
					currentLetterRise = false;
				}
				var change = fplRatio;
				if (currentLetterRise === false) {
					change *= -1; 
				}
				currentLetterValue += change;
				mesh.morphTargetInfluences[currentLetter] = currentLetterValue;
			}
		}
		*/
	}
	
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
}