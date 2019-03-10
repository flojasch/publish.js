var movers = [];
let slider;
let canvas;
let button;

function setup() {
  slider = createSlider(0,200,0,1);
  button =createButton('restart');
  //button.position(10,30);
  button.mousePressed(startMover);
  canvas = createCanvas(400+slider.value(), 400);
  canvas.position(20,20);
  background(255);
  startMover();
}

function startMover(){
  let vel=-0.005;
  movers=[];
  for (var i = 0; i < 40; i++) {
    movers.push(new Mover(vel));
    vel+=0.0005
  }
}

function draw() {
  canvas = createCanvas(400+slider.value(), 400);
  canvas.position(20,50);
  background(20, 150, 13);
  fill(210);
  noStroke();
  ellipse(height / 2, height / 2, height, height);
  ellipse(width - height / 2, height / 2, height, height);
  rect(height / 2, 0, width - height, height - 1);
  //stroke(0);
  //line(height / 2, 1, width - height/2, 1);
  //line(height / 2, height-1, width - height/2, height-1);

  for (var i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].checkEdges();
    movers[i].display();
  }
}

class Mover {
  constructor(vel) {
    this.location = createVector(0, height / 2);
    this.velocity = createVector(1, 1 + vel);
    this.velocity.normalize();
    this.velocity.mult(3);
  }

  update() {
    this.location.add(this.velocity);
  }

  updateVel(mittelpunkt){
    let radius = p5.Vector.sub(this.location, mittelpunkt);
    if (radius.mag() >= height / 2) {
      radius.normalize();
      let tan = createVector(-radius.y, radius.x);
      tan.mult(this.velocity.dot(tan));
      radius.mult(this.velocity.dot(radius));
      this.velocity = p5.Vector.sub(tan, radius);
    }
  }

  checkEdges() {
    if (this.location.x <= height / 2) {
      let mittelpunkt = createVector(height / 2, height / 2);
      this.updateVel(mittelpunkt);
    }
    else if (this.location.x >= width-height / 2) {
      let mittelpunkt = createVector(width-height / 2, height / 2);
      this.updateVel(mittelpunkt);
    }
    else if (this.location.y >= height || this.location.y <= 0) {
      this.velocity.y *= -1;
    }
  }

  display() {
    stroke(0);
    fill(9, 34, 229);
    ellipse(this.location.x, this.location.y, 16, 16);
  }

}
