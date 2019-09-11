let slider;
let button;
let update = true;
let R = 50;
let rArrows = [];
let lArrows = [];
let alpha;
let showheights = false;
let w;
let alphag = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 0.1, 0.05, 0.001);
  slider.position(250, 50);
  button = createButton('start/stop');
  button.position(50, 50);
  button.mousePressed(onoff);
  button2 = createButton('show heights');
  button2.position(150, 50);
  button2.mousePressed(showHeights);
  let alpha = 0;
  for (let x = 0; x < width; x += 50) {
    alpha += PI / 10;
    rArrows.push(new Arrow(x, 200, alpha));
    lArrows.push(new Arrow(x, 400, -alpha));
    // arrows.push(new Arrow(x, 600, alpha));
    // arrows.push(new Arrow(x + R*cos(alpha),600+R*sin(alpha),-alpha));
  }

}

function showHeights() {
  showheights = !showheights;
}

function onoff() {
  update = !update;
}

function draw() {
  background(0);
  w = slider.value();
  if (update) {
    alphag += w;
  }
  for (let k = 0; k < rArrows.length; k++) {
    rArrows[k].show();
    lArrows[k].show();
  }
  translate(0, 400);
  for (let k = 0; k < rArrows.length; k++) {
    showh = showheights;
    showheights = false;
    rArrows[k].show();
    push();
    let phi = rArrows[k].alpha + alphag;
    translate(R * cos(phi), R * sin(phi) - 200);
    lArrows[k].show();
    pop();
    showheights = showh;
    if (showheights) {
      fill(255,0,0);
      let phi1 = rArrows[k].alpha + alphag;
      let phi2 = lArrows[k].alpha + alphag;
      let x=rArrows[k].tx;
      let y=rArrows[k].ty;
      circle(x,y+ R * sin(phi1) + R * sin(phi2),5);
      line(x,y+R*sin(phi1)+R*sin(phi2),x,y);
      line(x+R*cos(phi1)+R*cos(phi2),y+R*sin(phi1)+R*sin(phi2),x,y+R*sin(phi1)+R*sin(phi2));
    }
  }
}

class Arrow {
  constructor(tx, ty, alpha) {
    this.alpha = alpha;
    this.tx = tx;
    this.ty = ty;
  }

  show() {

    stroke(255);
    push();
    translate(this.tx, this.ty);
    fill(255, 0, 0);
    let alpha = this.alpha + alphag;
    if (showheights) {
      circle(0, R * sin(alpha), 5);
      line(0, R * sin(alpha), R * cos(alpha), R * sin(alpha));
      line(0, R * sin(alpha), 0, 0);
    }
    fill(0, 255, 0);
    rotate(alpha);
    line(0, 0, R, 0);
    translate(R, 0);
    beginShape();
    vertex(-7, -3);
    vertex(0, 0);
    vertex(-7, 3);
    endShape(CLOSE);
    pop();
  }
}