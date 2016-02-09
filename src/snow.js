var fs = require('fs');
var path = require('path');
var THREE = require('three');
var snowVShader = fs.readFileSync(path.join(__dirname, 'snowVert.glsl'), 'utf-8');
var snowFShader = fs.readFileSync(path.join(__dirname, 'snowFrag.glsl'), 'utf-8');

var numParticles = 25000;
var width = 32;
var height = 16;
var depth = 16;

var systemGeometry = new THREE.Geometry();

systemMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            type: 'c',
            value: new THREE.Color(0xFFFFFF)
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
            value: 0.1
        },
        radiusY: {
            type: 'f',
            value: 0.1
        },
        size: {
            type: 'f',
            value: 10.0
        },
        scale: {
            type: 'f',
            value: 1.0
        },
        opacity: {
            type: 'f',
            value: 0.5
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

for (var i = 0; i < numParticles; i++) {
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
