var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.up.set(0, 0, 1);
camera.position.set(-16, -16, 16);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('load', function() {
    document.body.appendChild(renderer.domElement);
});

controls = new OrbitControls(camera, renderer.domElement);

var landscape = require('./landscape.js');
landscape.rotateZ(-Math.PI / 2);
scene.add(landscape);

var axisHelper = new THREE.AxisHelper(50);
scene.add(axisHelper);

// instantiate a loader
var loader = new ColladaLoader();

loader.load(
    // resource URL
    'resources/sample-scene.dae',
    // Function when resource is loaded
    function(collada) {
        scene.add(collada.scene);
    },
    // Function called when download progresses
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }
);

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
};

render();
