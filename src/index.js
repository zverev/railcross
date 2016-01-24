var fs = require('fs');
var path = require('path');
var THREE = window.THREE = require('three');
var OrbitControls = require('./OrbitControls');
var ColladaLoader = require('./ColladaLoader');
var heightmapVShader = fs.readFileSync(path.join(__dirname, 'heightmap.vshader'), 'utf-8');
var heightmapFShader = fs.readFileSync(path.join(__dirname, 'heightmap.fshader'), 'utf-8');

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

// texture used to generate "bumpiness"
var bumpTexture = new THREE.ImageUtils.loadTexture('resources/heightmap.png');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
// magnitude of normal displacement
var bumpScale = 1.5;

var oceanTexture = new THREE.ImageUtils.loadTexture('resources/dirt-512.jpg');
oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

var sandyTexture = new THREE.ImageUtils.loadTexture('resources/sand-512.jpg');
sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

var grassTexture = new THREE.ImageUtils.loadTexture('resources/grass-512.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

var rockyTexture = new THREE.ImageUtils.loadTexture('resources/snow-rocks-512.jpg');
rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;

var snowyTexture = new THREE.ImageUtils.loadTexture('resources/snow-512.jpg');
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

var customUniforms = {
    bumpTexture: {
        type: "t",
        value: bumpTexture
    },
    bumpScale: {
        type: "f",
        value: bumpScale
    },
    oceanTexture: {
        type: "t",
        value: oceanTexture
    },
    sandyTexture: {
        type: "t",
        value: sandyTexture
    },
    grassTexture: {
        type: "t",
        value: grassTexture
    },
    rockyTexture: {
        type: "t",
        value: rockyTexture
    },
    snowyTexture: {
        type: "t",
        value: snowyTexture
    },
};

// create custom material from the shader code above
//   that is within specially labelled script tags
var customMaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: heightmapVShader,
    fragmentShader: heightmapFShader
        // side: THREE.DoubleSide
});

var planeGeo = new THREE.PlaneGeometry(32, 32, 400, 400);
var plane = new THREE.Mesh(planeGeo, customMaterial);
plane.rotateZ(-Math.PI / 2);
scene.add(plane);

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
