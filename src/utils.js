var THREE = require('three');
var ColladaLoader = require('./ColladaLoader');

module.exports = {

    loadScene: function(url) {
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
    },

    loadImage: function(url) {
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

};
