let cube = [];
let len = 50;
let size = 1;
let started = false;
let angle = 0;
let speed = 0.1;
let animating = false;
let finished = false;
let move;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  let index = 0;
  for (let i = -size; i <= size; i++) {
    for (let j = -size; j <= size; j++) {
      for (let k = -size; k <= size; k++) {
        let x = i * len;
        let y = j * len;
        let z = k * len;
        let matrix = new p5.Matrix();
        matrix.translate([x, y, z]);
        cube[index] = new Cubie(matrix, x, y, z);
        index++;
      }
    }
  }
  move = new Move(0, 0, 1, 1);
}

function draw() {
  background(0);
  orbitControl();
  rotateX(-0.5);
  rotateY(0.4);
  rotateZ(0.1);
  ambientLight(250);
  background(51);
  move.update();
  
  for (let i = 0; i < cube.length; i++) {
    push();
    if (abs(move.z) > 0  && cube[i].z == move.z * len) {
      rotateZ(angle);
    }
    if (abs(move.y) > 0  && cube[i].y == move.y * len) {
      rotateY(angle);
    }
    if (abs(move.x) > 0  && cube[i].x == move.x * len) {
      rotateX(angle);
    }
    cube[i].show();
    pop();
  }

}

function turnZ(index, dir) {
  for (let i = 0; i < cube.length; i++) {
    let qb = cube[i];
    if (qb.z == index * len) {
      let matrix = new p5.Matrix();
      matrix.rotateZ(dir * HALF_PI);
      matrix.translate([qb.x, qb.y, qb.z]);
      qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
      qb.turnFacesZ(dir);
    }
  }
}

function turnY(index, dir) {
  for (let i = 0; i < cube.length; i++) {
    let qb = cube[i];
    if (qb.y == index * len) {
      let matrix = new p5.Matrix();
      matrix.rotateY(dir * HALF_PI);
      matrix.translate([qb.x, qb.y, qb.z]);
      qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
      qb.turnFacesY(dir);
    }
  }
}

function turnX(index, dir) {
  for (let i = 0; i < cube.length; i++) {
    let qb = cube[i];
    if (qb.x == index * len) {
      let matrix = new p5.Matrix();
      matrix.rotateX(dir * HALF_PI);
      matrix.translate([qb.x, qb.y, qb.z]);
      qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
      qb.turnFacesX(dir);
    }
  }
}