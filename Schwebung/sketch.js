let slider;
let button;
let update = true;
let R = 50;

function setup() {
  createCanvas(windowWidth, 400);
  slider = createSlider(1, 2, 1, 0.04);
  slider.position(20, 50);
  button = createButton('start/stop');
  button.position(220, 50);
  button.mousePressed(onoff)
  a1 = new Arrow(color(255, 255, 0));
  a2 = new Arrow(color(0, 255, 255));
  a3 = new Arrow(color(255, 255, 255));
  //frameRate(30);
}

function onoff() {
  update = !update;
}

function draw() {
  background(0);
  translate(150, 200);
  a2.w = slider.value();
  if (update) {
    a1.update();
    a2.update();
    a3.x = a1.x + a2.x;
    a3.y = a1.y + a2.y;
    a3.r = sqrt(a3.x * a3.x + a3.y * a3.y);
    if (a3.y > 0) {
      a3.alpha = acos(a3.x / a3.r);
    } else {
      a3.alpha = 2*PI-acos(a3.x / a3.r);
    }
  }
  a1.show();
  a2.show();
  a2.show(a1.x, a1.y, false);
  // a1.show(a2.x,a2.y,false);
  a3.show();
  noFill();
  ellipse(0,0,2*R);
}

class Arrow {
  constructor(c) {
    this.wave = [];
    this.w = 1;
    this.c = c;
    this.x = R;
    this.y = 0;
    this.r = R;
    this.alpha = 0;
  }
  update() {
    this.alpha += this.w * 0.05;
    this.x = this.r * cos(this.alpha);
    this.y = this.r * sin(this.alpha);
  }

  show(tx = 0, ty = 0, plot = true) {
    stroke(255, 150);
    noFill();
   // ellipse(tx, ty, this.r * 2);
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
    if (plot) {
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
}