var THREE = require('three');

module.exports = function(x, y, z, h) {
    h = h || 2;
    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(h/ 100, h / 20, h, 4, 1),
        new THREE.MeshBasicMaterial({
            color: 0x412A25
        })
    );
    trunk.rotateX(Math.PI / 2)
    var fir = new THREE.Object3D();
    fir.add(trunk);
    fir.position.setZ(fir.position.z + h / 2);
    return fir;
}
