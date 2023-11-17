let Arrows = [];
let R = 500;
let slider;
let widthSlider;
let lambda = 200;
let brightness = [];
let pd;
let settingPixel=false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 300, 50, 1);
  slider.position(50, 50);
  lambslider = createSlider(1, 300, 100, 1);
  lambslider.position(50, 100);
  widthSlider = createSlider(1, width, width / 2, 1);
  widthSlider.position(50, 150);
  button=createButton("calcLight");
  button.position(50,200);
  button.mousePressed(setBrightness);
  pd=pixelDensity();
}

function setBrightness() {
  arrownum = slider.value();
  lambda = lambslider.value();
  breite = widthSlider.value();

  let d = breite / arrownum;
  R = 1000 / arrownum;
  let w=width;
  let h=height;
  let maxValue=0;

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      let x=i;
      let y=j;
      for (let k = 0; k < arrownum; k++) {
        let dx = i - (d * k + (w - breite) / 2);
        let alpha = sqrt(j * j + dx * dx) / lambda * TWO_PI;
        x += R * cos(alpha);
        y += R * sin(alpha);
      }
      let dx = i - x;
      let dy = j - y;
      let value= dx * dx + dy * dy;
      if(value>maxValue) maxValue=value;
      for (let di = 0; di < pd; di++) 
        for (let dj = 0; dj < pd; dj++)  
          brightness[i*pd+di + (dj+j*pd)*w*pd] = value;
    }
  }

  for (let i = 0; i < w*h*pd*pd; i++) {
      brightness[i] *= 255/maxValue;
  }
  settingPixel=true;
}

function setPixel() {
  loadPixels();
  for (let k = 0; k < width *pd* height*pd; k++) {
    pixels[k * 4] = brightness[k];
    pixels[k * 4 + 1] = 0;
    pixels[k * 4 + 2] = 0;
    pixels[k * 4 + 3] = 255;
  }
  updatePixels();
}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  arrownum = slider.value();
  lambda = lambslider.value();
  breite = widthSlider.value();

  Arrows = [];
  background(0);
  if(settingPixel) setPixel();
  stroke(0, 0, 250);
  line(50, 120, 50 + lambda, 120);
  let d = breite / arrownum;
  R = 1000 / arrownum;
  let x = mouseX;
  let y = mouseY;
  for (let k = 0; k < arrownum; k++) {
    let dx = mouseX - (d * k + (width - breite) / 2);
    let alpha = sqrt(mouseY * mouseY + dx * dx) / lambda * TWO_PI;
    Arrows[k] = new Arrow(x, y, alpha);
    Arrows[k].show();
    stroke(255, 255, 255, 100);
    line(d * k + (width - breite) / 2, 0, x, y);
    x += R * cos(alpha);
    y += R * sin(alpha);
  }
  stroke(255, 0, 0);
  line(mouseX, mouseY, x, y);
  
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