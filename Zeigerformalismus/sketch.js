let Arrows=[];
let R = 500;
let slider;
let lambda=200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 300, 50, 1);
  slider.position(100,50);
  lambslider=createSlider(1,300,100,1);
  lambslider.position(100,100)
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  arrownum = slider.value();
  lambda=lambslider.value();
  
  Arrows=[];
  background(0);
  line(100,110,100+lambda,110);
  let d = width / (2*arrownum);
  R=1000/arrownum;
  let x = mouseX;
  let y = mouseY;
  for (let k = 0; k < arrownum; k++) {
    let dx = mouseX - (d * k+width/4);
    let alpha = sqrt(mouseY * mouseY + dx * dx) /lambda * TWO_PI;
    Arrows[k] = new Arrow(x, y, alpha);
    Arrows[k].show();
    stroke(255,255,255,100);
    line(d*k+width/4,0,x,y);
    x += R*cos(alpha);
    y += R*sin(alpha);
  }
  stroke(255,0,0);
  line(mouseX,mouseY,x,y);
}

class Arrow {
  constructor(xa, ya, alpha) {
    this.alpha = alpha;
    this.xa = xa;
    this.ya = ya;
  }

  show() {
    stroke(0,255,255);
    push();
    translate(this.xa, this.ya);
    noFill();
    rotate(this.alpha);
    line(0, 0, R, 0);
    translate(R, 0);
    beginShape();
    vertex(-4, -1.5);
    vertex(0, 0);
    vertex(-4, 1.5);
    endShape(CLOSE);
    pop();
  }
}