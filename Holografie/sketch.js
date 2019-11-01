let R = 2;
let slider;
let lambda = 200;
let brightness = [];
let d;
let points = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1,20, 1, 1);
  slider.position(50, 50);
  lambslider = createSlider(1, 300, 20, 1);
  lambslider.position(50, 100);
  button = createButton("calcLight");
  button.position(30, 150);
  button.mousePressed(setBrightness);
}

function mousePressed() {
  if (mouseX > 200) {
    points.push(new Point(mouseX, mouseY));
  }
}

function isOpen(sX) {
  let ret = false;
  let x=points.length;
  let y=0;
  for (let point of points) {
    let x0 = sX - point.x;
    let y0 = point.y;
    let alpha=TWO_PI / lambda * sqrt(y0 * y0 + x0 * x0);
    x+=cos(alpha);
    y+=sin(alpha);
  }
  if (x*x+y*y > points.length*points.length*1.8) {
    ret = true;
  }
  return ret;
}

function setBrightness() {
  let dy, dx;
  let d=10;
  let max=0;
  for (let i = 0; i < width; i += d) {
    for (let j = 0; j < height; j += d) {
      let x = i;
      let y = j;
      for (let sX = 0; sX < width; sX += d) {
        if (isOpen(sX)) {
          let dx = i - sX;
          let alpha = sqrt(j * j + dx * dx) / lambda * TWO_PI;
          x += cos(alpha);
          y += sin(alpha);
        }
      }
      dx = i - x;
      dy = j - y;
      let intensity=dx * dx + dy * dy;
      if(intensity>max){
        max=intensity;
      }
      for (let u = i; u < i + d; u++) {
        for (let v = j; v < j + d; v++) {
          brightness[u + width * v] = intensity;
        }
      }
    }
  }
  for (let u = 0; u < width; u++) {
    for (let v = 0; v < height; v++) {
      brightness[u + width * v] *= 255/max;
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
  d = slider.value();
  lambda = lambslider.value();

  Arrows = [];
  //background(0);
  setPixel();
  stroke(0, 0, 250);
  line(50, 120, 50 + lambda, 120);
  let x = mouseX;
  let y = mouseY;
  for (let eX = 0; eX < width; eX += d) {
    if (isOpen(eX)) {
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