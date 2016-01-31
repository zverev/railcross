var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

var scene = new THREE.Scene();

var orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
orbitCamera.position.set(-16, -16, 16);
orbitCamera.lookAt(scene.position);

var spectatorCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
spectatorCamera.position.set(-5.72, -15.27, 3.00);
spectatorCamera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

controls = new OrbitControls(orbitCamera, renderer.domElement);

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

var renderFromSpectatorCamera = false;
window.addEventListener('keyup', function (e) {
    if (e.keyCode === 83) {
        // 's' key pressed
        renderFromSpectatorCamera = !renderFromSpectatorCamera;
    }
})

render();

window.orbitCamera = orbitCamera;
window.scene = scene;
window.land = landscape;

function render() {
    requestAnimationFrame(render);
    var cam = renderFromSpectatorCamera ? spectatorCamera : orbitCamera;
    renderer.render(scene, cam);
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
