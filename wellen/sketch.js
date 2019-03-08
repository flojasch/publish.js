var renderer;
var geometry;
let traeger;
let picked = false;
let sliderPos = 20;

function setup() {
    // we need to remember the renderer that is created so
    // we can call some of its internal methods later
    renderer = createCanvas(windowWidth, windowHeight, WEBGL);

    cSlider = new Slider(20, 20, 0.1, 0.5, 0.2, 0.05);

    dampButton = createButton('Turn damping off');
    dampButton.position(800, 20);
    dampButton.mousePressed(toggleDamping);

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
    t = 0;
    z = 0;
    gen = new Generator(geometry.detailX / 2, geometry.detailY / 2, 0, 0.02, 0.01);

}

class Slider {
    constructor(x, y, first, last, beginn, step) {
        this.slider = createSlider(first, last, beginn, step);
        this.slider.position(x, y);
        this.text = createP();
        this.text.position(x, y + 20);
        this.text.style('font-size', '160%');
    }
}
class Generator {
    constructor(x, y, v, freq, amp) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.freq = freq;
        this.amp = amp;
        this.fSlider = new Slider(220, sliderPos, 0.02, 0.25, 0.02, 0.005);
        this.vSlider = new Slider(420, sliderPos, 0, 1, 0, 0.05);
        this.aSlider = new Slider(620, sliderPos, 0, 0.1, 0.03, 0.005);
        sliderPos += 40;
    }

    update() {
        if (this.freq != this.fSlider.slider.value()) {
            this.freq = this.fSlider.slider.value();
            traeger.reset();
            t = 0;
            while (t < 2000) {
                traeger.update();
                traeger.pull(floor(this.x), this.y, this.amp * Math.sin(t * this.freq));
                t++;
            }
        }

        this.v = this.vSlider.slider.value();
        this.amp = this.aSlider.slider.value();
        this.x += this.v;
        if (this.x > geometry.detailX) {
            this.x = 0;
        }
        traeger.pull(floor(this.x), this.y, this.amp * Math.sin(t * this.freq));
        this.vSlider.text.html("Speed of </br> generator: " + this.v);
        this.aSlider.text.html("Amplitude: " + this.amp);
        this.fSlider.text.html("Frequency: " + this.freq);
    }
}

function toggleDamping() {
    if (traeger.damping == 0) {
        traeger.damping = -2;
        dampButton.html('Turn damping off');
    } else {
        traeger.damping = 0;
        dampButton.html('Turn damping on');
    }
    traeger.reset();
}

function mousePressed() {
    if (mouseY > 200) {
        xPicked = floor(geometry.detailX / width * (100 + width - mouseX));
        picked = true;
        z0 = mouseY;
        z = 0;
    }
}

function mouseDragged() {
    z = (z0 - mouseY) / height;
}

function mouseReleased() {
    picked = false;
}

function draw() {
    background(100);
    traeger.c = cSlider.slider.value();
    cSlider.text.html("Soundspeed: " + traeger.c);
    gen.update();
    traeger.update();
    t++;
    if (picked) {
        traeger.set(xPicked, geometry.detailY / 2, z);
    }

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