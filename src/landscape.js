var fs = require('fs');
var path = require('path');
var THREE = require('three');
var landscapeVShader = fs.readFileSync(path.join(__dirname, 'landscapeVert.glsl'), 'utf-8');
var landscapeFShader = fs.readFileSync(path.join(__dirname, 'landscapeFrag.glsl'), 'utf-8');

var _ = require('lodash');
var config = require('./config.js');

// texture used to generate "bumpiness"
var heightmapTexture = new THREE.ImageUtils.loadTexture(config.landscapeHeightmapTexture);
heightmapTexture.wrapS = heightmapTexture.wrapT = THREE.RepeatWrapping;

var snowyTexture = new THREE.ImageUtils.loadTexture(config.landscapeSnowTexture);
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

var rocksTexture = new THREE.ImageUtils.loadTexture(config.landscapeRocksTexture);
rocksTexture.wrapS = rocksTexture.wrapT = THREE.RepeatWrapping;

// create custom material from the shader code above
//   that is within specially labelled script tags
var customMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({}, THREE.ShaderLib.phong.uniforms, {
        bumpTexture: {
            type: 't',
            value: heightmapTexture
        },
        bumpScale: {
            type: 'f',
            value: config.landscapeMaxHeight
        },
        snowTexture: {
            type: 't',
            value: snowyTexture
        },
        rocksTexture: {
            type: 't',
            value: rocksTexture
        },
        textureResolution: {
            type: 'f',
            value: config.landscapeTextureResolution
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

var planeGeo = new THREE.PlaneGeometry(
    config.landscapePlaneSize,
    config.landscapePlaneSize,
    config.landscapePlaneDetails,
    config.landscapePlaneDetails
);

module.exports = new THREE.Mesh(planeGeo, customMaterial);
