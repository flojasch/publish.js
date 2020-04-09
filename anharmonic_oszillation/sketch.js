let slider;
let p = 1;
let norm = 1;

function force(x) {
  if (x < 0) {
    return 0.3 * (p + 1) * norm * Math.pow(-x, p);
  } else {
    return -0.3 * (p + 1) * norm * Math.pow(x, p);
  }
}

function potential(x) {
  return norm * Math.pow(x, p + 1);
}

class Pendel {
  constructor(x, v, color) {
    this.x = x;
    this.v = v;
    this.color = color;
  }

  acceleration(x) {
    return force(x);
  }
  update() {
    this.x += this.v;
    this.v += this.acceleration(this.x);
    stroke(0);
    strokeWeight(1);
    fill(this.color);
    ellipse(width / 2 + this.x, height / 2, 30, 30);
    ellipse(width / 2 + this.x, height / 2 - potential(Math.abs(this.x)), 20, 20);
    //draw Arrow
    stroke(200, 0, 0);
    strokeWeight(2);
    fill(200, 0, 0);
    push();
    translate(width / 2 + this.x, height / 2);
    if (force(this.x) < 0) rotate(PI);
    line(0, 0, 200 * abs(force(this.x)), 0);
    translate(200 * abs(force(this.x)), 0);
    beginShape();
    vertex(-7, -3);
    vertex(0, 0);
    vertex(-7, 3);
    endShape(CLOSE);
    pop();
  }
}

function setup() {
  createCanvas(1000, 1000);
  slider = createSlider(0, 2, 1, 0.1);
  slider.position(50, 50);
  norm = height / (2 * Math.pow(width / 2 - 100, p + 1));
  p1 = new Pendel(width / 2 - 20, 0, color(200, 0, 0));
  p2 = new Pendel(width / 4, 0, color(0, 0, 200));
  fill(250, 0, 0);
}

function draw() {
  background(50);
  if (slider.value() != p) {
    p = slider.value();
    p1.x = width / 2 - 20;
    p1.v = 0;
    p2.x = width / 4;
    p2.v = 0;
  }
  norm = height / (2 * Math.pow(width / 2, p + 1));
  p1.update();
  p2.update();
  for (let i = 0; i < width / 2; i += 4) {
    stroke(200, 200, 0);
    strokeWeight(2);
    line(width / 2 + i, height / 2 - potential(i), width / 2 + i + 4, height / 2 - potential(i + 4));
    line(width / 2 - i, height / 2 - potential(i), width / 2 - i - 4, height / 2 - potential(i + 4));
    stroke(200, 0, 0);
    // point(width / 2 + i, height / 2 - 200*force(i));
    // point(width / 2 - i, height / 2 + 200*force(i));
  }
}