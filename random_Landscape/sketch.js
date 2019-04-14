let canvas;
let geometry;
let terrain = [];
let yspeed = 0;
let ypos = 0;
let xpos = 0;
let angle = 0;
let xAngle = 0;
let hoehe = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    geometry = new p5.Geometry(100, 100, oberflaeche);
    img1 = loadImage('mercury.jpg');
    img2 = loadImage('Newtonf.png');
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

    // for (let j = 0; j <= this.detailY; j++) {
    //     let phi = j * TWO_PI / this.detailY;
    //     for (let i = 0; i <= this.detailX; i++) {
    //         let theta = i * PI / this.detailX;
    //         let r = 1+noise(4*theta, 2*sin(theta)*abs(PI-phi));
    //         let x = r * sin(theta) * cos(phi);
    //         let y = r * sin(theta) * sin(phi);
    //         let z = r * cos(theta);
    //         let p = new p5.Vector(x, y, z);
    //         this.vertices.push(p);
    //         this.uvs.push(x, y);

    //     }
    // }

}

function draw() {
    background(0);
    // ypos += yspeed;
    if (keyIsPressed) {
        if (keyCode == 40) {
            // yspeed += 0.1;
            ypos -= 10*cos(angle);
            xpos -= 10*sin(angle);
        }
        if (keyCode == 38) {
            // yspeed -= 0.1;
            ypos += 10*cos(angle);
            xpos += 10*sin(angle);
        }
        if (keyCode == 39) {
            angle -= 0.05;
        }
        if (keyCode == 37) {
            angle += 0.05;
        }
        if (keyCode == 101) {
            xAngle += 0.05;
        }
        if (keyCode == 100) {
            xAngle -= 0.03;
        }
        if (keyCode == 119) {
            hoehe += 5;
        }
        if (keyCode == 115) {
            hoehe -= 5;
        }
    }

    let yoff = 0;
    for (let y = 0; y <= geometry.detailY; y++) {
        let xoff = 0;
        terrain[y] = [];
        for (let x = 0; x <= geometry.detailX; x++) {
            terrain[y][x] = 0.5 * noise(xoff, yoff);
            xoff += 0.03;
        }
        yoff += 0.03;
    }

    for (let y = 0; y <= geometry.detailY; y++) {
        for (let x = 0; x <= geometry.detailX; x++) {
            geometry.vertices[y * (geometry.detailX + 1) + x].z = terrain[y][x];

        }
    }
    ambientLight(150);
    directionalLight(255, 255, 255, 0, 0.5, 0.25);

    
    rotateX(PI/3);
    translate(-xpos, 400-ypos, -hoehe);
    rotateZ(angle);
    rotateX(xAngle);
    translate(xpos, -400+ypos, hoehe);
    translate(0,0,hoehe);
    let tx = cos(angle) * xpos + sin(angle) * ypos;
    let ty = -sin(angle) * xpos + cos(angle) * ypos;
    translate(tx, ty, 0);
    // translate(0,-2*ypos,0);

    push();
    translate(0, -2000, 0);
    noStroke();
    texture(img1);
    sphere(200);
    pop();

    texture(img2);
    geometry.computeFaces().computeNormals();
    canvas.createBuffers("!", geometry);
    canvas.drawBuffersScaled("!", 2000, 2000, 1000);

}