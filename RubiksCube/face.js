class Face {
  
  constructor(normal, c) {
    this.normal = normal;
    this.c = c;
  }

  turnZ(angle) {
    let v2 = new p5.Vector();
    v2.x = round(this.normal.x * cos(angle) - this.normal.y * sin(angle));
    v2.y = round(this.normal.x * sin(angle) + this.normal.y * cos(angle));
    v2.z = round(this.normal.z);
    this.normal = v2;
  }

  turnY(angle) {
    let v2 = new p5.Vector();
    v2.x = round(this.normal.x * cos(angle) - this.normal.z * sin(angle));
    v2.z = round(this.normal.x * sin(angle) + this.normal.z * cos(angle));
    v2.y = round(this.normal.y);
    this.normal = v2;
  }

  turnX(angle) {
    let v2 = new p5.Vector();
    v2.y = round(this.normal.y * cos(angle) - this.normal.z * sin(angle));
    v2.z = round(this.normal.y * sin(angle) + this.normal.z * cos(angle));
    v2.x = round(this.normal.x);
    this.normal = v2;
  }

  show() {
    push();
    fill(this.c);
    noStroke();
    rectMode(CENTER);
    translate(0.5*len*this.normal.x, 0.5*len*this.normal.y, 0.5*len*this.normal.z);
    if (abs(this.normal.x) > 0) {
      rotateY(HALF_PI);
    } else if (abs(this.normal.y) > 0) {
      rotateX(HALF_PI);
    }
    square(0, 0, len);
    pop();
  }
}