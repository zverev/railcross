var THREE = require('three');
var utils = require('./utils.js');
var config = require('./config');

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
    color: 0x707070,
    wireframe: false
});

var tieMaterial = new THREE.MeshLambertMaterial({
    color: 0xff8000,
    wireframe: false
});

function createTies(path, tieModel) {
    var tiesCount = 150;
    var delta = 1 / tiesCount;
    var tiesObj = new THREE.Object3D();
    var tieGeo = tieModel.children[0].geometry;

    // no idea, why:
    var up = new THREE.Vector3(1, 0, 0);

    var axis = new THREE.Vector3( );
    for (var t = 0; t < 1; t += delta) {
        var tieMesh = new THREE.Mesh(tieGeo, tieMaterial);
        tieMesh.position.set(
            path.getPointAt(t).x,
            path.getPointAt(t).y,
            path.getPointAt(t).z
        );

        // get the tangent to the curve
        var tangent = path.getTangent( t ).normalize();
        // calculate the axis to rotate around
        axis.crossVectors( up, tangent ).normalize();
        // calcluate the angle between the up vector and the tangent
        var radians = Math.acos( up.dot( tangent ) );
        // set the quaternion
        tieMesh.quaternion.setFromAxisAngle( axis, radians );

        tiesObj.add(tieMesh);
    }

    return tiesObj;
}

module.exports = function() {
    return utils.loadScene(config.railroadTieModel).then(function(railroadTieScene) {
        var tieModel = railroadTieScene.children[0];
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

            var railroadATies = createTies(railroadPathA, tieModel);
            railroadATies.position.set(railroadA.position.x, railroadA.position.y, railroadA.position.z);
            railroad.add(railroadATies);

            var railroadBTies = createTies(railroadPathB, tieModel);
            railroadBTies.position.set(railroadB.position.x, railroadB.position.y, railroadB.position.z);
            railroad.add(railroadBTies);

            resolve(railroad);
        });
    });
}
