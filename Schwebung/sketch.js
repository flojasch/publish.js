let slider;
let button;
let update = true;

function setup() {
  createCanvas(windowWidth, 400);
  slider = createSlider(0, 2, 1, 0.05);
  slider.position(20, 50);
  button = createButton('start/stop');
  button.position(220, 50);
  button.mousePressed(onoff)
  let radius = 50;
  a1 = new Arrow(radius, 1, color(255, 255, 0));
  a2 = new Arrow(radius, 1, color(0, 255, 255));
  a3 = new Arrow(radius, 1, color(255, 255, 255));
  //frameRate(30);
}

function onoff() {
  update = !update;
}

function draw() {
  background(0);
  translate(150, 200);
  a2.w = slider.value();
  a3.w = a2.w;
  if (update) {
    a1.update();
    a2.update();
    a3.update();
  }
  a1.show();
  a2.show();
  a3.show(a1.x, a1.y);

}

class Arrow {
  constructor(r, w, c) {
    this.wave = [];
    this.r = r;
    this.w = w;
    this.c = c;
    this.x = 0;
    this.y = 0;
    this.alpha = 0;
  }
  update() {
    this.alpha += this.w * 0.05;
    this.x = this.r * cos(this.alpha);
    this.y = this.r * sin(this.alpha);
  }

  show(tx = 0, ty = 0) {
    stroke(255, 150);
    noFill();
    ellipse(tx, ty, this.r * 2);
    stroke(this.c);
    fill(this.c);
    push();
    translate(tx, ty);
    rotate(this.alpha);
    line(0, 0, this.r, 0);
    translate(this.r, 0);
    beginShape();
    vertex(-7, -3);
    vertex(0, 0);
    vertex(-7, 3);
    endShape(CLOSE);
    pop();

    let x = this.x + tx;
    let y = this.y + ty;
    if (update) {
      this.wave.unshift(y);
    }
    push();
    translate(200, 0);
    stroke(255, 100);
    line(x - 200, y, 0, this.wave[0]);
    stroke(this.c);
    beginShape();
    noFill();
    for (let i = 0; i < this.wave.length; i++) {
      vertex(i, this.wave[i]);
    }
    endShape();
    if (this.wave.length > width - 150) {
      this.wave.pop();
    }
    pop();
  }
}