var fs = require('fs');
var path = require('path');
var THREE = require('three');
var OrbitControls = require('./OrbitControls');
var heightmapVShader = fs.readFileSync(path.join(__dirname, 'heightmap.vshader'), 'utf-8');
var heightmapFShader = fs.readFileSync(path.join(__dirname, 'heightmap.fshader'), 'utf-8');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 100, 400);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('load', function() {
    document.body.appendChild(renderer.domElement);
});

controls = new OrbitControls( camera, renderer.domElement );

// texture used to generate "bumpiness"
var bumpTexture = new THREE.ImageUtils.loadTexture('resources/heightmap.png');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
// magnitude of normal displacement
var bumpScale = 200.0;

var oceanTexture = new THREE.ImageUtils.loadTexture('resources/dirt-512.jpg');
oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

var sandyTexture = new THREE.ImageUtils.loadTexture('resources/sand-512.jpg');
sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

var grassTexture = new THREE.ImageUtils.loadTexture('resources/grass-512.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

var rockyTexture = new THREE.ImageUtils.loadTexture('resources/rock-512.jpg');
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

var planeGeo = new THREE.PlaneGeometry(1000, 1000, 400, 400);
var plane = new THREE.Mesh(planeGeo, customMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -100;
scene.add(plane);

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
};

render();
