var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var mesh;

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
	loader.load( 'cube.json', function(geometry) {
		var vertices = [];
		for (var vertex in geometry.vertices) {
			vertices.push(vertex.x * 2);
			vertices.push(vertex.y * 2);
			vertices.push(vertex.z * 2);
		}
		geometry.morphTargets.push({ name: "fullScale", vertices: vertices });
		
		mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x2194ce, specular: 0x111111, shininess: 30 } ) );
		scene.add( mesh );
		console.log("Loaded mesh successfully");
	
		//mesh.updateMorphTargets();
		//mesh.morphTargetBase = 0;
		//mesh.morphTargetInfluences[1] = 1;
		//mesh.morphTargetInfluences[2] = 0.5;
	})
	
	geometry = new THREE.BoxGeometry( 1, 1, 1 );
	console.log(geometry.vertices);
	
	camera.position.z = 5;
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
	requestAnimationFrame( animate );
	
	if (mesh !== undefined) {
		mesh.rotation.x += 0.001;
		mesh.rotation.y += 0.01;
	}
	
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
}