let traeger;
let gen;
let picked = false;
let osziNum = 200;
let y0;
let y = 0;
let t = 0;
let reflektButton;
let text;

function setup() {
    canvas = createCanvas(windowWidth, 500);
    cSlider = new Slider(220, height + 20, 0.1, 0.5, 0.2, 0.05);
    resetButton = createButton('Reset');
    resetButton.position(20, height + 20);
    resetButton.mousePressed(reset);
    reflektButton = createButton('fest/lose');
    reflektButton.position(width - 150, height + 20);
    text = createP();
    text.style('font-size', '160%');
    text.html('festes Ende');
    text.position(width - 200, height + 50);
    reflektButton.mousePressed(toggleEnde);
    traeger = new Traeger(osziNum);
    gen = new Generator(0, 0.2, 0.01);

}

function reset() {
    traeger.reset();
    t = 0;
}

function toggleEnde() {
    traeger.reset();
    t = 0;
    traeger.fest = !traeger.fest;
    if (traeger.fest) {
        text.html('festes Ende');
    } else {
        text.html('loses Ende');
    }
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
        this.fSlider = new Slider(420, height + 20, 0, 1, 0.5, 0.005);
        this.aSlider = new Slider(620, height + 20, 0, 10, 3, 0.1);
        this.on = false;
    }

    update() {
        if (this.freq != this.fSlider.slider.value()) {
            this.freq = this.fSlider.slider.value();
            traeger.reset();
            t = 0;
            while (t < 150) {
                traeger.update();
                traeger.set(this.x, this.amp * Math.sin(t * 2 * Math.PI * this.freq));
                t += 0.02;
            }
        }

        this.amp = this.aSlider.slider.value();
        traeger.set(this.x, this.amp * Math.sin(t * 2 * Math.PI * this.freq));
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
    traeger.update();
    gen.update();
    traeger.show();
    t += 0.02; 
    if (picked) {
        traeger.pull(mouseX, mouseY - height / 2);
    }

}