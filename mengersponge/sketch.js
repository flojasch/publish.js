let sponge = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  ambientLight(200, 200, 200)
  let b = new Box(0, 0, 0, 400);
  sponge.push(b);

}

function mousePressed() {
  let next = [];
  for (let i = 0; i < sponge.length; i++) {
    let b = sponge[i];
    let newBoxes = b.generate();
    next = next.concat(newBoxes);
  }
  sponge = next;
}


function draw() {
  background(51);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  for (let i = 0; i < sponge.length; i++) {
    let b = sponge[i];
    b.show();
  }
}


class Box {
  constructor(x, y, z, r) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
  }
  show() {
    push();
    translate(this.x, this.y, this.z);
    directionalLight(250, 250, 250, -1, -1, 0.25);
    ambientMaterial(125, 20, 80);
    noStroke();
    box(this.r);
    pop();
  }
  generate() {
    let boxes = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          let sum = abs(i) + abs(j) + abs(k);
          let newR = this.r / 3;
          if (sum <= 1) {
            let b = new Box(this.x + i * newR, this.y + j * newR, this.z + k * newR, newR);
            boxes.push(b);
          }
        }
      }
    }
    return boxes;
  }
}