let img;
let planets = [];
let yAngle = 0;
let xAngle = 0;
let x=0;
let y=0;
let z=0;
let s = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage('mercury.jpg');
  sun = loadImage('sun.jpg');

  for (let i = 0; i < 300; ++i) {
    let L = 1000;
    let x = L * (random() - 0.5);
    let y = L * (random() - 0.5);
    let z = L * (random() - 0.5);
    let r = createVector(x, y, z);
    let v = p5.Vector.cross(r, createVector(0, 0.001, 0));
    // v.normalize();
    planets.push(new Planet(100, 15, r, v, img));
  }
  text = createP('Number of Planets: ' + planets.length);
  text.position(10, 10);
  text.style("color", "#B0B0B0");
  text.style("font-size", "18pt");

}

function draw() {
  background(0);
  text.html('Number of Planets: ' + planets.length);
  ambientLight(100);
  directionalLight(255, 255, 255, -1, -1, -1);
  translate(0,0,400);
  rotateX(xAngle);
  rotateY(yAngle);
  translate(0,0,-400);
  translate(x,y,z);
  
  if(keyIsPressed){
    steering();
  }
  for (let j = 0; j < 5; j++) {
    Planet.update(planets);
  }
  for (let i = 0; i < planets.length; i++) {
    planets[i].show();
  }

}

function steering() {
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
  if (key == '+') {
    s *= 1.01;
  }
  if (key == '-') {
    s /= 1.01;
  }
  if (key == 'e') {
    newPos(2);
  }
  if (key == 'd') {
    newPos(-2);
  }
}

function newPos(incr) {
  x += incr * sin(-yAngle) * cos(xAngle);
  y += incr * sin(xAngle);
  z += incr * cos(yAngle) * cos(xAngle);

}

class Planet {
  constructor(m, d, r, v, img) {
    this.m = m;
    this.d = d;
    this.r = r;
    this.img = img;
    this.v = v;
  }

  copy() {
    return new Planet(this.m, this.d, this.r, this.v, img);
  }


  show() {

    push();
    translate(s * this.r.x, s * this.r.y, s * this.r.z);
    noStroke();
    texture(this.img);
    sphere(s * this.d);
    pop();

  }

  static createPlanet(p1, p2) {
    let m = p1.m + p2.m;
    let r = p5.Vector.add(p1.r.mult(p1.m), p2.r.mult(p2.m));
    r.div(m);
    let v = p5.Vector.add(p1.v.mult(p1.m), p2.v.mult(p2.m));
    v.div(m);
    let d = pow(pow(p1.d, 3) + pow(p2.d, 3), 1.0 / 3);
    return new Planet(m, d, r, v, img);
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
      planets[i].v.add(a[i].mult(0.01));
      planets[i].r.add(planets[i].v);
      if (planets[i].d > 50) {
        planets[i].img = sun;
      }
    }


    for (let i = planets.length - 1; i >= 0; i--) {
      for (let j = planets.length - 1; j > i; j--) {
        let fij = p5.Vector.sub(planets[j].r, planets[i].r);
        let dist = fij.mag();
        if (dist < planets[i].d + planets[j].d) {
          let p1 = planets[j].copy();
          planets.splice(j, 1);
          let p2 = planets[i].copy();
          planets.splice(i, 1);
          planets.push(Planet.createPlanet(p1, p2));

        }
      }
    }
  }
}