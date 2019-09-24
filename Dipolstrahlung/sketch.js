let scale;
let t = 0;
let xext = 15;
let Ex, Ey;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);
  scale = width / xext;
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  background(200);
  translate(width / 2, height / 2);
  vectors();
  //fieldline(t%(xext/2)-1, 0);
  t += 0.05;
}

function fieldline(x, y) {
  let xalt, yalt;
  for (let k = 0; k < 2000; k++) {
    xalt = x;
    yalt = y;
    setEfeld(x, y);
    let E=sqrt(Ex*Ex+Ey*Ey)*100;
    x += Ex/E;
    y += Ey/E;
    stroke(0, 0, 255);
    line(xalt*scale, yalt*scale, x*scale, y*scale);
  }
}

function vectors() {
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      let x = i * xext / 50 - xext / 2;
      let y = j * xext / 50 - xext / 2;
      setEfeld(x, y);
      let arrow = new Arrow(x * scale, y * scale, Ex * scale, Ey * scale);
      arrow.show(color(255, 0, 0));
    }
  }
}

function setEfeld(x, y) {
  let xx = x * x;
  let yy = y * y;
  let rr = xx + yy+1;
  let r = sqrt(rr);
  Ex = -x * y / rr * cos(r - t) / r +
    3 * x * y / rr * (cos(r - t) / (rr * r) + sin(r - t) / rr);
  Ey = xx / rr * cos(r - t) / r +
    (3 * yy / rr - 1) * (cos(r - t) / (rr * r) + sin(r - t) / rr);

}

class Arrow {
  constructor(tx, ty, x, y) {
    this.tx = tx;
    this.ty = ty;
    this.x = x;
    this.y = y;
    this.r = 1;
    this.alpha = 0;
    this.update();
  }

  update() {
    this.r = sqrt(this.x * this.x + this.y * this.y);
    if (this.r != 0) {
      if (this.y > 0) {
        this.alpha = acos(this.x / this.r);
      } else {
        this.alpha = TWO_PI - acos(this.x / this.r);
      }
    }
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.update();
  }
  show(c) {
    stroke(c);
    noFill();
    push();
    translate(this.tx, this.ty);
    rotate(this.alpha);
    line(0, 0, this.r, 0);
    translate(this.r, 0);
    beginShape();
    vertex(-3, -1);
    vertex(0, 0);
    vertex(-3, 1);
    endShape(CLOSE);
    pop();
  }
}