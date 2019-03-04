class Ball {
  constructor(x, y, rad = 10, vx = 0, vy = 0, red = 200, green = 0, blue = 0) {
    this.r = createVector(x, y);
    this.rad = rad;
    this.mass = rad * rad;
    this.v = createVector(vx, vy);
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  show() {
    fill(this.red, this.green, this.blue);
    ellipse(this.r.x, this.r.y, this.rad * 2, this.rad * 2);
  }

  static collision(o1, o2) {
    let r12 = p5.Vector.sub(o2.r, o1.r);

    if (r12.mag() < o1.rad + o2.rad) {
      r12.normalize();
      let v12 = p5.Vector.sub(o2.v, o1.v);
      let vm = Ball.meanvelocity(o1, o2);

      Ball.setDistance(r12, o1, o2);

      Ball.setNewvel(r12, v12, o2, o1, vm);

    }
  }
  static setNewvel(r12, v12, o2, o1, vm) {
    let tan = createVector(-r12.y, r12.x);
    tan.mult(tan.dot(v12));
    r12.mult(r12.dot(v12));
    let v = p5.Vector.sub(tan, r12);
    v.mult(o2.mass / (o1.mass + o2.mass));
    o1.v = p5.Vector.sub(vm, v);
    v.mult(o1.mass / o2.mass);
    o2.v = p5.Vector.add(vm, v);
  }

  static setDistance(r12, o1, o2) {
    let rd = r12.copy();
    rd.mult((o1.rad + o2.rad) * 0.5);
    let rm = p5.Vector.add(o2.r, o1.r);
    rm.mult(0.5);
    o1.r = p5.Vector.sub(rm, rd);
    o2.r = p5.Vector.add(rm, rd);
  }

  static meanvelocity(o1, o2) {
    o1.v.mult(o1.mass);
    o2.v.mult(o2.mass);
    let vm = p5.Vector.add(o1.v, o2.v);
    vm.div(o1.mass + o2.mass);
    return vm;
  }

  checkEdges() {
    if (this.r.y < 0 || this.r.y > height) {
      this.v.y *= -1;
      if (this.r.y < 0) {
        this.r.y = 0;
      }
      if (this.r.y > height) {
        this.r.y = height;
      }
    }
    if (this.r.x < 0 || this.r.x > width) {
      this.v.x *= -1;
      if (this.r.x < 0) {
        this.r.x = 0;
      }
      if (this.r.x > width) {
        this.r.x = width;
      }
    }
  }
  update() {
    this.r.add(this.v);
  }

}