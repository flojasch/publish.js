let canvas;
let geometry;
let terrain = [];
let speed = 0;
let ypos = 800;
let xpos = 0;
let angle = 0;
let xAngle = -1.43;
let zpos = 200;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    geometry = new p5.Geometry(100, 100, oberflaeche);
    img1 = loadImage('mercury.jpg');
    img2 = loadImage('Newtonf.png');
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

    for (let j = 0; j <= this.detailY; j++) {
        let phi = j * TWO_PI / this.detailY;
        for (let i = 0; i <= this.detailX; i++) {
            let theta = i * PI / this.detailX;
            let r = 1+noise(4*theta, 4*sin(theta)*abs(PI-phi));
            let x = r * sin(theta) * cos(phi);
            let y = r * sin(theta) * sin(phi);
            let z = r * cos(theta);
            let p = new p5.Vector(x, y, z);
            this.vertices.push(p);
            this.uvs.push(x, y);

        }
    }

}

function draw() {
    background(0);
    ypos += -speed * sin(xAngle) * cos(angle);
    xpos += +speed * sin(xAngle) * sin(angle);
    zpos += speed * cos(xAngle);

    if (keyIsPressed) {
        if (keyCode == 101) {
            speed -= 0.1;
        }
        if (keyCode == 100) {
            speed += 0.1;

        }
        if (keyCode == 39) {
            angle += 0.05;
        }
        if (keyCode == 37) {
            angle -= 0.05;
        }
        if (keyCode == 40) {
            xAngle -= 0.05;
        }
        if (keyCode == 38) {
            xAngle += 0.03;
        }
        if (keyCode == 119) {
            zpos += 5;
        }
        if (keyCode == 115) {
            zpos -= 5;
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
    ambientLight(150);
    directionalLight(255, 255, 255, 0, 0.5, 0.25);

    translate(0, ypos, zpos+400);
    rotateX(-xAngle);
    translate(0, -ypos, -zpos-400);
    rotateX(xAngle);
    translate(0, -ypos, -zpos);
    rotateX(-xAngle);

    translate(xpos, 400 + ypos, 0);
    rotateZ(-angle);
    translate(-xpos, -400 - ypos, 0);
    rotateZ(angle);
    translate(-xpos, -ypos, 0);
    rotateZ(-angle);

    push();
    translate(0, -2000, 0);
    noStroke();
    texture(img1);
    sphere(200);
    pop();

    texture(img2);
    geometry.computeFaces().computeNormals();
    canvas.createBuffers("!", geometry);
    canvas.drawBuffersScaled("!", 200, 200, 200);

}