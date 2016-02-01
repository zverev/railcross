var fs = require('fs');
var path = require('path');
var THREE = require('three');
var snowVShader = fs.readFileSync(path.join(__dirname, 'snowVert.glsl'), 'utf-8');
var snowFShader = fs.readFileSync(path.join(__dirname, 'snowFrag.glsl'), 'utf-8');

var numParticles = 100;
var width = 32;
var height = 32;
var depth = 16;

var systemGeometry = new THREE.Geometry();

systemMaterial = new THREE.ShaderMaterial({
        vertexShader: snowVShader,
        fragmentShader: snowFShader
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

module.exports = new THREE.ParticleSystem( systemGeometry, systemMaterial );
