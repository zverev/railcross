var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
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
// loadScene(config.railroadScene).then(function(s) {
//     s.position.setZ(config.landscapeMaxHeight);
//     scene.add(s);
// })

var createRailroad = require('./railroad.js');
createRailroad().then(function(railroad) {
    railroad.position.setZ(config.landscapeMaxHeight - 0.015);
    scene.add(railroad);
})

var createForest = require('./forest.js');
var forest = null;
createForest().then(function(forst) {
    forest = forst;
    scene.add(forst);
});

var createBushes = require('./bushes.js');
createBushes().then(function(bushes) {
    scene.add(bushes);
});

var createFlag = require('./flag.js');
var flag = null;
createFlag().then(function(flg) {
    flag = flg;
    flag.scale.set(0.0015, 0.0015, 0.0015);
    flag.rotation.y = Math.PI / 2;
    // flag.rotation.x = Math.PI / 4;
    flag.position.set(-3, -12.8, 2.1);
    scene.add(flag);
})

var gridHelper = new THREE.GridHelper(32, 1);
scene.add(gridHelper);

var fpsEl = document.createElement('div');
fpsEl.className = 'fps-counter';
window.addEventListener('load', function() {
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(fpsEl);
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

var sceneHasForest = true;
window.addEventListener('keyup', function(e) {
    if (e.keyCode === 84) {
        // 't' key pressed
        if (sceneHasForest) {
            scene.remove(forest);
        } else {
            scene.add(forest);
        }
        sceneHasForest = !sceneHasForest;
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
    if (flag) {
        flag.animate();
    }
    var cam = renderFromSpectatorCamera ? spectatorCamera : orbitCamera;
    renderer.render(scene, cam);
    snow.material.uniforms.elapsedTime.value = elapsedTime * 2;
    controls.update();
    framesNum++;
}

function drawBoundingBoxes(objects, scene) {
    objects.map(function(object) {
        var bbox = new THREE.BoundingBoxHelper(object, 0xd0f0a0);
        bbox.update();
        scene.add(bbox);
    });
}

var framesNum = 0;
setInterval(function() {
    fpsEl.innerHTML = 'FPS: ' + framesNum;
    framesNum = 0;
}, 1000);
