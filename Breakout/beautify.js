var bricks = [];

function setup() {
  createCanvas(480, 400);
  ball = new Ball();
  let y = 0;
  let x = 0;
  while (x < width) {
    bricks.push(new Brick(x, y));
    x += 40;
  }
}

function draw() {
  background(200);
  ball.checkEdges();
  ball.update();
  ball.show();
  for (let i = 0; i < bricks.length; i++) {
    bricks[i].show();
  }
}
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 20;
  }
  show() {
    fill(200, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  }
}
class Ball {
  constructor() {
    this.x = floor(random() * width);
    this.y = floor(random() * height);
    this.width = 30;
    this.height = 30;
    this.vx = 5;
    this.vy = -5;
  }
  show() {
    fill(250, 250, 0);
    ellipse(this.x, this.y, 30, 30);
  }
  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
  }
  checkEdges() {
    if (this.x > width || this.x < 0) {
      this.vx *= -1;
    }
    if (this.y > height || this.y < 0) {
      this.vy *= -1;
    }
  }
}