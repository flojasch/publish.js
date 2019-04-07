let img;
let planets = [];

function setup() {
  createCanvas(710, 400, WEBGL);
  img1 = loadImage('jupitermap.jpg');
  img2 = loadImage('earth.jpg');
  jupiter = new Planet(40, createVector(0, 0, 0),createVector(0, 0, 1), img1);
  planets.push(jupiter);
  earth = new Planet(40, createVector(300, 0, 0),createVector(0, 0, -1), img2);
  planets.push(earth);
}

function draw() {
  background(0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  camera(locX, locY, (height / 2) / tan(PI / 6), locX, locY, 0, 0, 1, 0);
  ambientLight(200);
  pointLight(255, 255, 255, -100, 0, 100);
  for (let i = 0; i < planets.length; i++) {
    planets[i].update();
    planets[i].show();
  }
}

class Planet {
  constructor(d, r, v,img) {
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
  update() {
    let a = createVector(0, 0, 0);
    for (let i = 0; i < planets.length; i++) {
      let ri = p5.Vector.sub(planets[i].r, this.r);
      let strength = ri.mag();
      if (strength != 0) {
        ri.mult(1000*pow(strength,-3));
        a.add(ri);
      }
    }
    this.v.add(a);
    this.r.add(this.v);
  }
}