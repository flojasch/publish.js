let canvas;
let g;
let terrain = [];
let speed = 10;
let ypos = 0;
let xpos = 0;
let zpos = -1200;
let t = -5;
let omega;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    g = new p5.Geometry(100, 100, oberflaeche);
    img1 = loadImage('mercury.jpg');
    img2 = loadImage('Newtonf.png');
    
    // orbitControl();
}

function orbital(obj) {
    
}

function oberflaeche() {
    // for (var y = 0; y <= this.detailY; y++) {
    //     var w = y / this.detailY;
    //     for (var x = 0; x <= this.detailX; x++) {
    //         var u = x / this.detailX;
    //         var p = new p5.Vector(u - 0.5, w - 0.5, 0);
    //         this.vertices.push(p);
    //         this.uvs.push(u, w);
    //     }
    // }
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
            let psi1 = 2 * Math.cos(2*phi);
            let psi2 = 1.4;
            let s = 1 / (1 + exp(-t));
            let r = pow(psi1 * (1 - s), 2) + pow(psi2 * s, 2) + 2 * psi1 * psi2 * s * (1 - s) * Math.cos(omega*t);
            // var r = 1+0.5*noise(5 * phi, 5 * cosPhi * abs(PI - theta));
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
    // orbitControl();

    if (keyIsPressed) {

        if (keyCode == 39) {
            ypos += 10;
        }
        if (keyCode == 37) {
            ypos -= 10;
        }
        if (keyCode == 40) {
            zpos += 10;
        }
        if (keyCode == 38) {
            zpos -= 10;
        }

    }

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
            let r = pow(psi1 * (1 - s), 2) + pow(psi2 * s, 2) + 2 * psi1 * psi2 * s * (1 - s) * cos(t);
            // var r = 1+0.5*noise(5 * phi, 5 * cosPhi * abs(PI - theta));
            let v=createVector(r * cosPhi * sinTheta, r * sinPhi, r * cosPhi * cosTheta);
            g.vertices[i * (g.detailX + 1) + j] = v;
        }
    }
    // let yoff = 0;
    // for (let y = 0; y <= geometry.detailY; y++) {
    //     let xoff = 0;
    //     terrain[y] = [];
    //     for (let x = 0; x <= geometry.detailX; x++) {
    //         terrain[y][x] = 0.5 * noise(xoff, yoff);
    //         xoff += 0.03;
    //     }
    //     yoff += 0.03;
    // }

    // for (let y = 0; y <= geometry.detailY; y++) {
    //     for (let x = 0; x <= geometry.detailX; x++) {
    //         geometry.vertices[y * (geometry.detailX + 1) + x].z = terrain[y][x];

    //     }
    // }

    ambientLight(150,50,50);
    directionalLight(255, 255,255, 0, 0.5, 0.25);
    // rotateX(PI / 3);

    push();
    translate(xpos, ypos, zpos);
    noStroke();
    rotateX(-0.5);
    // texture(img2);
    // sphere(200);
    // rotateY(millis()/2000);
    // rotateZ(millis() / 2000);
    // texture(img1);
    g.computeFaces(); //.computeNormals();
    canvas.createBuffers("!", g);
    canvas.drawBuffersScaled("!", 300, 300, 300);
    pop();
}