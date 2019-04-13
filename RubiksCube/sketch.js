let dim = 3;
let cube = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < dim; i++) {
    cube[i] = [];
    for (let j = 0; j < dim; j++) {
      cube[i][j] = [];
      for (let k = 0; k < dim; k++) {
        let len = 50;
        let offset = (dim - 1)* len * 0.5;
        let x = len * i-offset;
        let y = len * j-offset;
        let z = len * k-offset;
        cube[i][j][k] = new Cubie(x, y, z, len);
      }
    }
  }
}

function draw() {
  background(0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
 // camera(locX, locY, (height / 2) / tan(PI / 6), locX, locY, 0, 0, 1, 0);
 orbitControl();
 ambientLight(200);
  //pointLight(255, 255, 255, -100, 0, 100);
  background(255);
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      for (let k = 0; k < dim; k++) {
        cube[i][j][k].show();
      }
    }
  }
}


class Cubie {

  constructor(x, y, z, len) {
    this.pos = new p5.Vector(x, y, z);
    this.len = len;
  }

  show() {
    stroke(0);
    strokeWeight(6);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    let r = this.len / 2;

    // z-fixed
    fill(256, 256, 256);
    beginShape();
    vertex(-r, -r, -r);
    vertex(r, -r, -r);
    vertex(r, r, -r);
    vertex(-r, r, -r);
    endShape(CLOSE);

    fill(256, 256, 0);
    beginShape();
    vertex(-r, -r, r);
    vertex(r, -r, r);
    vertex(r, r, r);
    vertex(-r, r, r);
    endShape(CLOSE);

    // y-fixed
    fill(256, 128, 0);
    beginShape();
    vertex(-r, -r, -r);
    vertex(r, -r, -r);
    vertex(r, -r, r);
    vertex(-r, -r, r);
    endShape(CLOSE);

    fill(256, 0, 0);
    beginShape();
    vertex(-r, r, -r);
    vertex(r, r, -r);
    vertex(r, r, r);
    vertex(-r, r, r);
    endShape(CLOSE);

    // x-fixed
    fill(0, 256, 0);
    beginShape();
    vertex(-r, -r, -r);
    vertex(-r, r, -r);
    vertex(-r, r, r);
    vertex(-r, -r, r);
    endShape(CLOSE);

    fill(0, 0, 256);
    beginShape();
    vertex(r, -r, -r);
    vertex(r, r, -r);
    vertex(r, r, r);
    vertex(r, -r, r);
    endShape(CLOSE);

    //box(len);
    pop();
  }
}