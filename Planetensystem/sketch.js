let img;
let planets = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage('mercury.jpg');

  for (let i = 0; i < 300; ++i) {
    let x = width * random() - width / 2;
    let y = height * random() - height / 2;
    let z = width * random()- width/2;
    let r =createVector(x,y,z);
    let v =p5.Vector.cross(r,createVector(0,0.0015,0));
    planets.push(new Planet(100, 15,r , v, img));
    //rotateX(-PI/3);
  }
  // let p = new Planet(100, 20, createVector(-width / 2, 0.1, 0), createVector(0, 0.1, 0), img);
  // planets.push(p);
  // p = new Planet(100, 20, createVector(width/2, 0, 0), createVector(0, 0.1, 0), img);
  // planets.push(p);
}

function draw() {
  background(0);
  orbitControl();
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

  copy(){
    return new Planet(this.m,this.d,this.r,this.v,img);
  }
  show() {
    push();
    translate(this.r.x, this.r.y, this.r.z);
    noStroke();
    texture(this.img);
    sphere(this.d);
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
    }


    for (let i = planets.length - 1; i >= 0; i--) {
      for (let j = planets.length - 1; j > i; j--) {
        let fij = p5.Vector.sub(planets[j].r, planets[i].r);
        let dist = fij.mag();
        if (dist < planets[i].d + planets[j].d) {
          let p1=planets[j].copy();
          planets.splice(j, 1);
          let p2=planets[i].copy();
          planets.splice(i, 1);
          planets.push(Planet.createPlanet(p1, p2));

        }
      }
    }
  }
}