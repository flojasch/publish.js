let traeger;
let gen;
let picked = false;
let osziNum = 200;
let y0;
let y = 0;
let t = 0;

function setup() {
    canvas = createCanvas(windowWidth, 500);
    cSlider = new Slider(220, height + 20, 0.1, 0.5, 0.2, 0.05);
    dampButton = createButton('Reset');
    dampButton.position(20, height + 20);
    dampButton.mousePressed(toggleDamping);
    traeger = new Traeger(osziNum);
    gen = new Generator(0, 0.2, 0.01);

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
    constructor(x, freq, amp) {
        this.x = x;
        this.freq = freq;
        this.amp = amp;
        this.fSlider = new Slider(420, height + 20, 0.01, 0.1, 0.02, 0.001);
        this.aSlider = new Slider(620, height + 20, 0, 1, 0.5, 0.05);
    }

    update() {
        if (this.freq != this.fSlider.slider.value()) {
            this.freq = this.fSlider.slider.value();
            traeger.reset();
            t = 0;
            while (t < 2000) {
                traeger.update();
                traeger.pull(floor(this.x), this.amp * Math.sin(t * this.freq));
                t++;
            }
        }

        this.amp = this.aSlider.slider.value();

        traeger.pull(floor(this.x), this.amp * Math.sin(t * this.freq));
        this.aSlider.text.html("Amplitude: " + this.amp);
        this.fSlider.text.html("Frequency: " + this.freq);
    }
}

function toggleDamping() {
    traeger.reset();
}

function mousePressed() {
    if (mouseY < 500) {
        picked = true;
    }
}

function mouseReleased() {
    picked = false;
}

function draw() {
    background(200);
    traeger.c = cSlider.slider.value();
    cSlider.text.html("Soundspeed: " + traeger.c);
    gen.update();
    traeger.update();
    traeger.show();
    t++;
    if (picked) {
        traeger.set(mouseX, mouseY-height/2);
    }

}