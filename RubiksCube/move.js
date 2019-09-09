class Move {

  constructor(omega, dir) {
    this.omega = omega;
    this.dir = dir;
    this.amimating = false;
    this.finished = true;
  }

  start() {
    this.animating = true;
    angle = 0;
    this.finished = false;
  }
  copy() {
    return new Move(this.omega, this.dir);
  }

  update() {
    if (this.animating) {
      angle += this.dir / abs(this.dir) * speed;
      if (abs(angle) > HALF_PI * abs(this.dir)) {
        angle = 0;
        this.animating = false;
        if (abs(this.omega[2]) > 0) {
          cube.turn(2,this.omega[2], this.dir);
        } else if (abs(this.omega[0]) > 0) {
          cube.turn(0,this.omega[0], this.dir);
        } else if (abs(this.omega[1]) > 0) {
          cube.turn(1,this.omega[1], this.dir);
        }
        this.finished = true;
      }
    }
  }
}