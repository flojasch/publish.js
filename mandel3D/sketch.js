let canvas;
let g;
let terrain = [];
let ypos = 0;
let xpos = 0;
let angle = -1.6;
let xAngle = 1.43;
let zpos = 0;
let size = 3;
let ym = 0;
let xm = 0;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    img = loadImage('Newtonf.png');
    texture(img);
    g = new p5.Geometry(200, 200, oberflaeche);
    ambientLight(100);
    directionalLight(255, 255, 255, 0, 0.5, 0.25);
    calcMandel();
}

function oberflaeche() {
    for (var y = 0; y <= this.detailY; y++) {
        var w = y / this.detailY;
        for (var x = 0; x <= this.detailX; x++) {
            var u = x / this.detailX;
            var p = new p5.Vector(u - 0.5, w - 0.5, 0);
            this.vertices.push(p);
            this.uvs.push(u, w);
        }
    }
}

function draw() {
    background(0);

    if (keyIsPressed) {
        if (keyCode == 101) {
            size *= 0.9;
            calcMandel();
        }
        if (keyCode == 100) {
            size *= 1.1;
            calcMandel();
        }
        if (keyCode == 39) {
            angle += 0.05;
        }
        if (keyCode == 37) {
            angle -= 0.05;
        }
        if (keyCode == 40) {
            ym -= -0.01 * size * cos(angle);
            xm -= 0.01 * size * sin(angle);
            calcMandel();
        }
        if (keyCode == 38) {
            ym += -0.01 * size * cos(angle);
            xm += 0.01 * size * sin(angle);
            calcMandel();
        }

    }

    rotateX(xAngle);
    translate(xpos, 400 + ypos, 0);
    rotateZ(-angle);
    translate(-xpos, -400 - ypos, 0);
    // rotateZ(angle);
    // translate(-xpos, -ypos, 0);
    // rotateZ(-angle);

    g.computeFaces().computeNormals();
    canvas.createBuffers("!", g);
    canvas.drawBuffersScaled("!", 4000, 4000, 400);

}

function calcMandel() {
    let nmax = 50;
    let tnmax = Math.log(Math.log(nmax + 1));
    let RADIUS = 1000;
    let R;
    let a = 1 / Math.log(RADIUS);
    let b = 1 / Math.log(2);
    let xmin = xm - size / 2;
    let xmax = xm + size / 2;
    let ymin = ym - size / 2;
    let ymax = ym + size / 2;
    for (let j = 0; j <= g.detailY; j++) {
        terrain[j] = [];
        for (let i = 0; i <= g.detailX; i++) {
            cx = map(i, 0, g.detailX, xmin, xmax);
            cy = map(j, 0, g.detailY, ymin, ymax);
            let xsq = 0;
            let ysq = 0;
            let x = 0;
            let y = 0;
            for (n = 0; n < nmax; ++n) {
                y = 2 * y * x + cy;
                x = xsq - ysq + cx;
                xsq = x * x;
                ysq = y * y;
                R = xsq + ysq;
                if (R > RADIUS)
                    break;
            }
            if (n == nmax) {
                terrain[j][i] = 0;
            } else {
                let nu = n + 1 - b * Math.log(a * Math.log(R));
                terrain[j][i] = 2 * (tnmax - log(log(nu)));
            }
        }
    }
    for (let y = 0; y <= g.detailY; y++) {
        for (let x = 0; x <= g.detailX; x++) {
            g.vertices[y * (g.detailX + 1) + x].z = terrain[y][x];

        }
    }

}