let img;
let planets = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  img1 = loadImage('mercury.jpg');
  img2 = loadImage('earth.jpg');
  // img3 = loadImage('sun.jpg');
  img3 = loadImage('mars.jpg');
  // jupiter = new Planet(3,40, createVector(0, 0, 0), createVector(0, 0, 0.1), img1);
  // planets.push(jupiter);
  let earth = new Planet(100, 40, createVector(250, 0, 0), createVector(0, -0.05, -0.2), img2);
  planets.push(earth);
  let mars = new Planet(100, 40, createVector(-250, 0, 0), createVector(0, -0.05, 0.2), img3);
  planets.push(mars);
  let mercury = new Planet(100, 40, createVector(0, 250, 0), createVector(0, 0.1, 0), img1);
  planets.push(mercury);
}

function draw() {
  background(0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  camera(locX, locY, (height / 2) / tan(PI / 6), locX, locY, 0, 0, 1, 0);
  ambientLight(200);
  pointLight(255, 255, 255, -100, 0, 100);
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