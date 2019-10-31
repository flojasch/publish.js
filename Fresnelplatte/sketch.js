let R = 500;
let slider;
let lambda = 200;
let brightness = [];
let y0 = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 300, 50, 1);
  slider.position(50, 50);
  lambslider = createSlider(1, 300, 100, 1);
  lambslider.position(50, 100);
  button = createButton("calcLight");
  button.position(50, 200);
  button.mousePressed(setBrightness);
}

function setBrightness() {
  let d = width / arrownum;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let x = i;
      let y = j;
      let arrnum=0;
      for (let eX = 0; eX < width; eX += d) {
        let x0=eX-width/2;
        if (cos(TWO_PI / lambda * (sqrt(y0 * y0 + x0 * x0) - y0)) > 0) {
          let dx = i - eX;
          let alpha = sqrt(j * j + dx * dx) / lambda * TWO_PI;
          x += cos(alpha);
          y += sin(alpha);
          ++arrnum;
        }
      }
      let dx = i - x;
      let dy = j - y;
      brightness[i + width * j] = 255/(arrnum*arrnum)  * (dx * dx + dy * dy);
    }
  }
}

function setPixel() {
  loadPixels();
  for (let k = 0; k < width * height; k++) {
    pixels[k * 4] = brightness[k];
    pixels[k * 4 + 1] = 0;
    pixels[k * 4 + 2] = 0;
    pixels[k * 4 + 3] = 255;
  }
  updatePixels();
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  arrownum = slider.value();
  lambda = lambslider.value();

  Arrows = [];
  //background(0);
  setPixel();
  stroke(0, 0, 250);
  line(50, 120, 50 + lambda, 120);
  let d = width / arrownum;
  R = 1000 / arrownum;
  let x = mouseX;
  let y = mouseY;
  for (let eX = 0; eX < width; eX += d) {
    let x0=eX-width/2;
    if (cos(TWO_PI / lambda * (sqrt(y0 * y0 + x0 * x0) - y0)) > 0) {
      let dx = mouseX - eX;
      let alpha = sqrt(mouseY * mouseY + dx * dx) / lambda * TWO_PI;
      let arrow = new Arrow(x, y, alpha);
      arrow.show();
      stroke(255, 255, 255, 100);
      line(eX, 0, x, y);
      x += R * cos(alpha);
      y += R * sin(alpha);
    }
  }
  stroke(255, 0, 0);
  line(mouseX, mouseY, x, y);

}

class Arrow {
  constructor(xa, ya, alpha) {
    this.alpha = alpha;
    this.xa = xa;
    this.ya = ya;
  }

  show() {
    stroke(0, 255, 255);
    push();
    translate(this.xa, this.ya);
    noFill();
    rotate(this.alpha);
    line(0, 0, R, 0);
    translate(R, 0);
    beginShape();
    vertex(-4, -1.5);
    vertex(0, 0);
    vertex(-4, 1.5);
    endShape(CLOSE);
    pop();
  }
}