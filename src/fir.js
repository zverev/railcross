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
    var branchesNum = 10;
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
        var radius = pMult * Math.log(i / branchesNum + 1.1);
        console.log(radius);
        var geo = new THREE.CircleGeometry(radius, 4);
        geo.vertices[0].z += branchSlope;
        return geo;
    }
}
