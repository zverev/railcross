var THREE = require('three');
var config = require('./config');

var firBranchTexture = new THREE.ImageUtils.loadTexture(config.firBranchTexture);
firBranchTexture.wrapS = firBranchTexture.wrapT = THREE.RepeatWrapping;

module.exports = function(x, y, z, h) {
    h = h || 2;
    var fir = new THREE.Object3D();

    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(h / 100, h / 30, h, 4, 1),
        new THREE.MeshBasicMaterial({
            color: 0x3D312E
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
                map: firBranchTexture,
                transparent: true
            }));
        branchPlane.rotateZ(Math.random() * Math.PI / 2);
        branchPlane.position.setZ(z + h - i * h / branchesNum);
        fir.add(branchPlane);
    }

    return fir;

    function createBranchPlaneGeo(i) {
        var pMult = h * 0.75;
        var branchSlope = 0.5;
        var radius = pMult * Math.log(i / branchesNum + 1.1);
        console.log(radius);
        var geo = new THREE.PlaneGeometry(radius, radius, 2, 2);
        geo.faces[0].c = 4;
        geo.faces[1].a = 0;
        geo.faces[6].b = 8;
        geo.faces[7].c = 4;
        geo.vertices[4].z += branchSlope;
        return geo;
    }
}
