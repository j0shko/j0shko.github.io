var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var mesh;

var fplRatio = 0.1;

var implemented_letters = [];

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
	pointLight.position.set( 1, 4, 4 );
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
	
	initImplementedLetters();
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function initImplementedLetters()  {
	implemented_letters["a"] = 1;
	implemented_letters["o"] = 2;
	implemented_letters["u"] = 3;
	implemented_letters["e"] = 4;
	implemented_letters["f"] = 5;
	implemented_letters["r"] = 6;
}

function sayText(text) {
	if (!text || 0 === text.trim().length) {
		return;
	}
	morphTargetsIndexes = [];
	text = text.trim().split('')
	for (i in text) {
		letter = text[i];
		if (letter in implemented_letters) {
			morphTargetsIndexes.push(implemented_letters[letter]);
		} else {
			console.log("Input contains unimplemented letter: " + letter);
			return;
		}
	}
	fillBuffer.apply(this, morphTargetsIndexes);
}

var fallingLetter = null;
var risingLetter = null;

var letterBuffer = [];

function fillBuffer() {
	letterBuffer = [];
	risingLetter = null;
	fallingLetter = null;
	
	mesh.morphTargetInfluences[risingLetter] = 0;
	mesh.morphTargetInfluences[fallingLetter] = 0;
	
	for (i = arguments.length - 1; i >= 0; i--) {
		letterBuffer.unshift(arguments[i]);
	}
	risingLetter = letterBuffer.shift();
}

function animate() {
	requestAnimationFrame( animate );
	
	if (mesh !== undefined) {
		if (risingLetter !== null) {
			var value = mesh.morphTargetInfluences[risingLetter];
			if (value >= 1) {
				mesh.morphTargetInfluences[risingLetter] = 1;
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
				mesh.morphTargetInfluences[fallingLetter] -= fplRatio;
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