var fs = require('fs');
var path = require('path');
var THREE = require('three');
var landscapeVShader = fs.readFileSync(path.join(__dirname, 'landscapeVert.glsl'), 'utf-8');
var landscapeFShader = fs.readFileSync(path.join(__dirname, 'landscapeFrag.glsl'), 'utf-8');

// texture used to generate "bumpiness"
var bumpTexture = new THREE.ImageUtils.loadTexture('resources/heightmap.png');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
// magnitude of normal displacement
var bumpScale = 1.8;

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
    fogColor: {
        type: "c"
    },
    fogDensity: {
        type: "f"
    },
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
    vertexShader: landscapeVShader,
    fragmentShader: landscapeFShader,
    fog: true
});

var planeSize = 32;
var planeDetails = 64;
var maxHeight = 2;

var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeDetails, planeDetails);

module.exports = new THREE.Mesh(planeGeo, customMaterial);
