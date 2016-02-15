var THREE = require('three');

var railroadPathA = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.00, 0.00, 0.00),
    new THREE.Vector3(1.87, 0.60, 0.00),
    new THREE.Vector3(3.80, 1.38, 0.00),
    new THREE.Vector3(5.23, 2.00, 0.00),
    new THREE.Vector3(7.09, 2.95, 0.00),
    new THREE.Vector3(8.38, 3.63, 0.00),
    new THREE.Vector3(9.90, 4.54, 0.00),
    new THREE.Vector3(12.11, 5.98, 0.00),
    new THREE.Vector3(14.73, 7.92, 0.00),
    new THREE.Vector3(16.90, 9.68, 0.00),
    new THREE.Vector3(20.82, 13.36, 0.00)
]);

var railroadPathB = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.00, 0.00),
    new THREE.Vector3(5.13, 1.36),
    new THREE.Vector3(11.00, 2.94),
    new THREE.Vector3(13.36, 3.54),
    new THREE.Vector3(17.61, 4.49),
    new THREE.Vector3(23.00, 5.97)
]);

var railShape = new THREE.Shape([
    new THREE.Vector2(0, 0.1),
    new THREE.Vector2(-0.1, 0.1),
    new THREE.Vector2(-0.1, -0.1),
    new THREE.Vector2(0, -0.1)
]);

var railMaterial = new THREE.MeshLambertMaterial({
    color: 0xff8000,
    wireframe: false
});

module.exports = function() {
    return new Promise(function(resolve) {
        var railroad = new THREE.Object3D();

        var railroadA = new THREE.Mesh(new THREE.ExtrudeGeometry(railShape, {
            steps: 200,
            bevelEnabled: false,
            extrudePath: railroadPathA
        }), railMaterial);
        railroadA.position.set(-7.3, -13.7, 0);
        railroad.add(railroadA);

        var railroadB = new THREE.Mesh(new THREE.ExtrudeGeometry(railShape, {
            steps: 200,
            bevelEnabled: false,
            extrudePath: railroadPathB
        }), railMaterial);
        railroadB.position.set(-7.32, -14.19, 0);
        railroad.add(railroadB);

        resolve(railroad);
    });
}
