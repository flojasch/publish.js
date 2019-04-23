class Move {
  
  constructor(x, y, z, dir) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dir = dir;
  }

  copy() {
    return new Move(this.x, this.y, this.z, this.dir);
  }

  reverse() {
    this.dir *= -1;
  }

  start() {
    animating = true;
    finished = false;
    this.angle = 0;
  }

  finished() {
    return finished;
  }

  update() {
    if (animating) {
      angle += this.dir * speed;
      if (abs(angle) > HALF_PI) {
        angle = 0;
        animating = false;
        finished = true;
        if (abs(this.z) > 0) {
          turnZ(this.z, this.dir);
        } else if (abs(this.x) > 0) {
          turnX(this.x, this.dir);
        } else if (abs(this.y) > 0) {
          turnY(this.y, this.dir);
        }
      }
    }
  }
}
