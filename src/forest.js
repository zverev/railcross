var createFir = require('./fir.js');
var config = require('./config.js');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        loadImage(config.forestMap).then(function(image) {
            var forest = new THREE.Object3D();
            var canvas = document.createElement('canvas');
            window.canvas = canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var treePixels = getTreePixels(canvas, ctx);
            for (var i = 0; i < treePixels.length; i++) {
                var p = treePixels[i];
                var fir = createFir(2);
                var l = config.landscapePlaneSize;
                fir.position.set(-p.y / canvas.width * l + l / 2, -p.x / canvas.height * l + l / 2, 0);
                forest.add(fir);
            }
            console.log(getTreePixels(canvas, ctx));
            resolve(forest);
        });
    });
};

function getRandomPixel(canvas, ctx) {
    do {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var p = ctx.getImageData(x, y, 1, 1);
    } while (p.data[0] < 127)
    return {
        x: x,
        y: y
    }
}

function getTreePixels(canvas, ctx) {
    var pixels = [];
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (var i = 0; i < data.length; i += 4) {
        if (data[i] > 127) {
            pixels.push({
                x: i / 4 % canvas.width,
                y: Math.floor(i / 4 / canvas.height)
            })
        }
    }
    return pixels;
}

function loadImage(src) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() {
            resolve(img);
        };
        img.src = src;
    });
}
