let traeger;
let gen;
let picked = false;
let osziNum = 200;
let y0;
let y = 0;
let t = 0;
let reflektButton;

function setup() {
    canvas = createCanvas(windowWidth, 500);
    cSlider = new Slider(220, height + 20, 0.1, 0.5, 0.2, 0.05);
    resetButton = createButton('on/off');
    resetButton.position(20, height + 20);
    resetButton.mousePressed(toggleGenerator);
    reflektButton = createButton('fest/lose');
    reflektButton.position(width - 70, height + 20);
    reflektButton.mousePressed(toggleEnde);
    traeger = new Traeger(osziNum);
    gen = new Generator(0, 0.2, 0.01);

}
function toggleGenerator() {
    t=0;
    gen.on = !gen.on;
}

function toggleEnde() {
    traeger.reset();
    traeger.fest = !traeger.fest;
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
        this.aSlider = new Slider(620, height + 20, 0, 3, 0.5, 0.05);
        this.on = false;
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
        if (this.on && t < 2*Math.PI/this.freq) {
            traeger.pull(floor(this.x), this.amp * Math.sin(t * this.freq));
        }
        this.aSlider.text.html("Amplitude: " + this.amp);
        this.fSlider.text.html("Frequency: " + this.freq);
    }
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
        traeger.set(mouseX, mouseY - height / 2);
    }

}