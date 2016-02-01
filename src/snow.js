var THREE = require('three');

var numParticles = 100;
var width = 32;
var height = 32;
var depth = 16;

var systemGeometry = new THREE.Geometry();
var systemMaterial = new THREE.ParticleBasicMaterial({
    color: 0xFFFFFF
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
