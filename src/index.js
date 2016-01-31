var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(-16, -16, 16);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

controls = new OrbitControls(camera, renderer.domElement);

// landscape
var landscape = require('./landscape.js');
landscape.rotateZ(-Math.PI / 2);
scene.add(landscape);

// axes
var axisHelper = new THREE.AxisHelper(50);
scene.add(axisHelper);

// sample scene
loadScene('resources/sample-scene.dae').then(function (s) {
    scene.add(s);
})

window.addEventListener('load', function() {
    document.body.appendChild(renderer.domElement);
});

render();

window.camera = camera;
window.scene = scene;
window.land = landscape;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
}

function loadScene(url) {
    return new Promise(function(resolve, reject) {
        // instantiate a loader
        var loader = new ColladaLoader();

        loader.load(
            // resource URL
            url,
            // Function when resource is loaded
            function(collada) {
                resolve(collada.scene);
                drawBoundingBoxes(collada.scene.children, scene);
            },
            // Function called when download progresses
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }
        );
    });
};

function drawBoundingBoxes(objects, scene) {
    objects.map(function(object) {
        var bbox = new THREE.BoundingBoxHelper(object, 0xd0f0a0);
        bbox.update();
        scene.add(bbox);
    });
}
