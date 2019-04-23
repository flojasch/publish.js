class Cubie {
  constructor(m, x, y, z) {
    this.x=x;
    this.y=y;
    this.z=z;
    this.matrix = m;
    this.c = color(255);
    this.faces = [];
    this.faces[0] = new Face(new p5.Vector(0, 0, -1), color(0, 0, 255));
    this.faces[1] = new Face(new p5.Vector(0, 0, 1), color(0, 255, 0));
    this.faces[2] = new Face(new p5.Vector(0, 1, 0), color(255, 255, 255));
    this.faces[3] = new Face(new p5.Vector(0, -1, 0), color(255, 255, 0));
    this.faces[4] = new Face(new p5.Vector(1, 0, 0), color(255, 150, 0));
    this.faces[5] = new Face(new p5.Vector(-1, 0, 0), color(255, 0, 0));
  }

  turnFacesZ(dir) {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnZ(dir * HALF_PI);
    }
  }

  turnFacesY(dir) {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnY(dir * HALF_PI);
    }
  }

  turnFacesX(dir) {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnX(dir * HALF_PI);
    }
  }

  update(x, y, z) {
    this.matrix=p5.Matrix.identity();
    this.matrix.translate([x, y, z]);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  show() {
    noFill();
    stroke(0);
    strokeWeight(3);
    push();
    applyMatrix(this.matrix);
    box(len);
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].show();
    }
    pop();
  }
}