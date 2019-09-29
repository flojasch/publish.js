let scale;
let t = 0;
let xext = 15;
let r0 = [];
let charge;
let c = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);
  scale = width / xext;
  charge = new Charge(0, 0, 1);
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  background(200);
  translate(width / 2, height / 2);
  vectors();
  let x = (mouseX - width / 2) / scale;
  let y = (mouseY - height / 2) / scale;
  r0[t] = new p5.Vector(x, y);
  charge.x = x;
  charge.y = y;
  alpha=0;
  for (let n = 0; n < 10; n++) {
    alpha += TWO_PI / 10;
    x = charge.x + 0.1 * cos(alpha);
    y = charge.y + 0.1 * sin(alpha);
    fieldline(x, y);
  }
  charge.show();
  if(t<300){
    t++;
  } else {
    r0.splice(0,1);
  }
}

function fieldline(x, y) {
  let xalt, yalt;
  for (let k = 0; k < 100; k++) {
    xalt = x;
    yalt = y;
    let E=Efeld(x, y);
    E.normalize();
    x += E.x*0.1;
    y += E.y*0.1;
    stroke(0, 0, 255);
    line(xalt * scale, yalt * scale, x * scale, y * scale);
  }
}

function vectors() {
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      let x = i * xext / 50 - xext / 2;
      let y = j * xext / 50 - xext / 2;
      E=Efeld(x, y);
      if (E.mag() < 1.5) {
        let arrow = new Arrow(x * scale, y * scale, E.x * scale, E.y * scale);
        arrow.show(color(255, 0, 0));
      }
    }
  }
}

function Efeld(x, y) {
  let R=1;
  let Rv=new p5.Vector(1,1);
  let vv=new p5.Vector(1,1);
  let v=1;
  let a=new p5.Vector(1,1);
  let r = new p5.Vector(x, y);
  for (let j = t; j > 0; j--) {
    Rv = p5.Vector.sub(r, r0[j]);
    R=Rv.mag();
    if (R / c < t - j) {
      vv=p5.Vector.sub(r0[j],r0[j-1]);
      let v1=p5.Vector.sub(r0[j-1],r0[j-2]);
      a=p5.Vector.sub(vv,v1);
      a.div(c*c);
      vv.div(c);
      break;
    }
  }
  v=vv.mag();
  vv.mult(R);
  let Ev=p5.Vector.sub(Rv,vv);
  Ev.mult(pow(R-p5.Vector.dot(vv,Rv),-3));
  let Eb=p5.Vector.cross(Ev,a);
  Eb=p5.Vector.cross(Rv,Eb);
  return p5.Vector.add(Ev.mult(1-v*v),Eb);
}

class Charge {
  constructor(x, y, ladung) {
    this.x = x;
    this.y = y;
    this.charge = ladung;
  }
  show() {
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