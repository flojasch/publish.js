let canvas;
let geometry;
let terrain = [];
let ypos = 0;
let xpos = 50;
let zpos = 300;
let angle =0;
let hoehe =0;

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
}

function draw() {
    background(100);

    if (keyIsPressed) {
        if (keyCode == 40) {
            ypos += 0.1;
        }
        if (keyCode == 38) {
            ypos -= 0.1;
        }
        if (keyCode == 39) {
            angle += 0.1;
        }
        if (keyCode == 37) {
            angle -= 0.1;
        }
        if (keyCode == 119) {
            //zpos += 5;
        }
        if (keyCode == 115) {
            //zpos -= 5;
        }
        if (keyCode == 119) {
            hoehe += 5;
        }
        if (keyCode == 115) {
            hoehe -= 5;
        }
    }
    camera(0, 600, zpos, 0, 0, 0, 0, 1, 0);
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
    push();
    translate(0, -100 * ypos, hoehe);
    rotateZ(angle);
    push();
    translate(-200, - 600, 200);
    noStroke();
    texture(img1);
    sphere(100);
    pop();
    texture(img2);
   
    geometry.computeFaces().computeNormals();
    canvas.createBuffers("!", geometry);
    // render the geometry
    canvas.drawBuffersScaled("!", 2000, 2000, 500);
    pop();
}