var THREE = require('three');

module.exports = function(x, y, z, h) {
    h = h || 2;
    var fir = new THREE.Object3D();

    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(h / 100, h / 20, h, 4, 1),
        new THREE.MeshBasicMaterial({
            color: 0x412A25
        }));
    trunk.rotateX(Math.PI / 2)
    trunk.position.setZ(fir.position.z + h / 2);
    fir.add(trunk);

    var branchPlaneSize = h;
    var branchesNum = 20;
    for (var i = 0; i < branchesNum; i++) {
        var branchPlane = new THREE.Mesh(
            createBranchPlaneGeo(i),
            new THREE.MeshBasicMaterial({
                color: 0x006600,
                side: THREE.DoubleSide
            }));
        branchPlane.position.setZ(z + h - i * h / branchesNum);
        fir.add(branchPlane);
    }

    return fir;

    function createBranchPlaneGeo(i) {
        var pMult = h * 0.75;
        var branchSlope = 0.5;
        var geo = new THREE.PlaneGeometry(pMult * Math.log(i / branchesNum + 1), pMult * Math.log(i / branchesNum + 1), 2, 2);
        geo.vertices[4].z += branchSlope;
        return geo;
    }
}
