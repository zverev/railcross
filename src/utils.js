var THREE = require('three');
var ColladaLoader = require('./ColladaLoader');
var config = require('./config.js');

function loadScene(url) {
    return new Promise(function(resolve, reject) {
        // instantiate a loader
        var loader = new ColladaLoader();

        loader.load(
            // resource URL
            url,
            // Function when resource is loaded
            function(collada) {
                resolve(collada.scene);
            },
            // Function called when download progresses
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }
        );
    });
}

function loadImage(url) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            var img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function() {
                reject();
            }
            img.src = url;
        }, 0);
    })
}

function getCoordinatesFromMap(imgPath) {
    return new Promise(function(resolve, reject) {
        loadImage(config.forestMap).then(function(image) {
            var canvas = document.createElement('canvas');
            window.canvas = canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var pixels = getMapPixels(canvas, ctx);

            var coords = [];
            for (var i = 0; i < pixels.length; i++) {
                var p = pixels[i];
                var l = config.landscapePlaneSize;
                coords.push(new THREE.Vector3(-p.y / canvas.width * l + l / 2, -p.x / canvas.height * l + l / 2, 0));
            }

            resolve(coords);
        });
    });
}

function getMapPixels(canvas, ctx) {
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

function ajax(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject();
            }

        }
        xhr.onerror = function () {
            reject();
        }
        xhr.send(); // (1)
    })
}

module.exports = {
    loadScene: loadScene,
    loadImage: loadImage,
    getCoordinatesFromMap: getCoordinatesFromMap,
    ajax: ajax
}
