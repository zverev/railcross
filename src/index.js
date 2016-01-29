var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');
var alignByLandscape = require('./alignByLandscape.js');

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
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
        alignByLandscape(collada.scene.children, landscape);
        drawBoundingBoxes(collada.scene.children, scene);
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

window.camera = camera;
window.scene = scene;

function drawBoundingBoxes(objects, scene) {
    objects.map(function (object) {
        var bbox = new THREE.BoundingBoxHelper( object, 0xd0f0a0 );
        bbox.update();
        scene.add( bbox );
    });
}
