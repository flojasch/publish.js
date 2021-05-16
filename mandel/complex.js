class Complex {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sqr(c) {
    let xx = this.x * this.x;
    let yy = this.y * this.y;
    this.y = this.x * this.y * 2 + c.y;
    this.x = xx - yy + c.x;
    return xx + yy;
  }
  set(z) {
    this.x = z.x;
    this.y = z.y;
  }
  add(z) {
    if (z instanceof Complex) {
      this.x += z.x;
      this.y += z.y;
    } else {
      this.x += z;
    }
  }
  sub(z) {
    if (z instanceof Complex) {
      this.x -= z.x;
      this.y -= z.y;
    } else {
      this.x -= z;
    }
  }
  mult(z) {
    if (z instanceof Complex) {
      let xh = this.x;
      this.x = this.x * z.x - this.y * z.y;
      this.y = this.y * z.x + xh * z.y;
    } else {
      this.x *= z;
      this.y *= z;
    }
  }
  div(z) {
    if (z instanceof Complex) {
      let xh = this.x;
      let r = z.x ** 2 + z.y ** 2;
      this.x = (this.x * z.x + this.y * z.y) / r;
      this.y = (this.y * z.x - xh * z.y) / r;
    } else {
      this.x /= z;
      this.y /= z;
    }
  }

  static add(z1, z2) {
    let rx = z1.x + z2.x;
    let ry = z1.y + z2.y;
    return new Complex(rx, ry);
  }

  static mult(z1, z2) {
    let rx = z1.x * z2.x - z1.y * z2.y;
    let ry = z1.y * z2.x + z1.x * z2.y;
    return new Complex(rx, ry);
  }
  static abs(z) {
    return sqrt(z.x ** 2 + z.y ** 2);
  }

  static absq(z) {
    return z.x ** 2 + z.y ** 2;
  }
}