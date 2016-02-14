var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');
var config = require('./config.js');

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(config.bgColor, config.fogDensity);

var light = new THREE.HemisphereLight(config.bgColor, config.lightColor, config.lightIntensity);
scene.add(light);

var orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
orbitCamera.position.set.apply(orbitCamera.position, config.orbitCameraPosition);
orbitCamera.lookAt(scene.position);

var spectatorCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
spectatorCamera.position.set.apply(spectatorCamera.position, config.spectatorCameraPosition);
spectatorCamera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(config.bgColor);

controls = new OrbitControls(orbitCamera, renderer.domElement);

// landscape
var landscape = require('./landscape.js');
landscape.rotateZ(-Math.PI / 2);
scene.add(landscape);

// snow
var snow = require('./snow.js');
snow.position.y -= 8;
scene.add(snow);

// axes
var axisHelper = new THREE.AxisHelper(50);
scene.add(axisHelper);

// sample scene
loadScene(config.railroadScene).then(function(s) {
    s.position.setZ(config.landscapeMaxHeight);
    scene.add(s);
})

var createForest = require('./forest.js');
createForest().then(function (forest) {
    scene.add(forest);
});

var gridHelper = new THREE.GridHelper(32, 1);
scene.add(gridHelper);

window.addEventListener('load', function() {
    document.body.appendChild(renderer.domElement);
});

window.addEventListener('resize', function() {
    [orbitCamera, spectatorCamera].map(function(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // controls.handleResize();
})

var renderFromSpectatorCamera = true;
window.addEventListener('keyup', function(e) {
    if (e.keyCode === 83) {
        // 's' key pressed
        renderFromSpectatorCamera = !renderFromSpectatorCamera;
    }
});

window.addEventListener('keyup', function(e) {
    if (e.keyCode === 70) {
        // 'f' key pressed
        if (scene.fog.density === config.fogDensity) {
            scene.fog.density = 0.0;
        } else {
            scene.fog.density = config.fogDensity;
        }
    }
});

var sceneHasSnow = true;
window.addEventListener('keyup', function(e) {
    if (e.keyCode === 78) {
        // 'n' key pressed
        if (sceneHasSnow) {
            scene.remove(snow);
        } else {
            scene.add(snow);
        }
        sceneHasSnow = !sceneHasSnow;
    }
});

var clock = new THREE.Clock();

render();

window.orbitCamera = orbitCamera;
window.spectatorCamera = spectatorCamera;
window.scene = scene;
window.land = landscape;

function render() {
    var elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(render);
    var cam = renderFromSpectatorCamera ? spectatorCamera : orbitCamera;
    renderer.render(scene, cam);
    snow.material.uniforms.elapsedTime.value = elapsedTime * 2;
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
