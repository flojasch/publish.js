class Face {
  
  constructor(x,y,z, c) {
    this.x=x;
    this.y=y;
    this.z=z;
    this.c = c;
  }

  copy(){
    return new Face(this.x,this.y,this.z,this.c);
  }

  turnZ(angle) {
    let xh=this.x;
    this.x = round(this.x * cos(angle) - this.y * sin(angle));
    this.y = round(xh * sin(angle) + this.y * cos(angle));
  }

  turnY(angle) {
    let xh=this.x;
    this.x = round(this.x * cos(angle) + this.z * sin(angle));
    this.z = round(-xh * sin(angle) + this.z * cos(angle));
  }

  turnX(angle) {
    let yh=this.y;
    this.y = round(this.y * cos(angle) - this.z * sin(angle));
    this.z = round(yh * sin(angle) + this.z * cos(angle));
  }

  show() {
    push();
    fill(this.c);
    noStroke();
    rectMode(CENTER);
    translate(0.5*len*this.x, 0.5*len*this.y, 0.5*len*this.z);
    if (abs(this.x) > 0) {
      rotateY(HALF_PI);
    } else if (abs(this.y) > 0) {
      rotateX(HALF_PI);
    } 
    square(0, 0, len);
    pop();
  }
}