let scale;
let t;
let xext = 30;
let charges;
let c = 0.2;
let lines;
let ln = 10;
let button;
let vButton;
let showVectors = true;
let fieldlines = true;

function setup() {
  charges = [];
  lines = [];
  t = 0;
  button = createButton('Feldlinien');
  button.position(50, 50);
  button.mousePressed(feldlinien);
  vButton = createButton('E-Feld');
  vButton.position(150, 50);
  vButton.mousePressed(toggleVectors);
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);
  scale = width / xext;
  charges.push(new Charge(0, 0, 1));
  charges.push(new Charge(0, 0, -1));
  alpha = 0;
  for (let n = 0; n < ln; n++) {
    alpha += TWO_PI / ln;
    x = 0.1 * cos(alpha);
    y = 0.1 * sin(alpha);
    lines.push(new Line(x, y));
  }
}

function feldlinien() {
  fieldlines = !fieldlines;
}

function toggleVectors() {
  showVectors = !showVectors;
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  background(200);
  translate(width / 2, height / 2);
  // let x = (mouseX - width / 2) / scale;
  // let y = (mouseY - height / 2) / scale;
  charges[0].x = 0;
  charges[0].y = sin(t);
  charges[1].x = 0;
  charges[1].y = -sin(t);
  for (let C of charges) C.r0.push(new p5.Vector(C.x, C.y));
  vectors();
  alpha = 0;
  for (let n = 0; n < ln; n++) {
    alpha += TWO_PI / ln;
    lines[n].y = charges[0].y + 0.1 * sin(alpha);
    if ((t - 0.1) % PI < HALF_PI && fieldlines) lines[n].showcharge();
  }
  if ((t + HALF_PI - 0.1) % PI < 0.15) {
    for (let n = 0; n < ln; n++) {
      lines.push(new Line(lines[n].xs, 0));
    }
  }
  for (let n = ln; n < lines.length; n++) {
    let sign = Math.sign(lines[n].x);
    lines[n].x += sign * c;
    if (abs(lines[n].x) > xext * 0.75) {
      lines.splice(n, 1);
    } else {
      if (fieldlines) lines[n].show();
    }
  }
  for (let C of charges) C.show();

  for (let C of charges) {
    if (C.r0.length > 200) {
      C.r0.splice(0, 1);
    }
  }
  t += 0.15;
}

function vectors() {
  for (let i = 0; i < 50; i++) {
    if (showVectors) {
      for (let j = 0; j < 50; j++) {
        let x = i * xext / 50 - xext / 2;
        let y = j * xext / 50 - xext / 2;
        let E = Efeld(x, y);
        if (E.mag() < 1) {
          let arrow = new Arrow(x * scale, y * scale, E.x * scale * 5, E.y * scale * 5);
          arrow.show(color(255, 0, 0));
        }
      }
    } else {
      let x = i * xext / 50 - xext / 2;
      let y = 0;
      let E = Efeld(x, y);
      let arrow = new Arrow(x * scale, y * scale, E.x * scale * 5, E.y * scale * 5);
      arrow.show(color(255, 0, 0));
    }
  }
}

function Efeld(x, y) {
  let res = new p5.Vector(0, 0);
  for (let charge of charges) {
    res.add(charge.efeld(x, y));
  }
  return res;
}

class Line {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xs = 0;
  }

  showcharge() {
    let xalt, yalt;
    let x = this.x;
    let y = this.y;
    for (let k = 0; k < 400; k++) {
      xalt = x;
      yalt = y;
      let E = Efeld(x, y);
      E.normalize();
      let delta = 0.05;
      x += E.x * delta;
      y += E.y * delta;
      stroke(0, 0, 255);
      line(xalt * scale, yalt * scale, x * scale, y * scale);
      if (abs(y) < delta) {
        this.xs = x;
      }
    }
  }

  show() {
    for (let dir = -1; dir < 2; dir += 2) {
      let xalt, yalt;
      let x = this.x;
      let y = this.y;
      for (let k = 0; k < 400; k++) {
        xalt = x;
        yalt = y;
        let E = Efeld(x, y);
        E.normalize();
        let delta = 0.1;
        x += dir * E.x * delta;
        y += dir * E.y * delta;
        stroke(0, 0, 255);
        line(xalt * scale, yalt * scale, x * scale, y * scale);
        if (abs(y) < delta) {
          break;
        }
      }
    }
  }
}

class Charge {
  constructor(x, y, ladung) {
    this.r0 = [];
    this.x = x;
    this.y = y;
    this.charge = ladung;
  }

  efeld(x, y) {
    let r = new p5.Vector(x, y);
    let t = this.r0.length;
    for (let j = t; j > 1; j--) {
      let Rv = p5.Vector.sub(r, this.r0[j]);
      let R = Rv.mag();
      if (R / c < t - j) {
        let vv = p5.Vector.sub(this.r0[j], this.r0[j - 1]);
        // console.log(vv);
        let v1 = p5.Vector.sub(this.r0[j - 1], this.r0[j - 2]);
        let a = p5.Vector.sub(vv, v1);
        // console.log(a);
        a.div(c * c);
        vv.div(c);
        let v = vv.mag();
        let Ev = p5.Vector.sub(Rv, p5.Vector.mult(vv, R));
        Ev.mult(pow(R - p5.Vector.dot(vv, Rv), -3));
        let Eb = p5.Vector.cross(Rv, p5.Vector.cross(Ev, a));
        let res = p5.Vector.add(Ev.mult(1 - v * v), Eb);
        return p5.Vector.mult(res, this.charge);
      }
    }
    return new p5.Vector(0, 0.01);
  }

  show() {
    push();
    translate(this.x * scale, this.y * scale);
    stroke(0);
    if (this.charge == -1) {
      fill(0, 0, 255);
      circle(0, 0, 10);
      line(-7, 0, 7, 0);
    } else {
      fill(255, 0, 0);
      circle(0, 0, 10);
      line(-7, 0, 7, 0);
      line(0, -7, 0, 7);
    }
    pop();
  }
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