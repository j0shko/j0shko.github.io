var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var mesh;

var fplRatio = 0.2;

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

var currentLetter;
var currentLetterRise;
var nextLetter;

var letterBuffer = [];

function setLetter(a) {
	currentLetter = a;
}

function animate() {
	requestAnimationFrame( animate );
	
	if (mesh !== undefined) {
		if (currentLetter !== undefined) {
			var currentLetterValue = mesh.morphTargetInfluences[currentLetter];
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
	}
	
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
}