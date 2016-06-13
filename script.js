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

var fallingLetter = null;
var risingLetter = null;

var letterBuffer = [];

function setLetter() {
	for (i = arguments.length - 1; i >= 0; i--) {
		console.log("Adding letter to buffer : " + arguments[i]);
		letterBuffer.unshift(arguments[i]);
	}
	console.log(letterBuffer);
	risingLetter = letterBuffer.shift();
	fallingLetter = null;
	console.log("First letter " + risingLetter);
}

function animate() {
	requestAnimationFrame( animate );
	
	if (mesh !== null) {
		if (risingLetter !== null) {
			console.log("Rising letter - " + risingLetter + " : " + mesh.morphTargetInfluences[risingLetter]);
		}
		if (fallingLetter !== null) {
			console.log("Falling letter - " + fallingLetter + " : " + mesh.morphTargetInfluences[fallingLetter]);
		}
		if (risingLetter !== null) {
			var value = mesh.morphTargetInfluences[risingLetter];
			if (value >= 1) {
				fallingLetter = risingLetter;
				if (letterBuffer.length > 0) {
					risingLetter = letterBuffer.shift();
					mesh.morphTargetInfluences[risingLetter] +=fplRatio;
				} else {
					risingLetter = null;
				}
				mesh.morphTargetInfluences[fallingLetter] -= fplRatio;
			} else {
				mesh.morphTargetInfluences[risingLetter] += fplRatio;	
				if (fallingLetter !== null) {
					mesh.morphTargetInfluences[fallingLetter] -= fplRatio;
				}
			}
		} else if (fallingLetter !== null) {
			var value = mesh.morphTargetInfluences[fallingLetter];
			if (value <= 0) {
				fallingLetter = null;
			} else {
				mesh.morphTargetInfluences -= fplRatio;
			}
		}
	}
	
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
}