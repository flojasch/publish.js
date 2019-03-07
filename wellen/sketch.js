var renderer;
var geometry;
let traeger;
let t = 0;
let z = 0;
let z0;
let xPicked;
let picked = false;
let fSlider;
let freq;
let freqalt;
let xh=0;

function setup() {
    // we need to remember the renderer that is created so
    // we can call some of its internal methods later
    renderer = createCanvas(windowWidth, windowHeight, WEBGL);
    fSlider = createSlider(0.02, 0.25, 0.02, 0.005);
    fSlider.position(20, 20);
    cSlider = createSlider(0.1, 0.5, 0.1, 0.05);
    cSlider.position(200, 20);
    sSlider = createSlider(0,1,0.5,0.05);
    sSlider.position(400,20);
    dampButton = createButton('damping');
    dampButton.position(600, 20);
    dampButton.mousePressed(toggleDamping);
    text=createP("soundspeed",textSize=20);
    text.position(200,40);
    fill(0);

    noStroke();
    // set up the camera. the geometry is in the x,y plane
    // so the camera is below the z axis lookup up at (0,0,0)
    camera(0, -600, 300, 0, 0, 0, 0, -1, 0);
    // there's 10,000 points on the surface.
    geometry = new p5.Geometry(100, 100, function () {
        for (var y = 0; y <= this.detailY; y++) {
            var w = y / this.detailY;
            for (var x = 0; x <= this.detailX; x++) {
                var u = x / this.detailX;
                var p = new p5.Vector(u - 0.5, w - 0.5, 0);
                this.vertices.push(p);
                this.uvs.push(u, w);
            }
        }
    });
    traeger = new Traeger(geometry.detailX, geometry.detailY);
    c = traeger.c;
    freqalt = freq = 0;
}

function toggleDamping() {
    if (traeger.damping == 0) {
        traeger.damping = -2;
    } else {
        traeger.damping = 0;
    }
    traeger.reset();
}

function mousePressed() {
    xPicked = floor(geometry.detailX / width * (100 + width - mouseX));
    picked = true;
    z0 = mouseY;
    z = 0;

}

function mouseDragged() {
    z = (z0 - mouseY) / height;
    // console.log(xPicked,z);
}

function mouseReleased() {
    picked = false;
}

function draw() {
    background(100);
    traeger.c = cSlider.value();
    freq = fSlider.value();
    speed =sSlider.value();
    if (freq != freqalt || traeger.c != c) {
        t = 0;
        freqalt = freq;
        c = traeger.c;
        traeger.reset();
        // while (t < 500) {
        //     traeger.update();
        //     traeger.pull(geometry.detailX / 2, geometry.detailY / 2, 0.01 * Math.sin(t * freq));
        //     t++;
        // }
    }
    traeger.update();
    // traeger.pull(geometry.detailX / 2, geometry.detailY / 2, 0.01 * Math.sin(t * freq));
    t++;
    if (picked) {
        // traeger.set(xPicked, geometry.detailY / 2, z);
    }
    xh += speed;
    if(xh>geometry.detailX){
        xh=0;
    }
    traeger.pull(floor(xh), geometry.detailY / 2, 0.02 * Math.sin(t * freq));

    for (let y = 0; y <= geometry.detailY; y++) {
        for (let x = 0; x <= geometry.detailX; x++) {
            geometry.vertices[y * (geometry.detailX + 1) + x].z = traeger.z[x][y];

        }
    }
    fill(255);
    noStroke();
    directionalLight(66, 140, 244, 0, 0.5, 0.25);
    // re-compute the faces & normals
    geometry.computeFaces().computeNormals();
    // update the webgl buffers
    renderer.createBuffers("!", geometry);
    // render the geometry
    renderer.drawBuffersScaled("!", 1000, 1000, 500);

}