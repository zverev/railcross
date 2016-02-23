var THREE = require('three');
var createFir = require('./fir.js');
var config = require('./config.js');
var utils = require('./utils.js');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        utils.getCoordinatesFromMap(config.forestMap).then(function(coords) {
            var forest = new THREE.Object3D();

            for (var i = 0; i < coords.length; i++) {
                var c = coords[i];
                var fir = createFir(config.firHeight);
                fir.position.set(c.x, c.y, c.z);
                forest.add(fir);
            }

            var forestPlaneTexture = new THREE.ImageUtils.loadTexture(config.forestPlaneTexture);
            forestPlaneTexture.wrapS = forestPlaneTexture.wrapT = THREE.RepeatWrapping;
            forestPlaneTexture.repeat.set(12, 1);

            for (var i = 0; i < 4; i++) {
                var plane = createForestPlane(forestPlaneTexture);
                plane.position.setY(-i * 4 + 10);
                plane.position.setX(i % 2 - 0.5 - 10);
                forest.add(plane);
            }

            resolve(forest);
        });
    });
};

function createForestPlane(map) {
    var geometry = new THREE.PlaneGeometry(32, 2);
    var material = new THREE.MeshPhongMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        map: map
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI / 2);
    //mesh.rotateY(Math.PI/3)
    mesh.position.setZ(1.5);
    return mesh;
}
