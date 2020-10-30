let Arrows = [];
let yvalues = [];
let yeinfach = [];
let slider;
let breiteSlider;
let elemSlider;
let rangeSlider;
let elemnum;
let n;
let brightness = [];
let yoff;
let arrownum = 3;
let R;
let range;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 30, 3, 1);
  slider.position(50, 50);
  text = createP();
  text.position(50, 60);
  text.style('font-size', '130%');
  text.style('color', '#ffffff');
  breiteSlider = createSlider(2, 20, 1, 1);
  breiteSlider.position(250, 50);
  btext = createP();
  btext.position(250, 60);
  btext.style('font-size', '130%');
  btext.style('color', '#ffffff');
  elemSlider = createSlider(1, 50, 1, 1);
  elemSlider.position(450, 50);
  etext = createP();
  etext.position(450, 60);
  etext.style('font-size', '130%');
  etext.style('color', '#ffffff');
  text2 = createP();
  text2.position(50, 80);
  text2.style('font-size', '130%');
  text2.style('color', '#ffffff');
  rangeSlider = createSlider(1, 10, 5, 1);
  rangeSlider.position(850, 50);
  rtext=createP();
  rtext.position(850,60);
  rtext.style('font-size', '130%');
  rtext.style('color', '#ffffff');
  yoff = height - 100;
  reset();
}

function reset() {
  background(0);
  arrownum = slider.value();
  elemnum = elemSlider.value();
  n = breiteSlider.value();
  range=rangeSlider.value();
  R = 400 / (arrownum * elemnum);
  calcYs();
  Yeinfach();
}

function Yeinfach() {
  for (let i = 0; i < width; i++) {
    let x = 0;
    let y = 0;
    let alpha = 0;
    for (let j = 0; j < elemnum; j++) {
      alpha -= i / width * PI*range / ((n - 1) * elemnum);
      x += R * cos(alpha);
      y += R * sin(alpha);
    }
    yeinfach[i] = arrownum*sqrt(x * x + y * y);
  }
}

function calcYs() {
  for (let i = 0; i < width; i++) {
    let x = 0;
    let y = 0;
    let alpha = 0;

    for (let k = 0; k < arrownum; k++) {
      alpha -= i / width * PI*range;
      for (let j = 0; j < elemnum; j++) {
        alpha -= i / width * PI*range / ((n - 1) * elemnum);
        x += R * cos(alpha);
        y += R * sin(alpha);
      }
    }
    yvalues[i] = sqrt(x * x + y * y);
  }
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  if (arrownum != slider.value()) reset();
  if (n != breiteSlider.value()) reset();
  if (elemnum = elemSlider.value()) reset();
  if(range!=rangeSlider.value()) reset();
  text.html('Anzahl Spalte: ' + arrownum);
  btext.html('Spaltbreite: 1/' + n);
  etext.html('Anzahl Elementarwellen pro Spalt: ' + elemnum);
  rtext.html('Bereich von 0 bis '+range+' lambda');
  Arrows = [];
  background(0);
  
  for (let i = 0; i < mouseX; i++) {
    stroke(255, 0, 0);
    line(i, yoff, i, yoff - yvalues[i]);
    stroke(200, 200, 50);
    point(i,yoff-yeinfach[i]);
  }
  stroke(0, 0, 250);
  let x = mouseX;
  let y = yoff;
  let alpha = 0;
  for (let k = 0; k < arrownum; k++) {
    alpha -= mouseX / width * PI*range;
    for (let j = 0; j < elemnum; j++) {
      alpha -= mouseX / width * PI*range / ((n - 1) * elemnum);
      Arrows[elemnum * k + j] = new Arrow(x, y, alpha);
      x += R * cos(alpha);
      y += R * sin(alpha);
    }
  }
  let dx = x - mouseX;
  let dy = y - yoff;
  let r = sqrt(dx * dx + dy * dy);
  let beta = acos(dx / r);
  if (dy < 0) beta = TWO_PI - beta;
  translate(mouseX, yoff);
  rotate(-beta - PI / 2);
  translate(-mouseX, -yoff);
  for (let k = 0; k < Arrows.length; k++) {
    Arrows[k].show();
  }
}

class Arrow {
  constructor(xa, ya, alpha) {
    this.alpha = alpha;
    this.xa = xa;
    this.ya = ya;
  }

  show() {
    stroke(0, 255, 255);
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