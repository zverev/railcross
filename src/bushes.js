var THREE = require('three');
var config = require('./config.js');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        var map = new THREE.TextureLoader().load(config.bushTexture);
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xffffff,
            fog: true
        });
        var sprite = new THREE.Sprite(material);
        sprite.position.set(-5.5, -13.7, 2);
        sprite.scale.set(0.5, 0.5, 0.5);
        resolve(sprite);
    });
}
