var fs = require('fs');
var path = require('path');
var THREE = require('three');
var heightmapVShader = fs.readFileSync(path.join(__dirname, 'heightmap.vshader'), 'utf-8');
var heightmapFShader = fs.readFileSync(path.join(__dirname, 'heightmap.fshader'), 'utf-8');

// texture used to generate "bumpiness"
var bumpTexture = new THREE.ImageUtils.loadTexture('resources/heightmap.png');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
// magnitude of normal displacement
var bumpScale = 1.5;

var oceanTexture = new THREE.ImageUtils.loadTexture('resources/dirt-512.jpg');
oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

var sandyTexture = new THREE.ImageUtils.loadTexture('resources/sand-512.jpg');
sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

var grassTexture = new THREE.ImageUtils.loadTexture('resources/grass-512.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

var rockyTexture = new THREE.ImageUtils.loadTexture('resources/snow-rocks-512.jpg');
rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;

var snowyTexture = new THREE.ImageUtils.loadTexture('resources/snow-512.jpg');
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

var customUniforms = {
    bumpTexture: {
        type: "t",
        value: bumpTexture
    },
    bumpScale: {
        type: "f",
        value: bumpScale
    },
    oceanTexture: {
        type: "t",
        value: oceanTexture
    },
    sandyTexture: {
        type: "t",
        value: sandyTexture
    },
    grassTexture: {
        type: "t",
        value: grassTexture
    },
    rockyTexture: {
        type: "t",
        value: rockyTexture
    },
    snowyTexture: {
        type: "t",
        value: snowyTexture
    },
};

// create custom material from the shader code above
//   that is within specially labelled script tags
var customMaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: heightmapVShader,
    fragmentShader: heightmapFShader
        // side: THREE.DoubleSide
});

var textureMaterial = new THREE.MeshBasicMaterial( { map: bumpTexture } );

var planeSize = 32;
var planeDetails = 64;
var maxHeight = 2;

var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeDetails, planeDetails);

var img = new Image();
img.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    planeGeo.dynamic = true;

    var s = canvas.width / (planeDetails + 1);

    for (var i = 0; i < planeDetails + 1; i++) {
        for (var j = 0; j < planeDetails + 1; j++) {
            planeGeo.vertices[i * (planeDetails + 1) + j].z = getHeightValue(j, i);
        }
    }

    function getHeightValue(j, i) {
        return (ctx.getImageData(s * j, s * i, 1, 1).data[0] / 255) * maxHeight;
    }

    planeGeo.verticesNeedUpdate = true;
};
img.src = 'resources/heightmap.png';
// module.exports = new THREE.Mesh(planeGeo, customMaterial);
module.exports = new THREE.Mesh(planeGeo, textureMaterial);
// module.exports = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ color: 0xdddddd, wireframe: true }))
