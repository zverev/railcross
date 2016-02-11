var fs = require('fs');
var path = require('path');
var THREE = require('three');
var snowVShader = fs.readFileSync(path.join(__dirname, 'snowVert.glsl'), 'utf-8');
var snowFShader = fs.readFileSync(path.join(__dirname, 'snowFrag.glsl'), 'utf-8');

var config = require('./config.js');

var width = config.landscapePlaneSize;
var height = config.landscapePlaneSize / 2;
var depth = config.landscapePlaneSize / 2;

var systemGeometry = new THREE.Geometry();

systemMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            type: 'c',
            value: new THREE.Color(config.snowColor)
        },
        height: {
            type: 'f',
            value: depth
        },
        elapsedTime: {
            type: 'f',
            value: 0
        },
        radiusX: {
            type: 'f',
            value: config.snowRadiusX
        },
        radiusY: {
            type: 'f',
            value: config.snowRadiusY
        },
        size: {
            type: 'f',
            value: config.snowSize
        },
        scale: {
            type: 'f',
            value: config.snowScale
        },
        opacity: {
            type: 'f',
            value: config.snowOpacity
        },
        fogColor: {
            type: 'c'
        },
        fogDensity: {
            type: 'f'
        }
    },
    vertexShader: snowVShader,
    fragmentShader: snowFShader,
    blending: THREE.AdditiveBlending,
    transparent: true,
    fog: true
});

for (var i = 0; i < config.snowNumParticles; i++) {
    var vertex = new THREE.Vector3(
        rand(width),
        rand(height),
        rand(depth)
    );

    systemGeometry.vertices.push(vertex);
}

function rand(value) {
    return value * (Math.random() - 0.5);
}

module.exports = new THREE.ParticleSystem(systemGeometry, systemMaterial);
