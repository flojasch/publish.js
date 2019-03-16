let blockImg;
let block1;
let block2;
let clack;
let m2;
let count = 0;
let digits = 1;
let countDiv;
let timeSteps = 10 ** (digits - 1);
let slider;

function preload() {
  blockImg = loadImage('block.png');
  clack = loadSound('clack.wav');
}

function setup() {
  createCanvas(windowWidth, 200);
  slider = new Slider(20, 320, 1, 7, 1);
  countDiv = createDiv(count);
  countDiv.style('font-size', '72pt');
  start();
}

function start() {
  count = 0;
  timeSteps = 10 ** (digits - 1);
  block1 = new Block(100, 20, 1, 0, 0);
  m2 = pow(100, digits - 1);
  slider.text.html('Mass of big block: '+ m2+'kg <br> Mass of small block: 1kg');
  block2 = new Block(300, 100, m2, -1 / timeSteps, 20);
}

class Slider {
  constructor(x, y, first, last, beginn, step=1) {
    this.slider = createSlider(first, last, beginn, step);
    this.slider.position(x, y);
    this.text = createP();
    this.text.position(x, y + 20);
    this.text.style('font-size', '200%');
  }
}

function draw() {
  if (slider.slider.value() != digits) {
    digits = slider.slider.value();
    start();
  }
  background(200);

  let clackSound = false;

  for (let i = 0; i < timeSteps; i++) {
    if (block1.collide(block2)) {
      const v1 = block1.bounce(block2);
      const v2 = block2.bounce(block1);
      block1.v = v1;
      block2.v = v2;
      clackSound = true;
      count++;
    }

    if (block1.hitWall()) {
      block1.reverse();
      clackSound = true;
      count++;
    }

    block1.update();
    block2.update();
  }

  if (clackSound) {
    clack.play();
  }
  block1.show();
  block2.show();

  countDiv.html(nf(count, digits));
}