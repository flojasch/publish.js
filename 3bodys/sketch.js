let img;
let planets = [];
let button;
let third = true;
let xAngle = 0.5;
let yAngle = 0;
let trace = [];
let showBahn = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  img1 = loadImage('mercury.jpg');
  img2 = loadImage('earth.jpg');
  // img3 = loadImage('sun.jpg');
  img3 = loadImage('mars.jpg');
  // jupiter = new Planet(3,40, createVector(0, 0, 0), createVector(0, 0, 0.1), img1);
  // planets.push(jupiter);
  button = createButton('Planet');
  button.position(20, 20);
  button.mousePressed(togglePlanet);
  button1 = createButton('Bahn');
  button1.position(100, 20);
  button1.mousePressed(toggleBahn);
  set3Planets();

}

function set3Planets() {
  planets = [];
  let earth = new Planet(100, 40, createVector(250, 0, 0), createVector(0, -0.05, -0.2), img2);
  planets.push(earth);
  let mars = new Planet(100, 40, createVector(-250, 0, 0), createVector(0, -0.05, 0.2), img3);
  planets.push(mars);
  let mercury = new Planet(100, 40, createVector(0, 250, 0), createVector(0, 0.1, 0), img1);
  planets.push(mercury);
}

function toggleBahn() {
  trace = [];
  showBahn = !showBahn;
}

function togglePlanet() {
  if (third) {
    planets = [];
    trace = [];
    let earth = new Planet(100, 40, createVector(250, 0, 0), createVector(0, 0, -0.2), img2);
    planets.push(earth);
    let mars = new Planet(100, 40, createVector(-250, 0, 0), createVector(0, 0, 0.2), img3);
    planets.push(mars);
  } else {
    trace = [];
    set3Planets();
  }
  third = !third;
}

function draw() {
  background(0);
  if (trace.length > 10000) {
    trace = [];
  }
  rotateX(-xAngle);
  rotateY(yAngle);
  ambientLight(100);
  directionalLight(255, 255, 255, 1, 0, -1);
  for (let j = 0; j < 10; j++) {
    Planet.update(planets);
    if (showBahn) {
      let v = planets[1].r;
      trace.push(createVector(v.x, v.y, v.z));
    }
  }
  for (let i = 0; i < planets.length; i++) {
    planets[i].show();
  }
  if (keyIsPressed) {
    if (keyCode == UP_ARROW) {
      xAngle += 0.01;
    }
    if (keyCode == DOWN_ARROW) {
      xAngle -= 0.01;
    }
    if (keyCode == RIGHT_ARROW) {
      yAngle += 0.01;
    }
    if (keyCode == LEFT_ARROW) {
      yAngle -= 0.01;
    }
  }

  stroke(255, 0, 0);
  strokeWeight(4);
  beginShape(POINTS);
  for (let i = 0; i < trace.length; i++) {
    let v = trace[i];
    vertex(v.x, v.y, v.z);
  }
  endShape();
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
    translate(this.r);
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