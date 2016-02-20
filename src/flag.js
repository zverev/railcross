/* testing cloth simulation */

var THREE = require('three');
var fs = require('fs');
var path = require('path');
var clothVert = fs.readFileSync(path.join(__dirname, 'clothVert.glsl'), 'utf-8');
var clothFrag = fs.readFileSync(path.join(__dirname, 'clothFrag.glsl'), 'utf-8');

var utils = require('./utils.js');
var config = require('./config.js');
var toRoman = require('roman-numerals').toRoman;

/*
 * Cloth Simulation using a relaxed constrains solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = .1;
var restDistance = 25;


var xSegs = 10; //
var ySegs = 10; //

var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

var cloth = new Cloth(xSegs, ySegs);

var GRAVITY = 981 * 1.4; //
var gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];


var wind = true;
var windStrength = 2;
var windForce = new THREE.Vector3(0, 0, 0);

var ballPosition = new THREE.Vector3(0, -45, 0);
var ballSize = 60; //40

var tmpForce = new THREE.Vector3();

var lastTime;


function plane(width, height) {

    return function(u, v) {

        var x = (u - 0.5) * width;
        var y = (v + 0.5) * height;
        var z = 0;

        return new THREE.Vector3(x, y, z);

    };

}

function Particle(x, y, z, mass) {

    this.position = clothFunction(x, y); // position
    this.previous = clothFunction(x, y); // previous
    this.original = clothFunction(x, y);
    this.a = new THREE.Vector3(0, 0, 0); // acceleration
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();

}

// Force -> Acceleration
Particle.prototype.addForce = function(force) {

    this.a.add(
        this.tmp2.copy(force).multiplyScalar(this.invMass)
    );

};


// Performs verlet integration
Particle.prototype.integrate = function(timesq) {

    var newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(DRAG).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;

    this.a.set(0, 0, 0);

};


var diff = new THREE.Vector3();

function satisifyConstrains(p1, p2, distance) {

    diff.subVectors(p2.position, p1.position);
    var currentDist = diff.length();
    if (currentDist == 0) return; // prevents division by 0
    var correction = diff.multiplyScalar(1 - distance / currentDist);
    var correctionHalf = correction.multiplyScalar(0.5);
    p1.position.add(correctionHalf);
    p2.position.sub(correctionHalf);

}


function Cloth(w, h) {

    w = w || 10;
    h = h || 10;
    this.w = w;
    this.h = h;

    var particles = [];
    var constrains = [];

    var u, v;

    // Create particles
    for (v = 0; v <= h; v++) {

        for (u = 0; u <= w; u++) {

            particles.push(
                new Particle(u / w, v / h, 0, MASS)
            );

        }

    }

    // Structural

    for (v = 0; v < h; v++) {

        for (u = 0; u < w; u++) {

            constrains.push([
                particles[index(u, v)],
                particles[index(u, v + 1)],
                restDistance
            ]);

            constrains.push([
                particles[index(u, v)],
                particles[index(u + 1, v)],
                restDistance
            ]);

        }

    }

    for (u = w, v = 0; v < h; v++) {

        constrains.push([
            particles[index(u, v)],
            particles[index(u, v + 1)],
            restDistance

        ]);

    }

    for (v = h, u = 0; u < w; u++) {

        constrains.push([
            particles[index(u, v)],
            particles[index(u + 1, v)],
            restDistance
        ]);

    }


    // While many system uses shear and bend springs,
    // the relax constrains model seem to be just fine
    // using structural springs.
    // Shear
    // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


    // for (v=0;v<h;v++) {
    // 	for (u=0;u<w;u++) {

    // 		constrains.push([
    // 			particles[index(u, v)],
    // 			particles[index(u+1, v+1)],
    // 			diagonalDist
    // 		]);

    // 		constrains.push([
    // 			particles[index(u+1, v)],
    // 			particles[index(u, v+1)],
    // 			diagonalDist
    // 		]);

    // 	}
    // }


    this.particles = particles;
    this.constrains = constrains;

    function index(u, v) {

        return u + v * (w + 1);

    }

    this.index = index;

}

function simulate(time) {

    if (!lastTime) {

        lastTime = time;
        return;

    }

    var i, il, particles, particle, pt, constrains, constrain;

    // Aerodynamics forces
    if (wind) {

        var face, faces = clothGeometry.faces,
            normal;

        particles = cloth.particles;

        for (i = 0, il = faces.length; i < il; i++) {

            face = faces[i];
            normal = face.normal;

            tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
            particles[face.a].addForce(tmpForce);
            particles[face.b].addForce(tmpForce);
            particles[face.c].addForce(tmpForce);

        }

    }

    for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {

        particle = particles[i];
        particle.addForce(gravity);

        particle.integrate(TIMESTEP_SQ);

    }

    // Start Constrains

    constrains = cloth.constrains,
        il = constrains.length;
    for (i = 0; i < il; i++) {

        constrain = constrains[i];
        satisifyConstrains(constrain[0], constrain[1], constrain[2]);

    }

    // Ball Constrains


    ballPosition.z = -Math.sin(Date.now() / 600) * 90; //+ 40;
    ballPosition.x = Math.cos(Date.now() / 400) * 70;

    // Floor Constains
    for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {

        particle = particles[i];
        pos = particle.position;
        if (pos.y < -250) {

            pos.y = -250;

        }

    }

    // Pin Constrains
    for (i = 0, il = pins.length; i < il; i++) {

        var xy = pins[i];
        var p = particles[xy];
        p.position.copy(p.original);
        p.previous.copy(p.original);

    }


}

module.exports = {
    clothFunction: clothFunction
}


var pinsFormation = [];
var pins = [6];

pinsFormation.push(pins);

pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
pinsFormation.push(pins);

pins = [0];
pinsFormation.push(pins);

pins = []; // cut the rope ;)
pinsFormation.push(pins);

pins = [0, cloth.w]; // classic 2 pins
pinsFormation.push(pins);

pins = pinsFormation[1];


function togglePins() {

    pins = pinsFormation[~~(Math.random() * pinsFormation.length)];

}


var container, stats;
var camera, scene, renderer;

var clothGeometry;
var sphere;
var object;

var rotate = true;

module.exports = function() {
    return new Promise(function(resolve, reject) {

        // var clothTexture = new THREE.ImageUtils.loadTexture('resources/flag.png');
        // clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;

        var canvas = document.createElement('canvas');
        var clothTexture = new THREE.Texture(canvas);

        // cloth material

        var clothMaterial = new THREE.MeshPhongMaterial({
            specular: 0x030303,
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        utils.loadImage(config.flagBackground).then(function(img) {
            canvas.width = img.width;
            canvas.height = img.height;
            var w = 16;
            setInterval(function () {

            drawFlag(canvas, img, w);
            clothTexture.needsUpdate = true;
            clothMaterial.needsUpdate = true;
            w--;
            if (!w) { w = 16; }
        }, 500);
        });

        function drawFlag(ctx, img, weeks){
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.height/2, canvas.height/2);
            ctx.rotate(-Math.PI / 2);
            var w = 75;
            ctx.font = w + "px monospace";
            ctx.fillStyle = "white";
            var str = toRoman(weeks);
            ctx.fillText(str, -100 + (4 - str.length) * w / 4, 30);
            ctx.restore();
        }

        // cloth geometry
        clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
        clothGeometry.dynamic = true;

        var uniforms = {
            texture: {
                type: "t",
                value: clothTexture
            }
        };
        // cloth mesh

        var flag = new THREE.Object3D();

        var clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
        clothMesh.position.set(0, 0, 0);
        clothMesh.castShadow = true;

        clothMesh.customDepthMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: clothVert,
            fragmentShader: clothFrag,
            side: THREE.DoubleSide
        });

        flag.add(clothMesh);

        var poleMat = new THREE.MeshPhongMaterial({
            color: 0x808080,
            specular: 0x111111,
            shininess: 100
        });

        var mesh = new THREE.Mesh(new THREE.BoxGeometry(700, 10, 10), poleMat);
        mesh.position.y = -250 + 750 / 2;
        mesh.position.x = 235;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        flag.add(mesh);

        flag.animate = animate;

        resolve(flag);
    });
}

function animate() {
    var time = Date.now();

    windStrength = Math.cos(time / 7000) * 20 + 40;
    windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000)).normalize().multiplyScalar(windStrength);

    simulate(time);
    render();
}

function render() {
    var timer = Date.now() * 0.0002;
    var p = cloth.particles;

    for (var i = 0, il = p.length; i < il; i++) {
        clothGeometry.vertices[i].copy(p[i].position);
    }

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;
}
