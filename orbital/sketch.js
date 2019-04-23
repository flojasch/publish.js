let canvas;
let g;
let terrain = [];
let speed = 10;
let ypos = 0;
let xpos = 0;
let zpos = -3000;
let t = -5;
let omega;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    g = new p5.Geometry(100, 100, oberflaeche);
    omega = TWO_PI;
    // img = loadImage('Newtonf.png');
    cam = createCapture(VIDEO);
    cam.hide();
}

function oberflaeche() {
    for (var i = 0; i <= this.detailY; i++) {
        var v = i / this.detailY;
        var phi = Math.PI * v - Math.PI / 2;
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);

        for (var j = 0; j <= this.detailX; j++) {
            var u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            let psi1 = 2 * Math.cos(2 * phi);
            let psi2 = 1.4;
            let s = 1 / (1 + exp(-t));
            let r = pow(psi1 * (1 - s), 2) + pow(psi2 * s, 2) + 2 * psi1 * psi2 * s * (1 - s) * Math.cos(omega * t);
            var p = new p5.Vector(r * cosPhi * sinTheta, r * sinPhi, r * cosPhi * cosTheta);
            this.vertices.push(p);
            this.vertexNormals.push(p);
            this.uvs.push(u, v);
        }
    }

}

function draw() {
    background(100);
    t += 0.02;
    for (var i = 0; i <= g.detailY; i++) {
        var v = i / g.detailY;
        var phi = Math.PI * v - Math.PI / 2;
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);

        for (var j = 0; j <= g.detailX; j++) {
            var u = j / g.detailX;
            var theta = 2 * Math.PI * u;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            let psi1 = 2 * Math.sin(phi);
            let psi2 = 1.4;
            let s = 1 / (1 + exp(-t));
            let r = pow(psi1 * (1 - s), 2) + pow(psi2 * s, 2) + 2 * psi1 * psi2 * s * (1 - s) * cos(omega * t);
            let v = createVector(r * cosPhi * sinTheta, r * sinPhi, r * cosPhi * cosTheta);
            g.vertices[i * (g.detailX + 1) + j] = v;
        }
    }

    ambientLight(150, 150, 150);
    directionalLight(255, 255, 255, 0, 0.5, 0.25);
    directionalLight(255, 255, 255, 0, 0.5, 0.25);
    texture(cam);
    translate(xpos, ypos, zpos);
    noStroke();
    rotateX(-0.5);
    //rotateY(PI / 2);
    g.computeFaces().computeNormals();
    canvas.createBuffers("!", g);
    canvas.drawBuffersScaled("!", 400, 400, 400);
}