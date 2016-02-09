var fs = require('fs');
var path = require('path');
var THREE = require('three');
var landscapeVShader = fs.readFileSync(path.join(__dirname, 'landscapeVert.glsl'), 'utf-8');
var landscapeFShader = fs.readFileSync(path.join(__dirname, 'landscapeFrag.glsl'), 'utf-8');

var _ = require('lodash');

// texture used to generate "bumpiness"
var bumpTexture = new THREE.ImageUtils.loadTexture('resources/heightmap.png');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
// magnitude of normal displacement
var bumpScale = 1.8;

var snowyTexture = new THREE.ImageUtils.loadTexture('resources/snow-512.jpg');
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

// create custom material from the shader code above
//   that is within specially labelled script tags
var customMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({}, THREE.ShaderLib.phong.uniforms, {
        bumpTexture: {
            type: "t",
            value: bumpTexture
        },
        bumpScale: {
            type: "f",
            value: bumpScale
        },
        map: {
            type: 't',
            value: snowyTexture
        },
        textureResolution: {
            type: 'f',
            value: 20.0
        }
    }),
    vertexShader: landscapeVShader,
    // vertexShader: THREE.ShaderLib.phong.vertexShader,
    fragmentShader: landscapeFShader,
    //fragmentShader: THREE.ShaderLib.phong.fragmentShader,
    fog: true,
    lights: true,
    defines: {
        USE_MAP: true
    }
});

var planeSize = 32;
var planeDetails = 64;
var maxHeight = 2;

var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeDetails, planeDetails);

module.exports = new THREE.Mesh(planeGeo, customMaterial);
