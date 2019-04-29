let canvas;
let g;
let terrain = [];
let speed = 10;
let ypos = 0;
let xpos = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    g = new p5.Geometry(100, 100, oberflaeche);
    img = loadImage('Newtonf.png');    
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

        if (keyCode == UP_ARROW) {
            ypos += 0.1;
        }
        if (keyCode == DOWN_ARROW) {
            ypos -= 0.1;
        }
        if (keyCode == RIGHT_ARROW) {
            xpos += 0.1;
        }
        if (keyCode == LEFT_ARROW) {
            xpos -= 0.1;
        }

    }

    let yoff = ypos;
    for (let y = 0; y <= g.detailY; y++) {
        let xoff = xpos;
        terrain[y] = [];
        for (let x = 0; x <= g.detailX; x++) {
            terrain[y][x] = 10*noise(xoff, yoff);
            xoff += 0.03;
        }
        yoff += 0.03;
    }

    for (let y = 0; y <= g.detailY; y++) {
        for (let x = 0; x <= g.detailX; x++) {
            g.vertices[y * (g.detailX + 1) + x].z = terrain[y][x];

        }
    }
    rotateX(-PI / 2);
    ambientLight(100,100,100);
    directionalLight(255, 255,255, -1,-1,-1);

    translate(0, 1000, 0);
    noStroke();
    texture(img);
    g.computeFaces().computeNormals();
    canvas.createBuffers("!", g);
    canvas.drawBuffersScaled("!", 6000, 3000, 100);
}