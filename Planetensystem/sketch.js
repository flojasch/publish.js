let img;
let planets = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage('mercury.jpg');

  for (let i = 0; i < 400; ++i) {
    let s = 1000;
    let x = s * random() - 500;
    let y = s * random() - 500;
    let z = -s * random() - 500;
    let p = new Planet(100, 20, createVector(x, y, z), createVector(0, 0, 0), img);
    planets.push(p);
  }
}

function draw() {
  background(0);
  ambientLight(100);
  directionalLight(255, 255, 255, -1, -1, -1);
  // let locX = mouseX - width / 2;
  // let locY = mouseY - height / 2;
  // camera(locX, locY, (height / 2) / tan(PI / 6), locX, locY, 0, 0, 1, 0);

  for (let j = 0; j < 10; j++) {
    Planet.update(planets);
  }
  for (let i = 0; i < planets.length; i++) {
    planets[i].show();
  }
}

class Planet {
  constructor(m, d, r, v, img) {
    this.m = m;
    this.d = d;
    this.r = r;
    this.img = img;
    this.v = v;
  }
  show() {
    push();
    translate(this.r.x, this.r.y, this.r.z);
    noStroke();
    texture(this.img);
    sphere(this.d);
    pop();

  }
  static update(planets) {
    let a = [];
    for (let i = 0; i < planets.length; i++) {
      a[i] = createVector(0, 0, 0);
      for (let j = 0; j < planets.length; j++) {
        if (j != i) {
          let fij = p5.Vector.sub(planets[j].r, planets[i].r);
          let dist = fij.mag();
          fij.mult(planets[j].m / pow(dist, 3));
          a[i].add(fij);
        }
      }
    }
    for (let i = 0; i < planets.length; i++) {
      planets[i].v.add(a[i]);
      planets[i].r.add(planets[i].v);
    }
  }
}