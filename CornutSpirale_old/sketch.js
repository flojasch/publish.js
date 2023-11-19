let Arrows = [];
let slider;
let widthSlider;
let lambda = 200;
let brightness = [];
let settingPixel=false;
let myshader;

function preload(){
  myshader=loadShader('shader.vert','shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
  slider = createSlider(1, 300, 50, 1);
  slider.position(50, 50);
  lambslider = createSlider(1, 300, 100, 1);
  lambslider.position(50, 100);
  widthSlider = createSlider(1, width, width / 2, 1);
  widthSlider.position(50, 150);
  button=createButton("calcLight");
  button.position(50,200);
  button.mousePressed(setBrightness);
  pixelDensity(1);
}

function setBrightness() {
  let d = breite / arrownum;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let x=0;
      let y=0;
      for (let k = 0; k < arrownum; k++) {
        let dx = i - (d * k + (width - breite) / 2);
        let alpha = sqrt(j * j + dx * dx) / lambda * TWO_PI;
        x += cos(alpha);
        y += sin(alpha);
      }
      brightness[i + j*width]= min(255*(x * x + y * y)/arrownum**2,255);
    }
  }
  settingPixel=true;
}

function setPixel() {
  loadPixels();
  for (let k = 0; k < width *height; k++) {
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

  myshader.setUniform("u_resolution", [width, height]);
  myshader.setUniform("mouse",[mouseX/width,1-mouseY/height]);
  myshader.setUniform("lambda", lambda/width); 
  myshader.setUniform("breite",breite/width);
  shader(myshader);
  rect(0,0,width,height);
  
  //background(0);
  if(settingPixel) setPixel();
  stroke(0, 0, 250);
  line(50, 120, 50 + lambda, 120);
  let d = breite / arrownum;
  let R = 1000 / arrownum;
  let x = mouseX;
  let y = mouseY;
  for (let k = 0; k < arrownum; k++) {
    let dx = mouseX - (d * k + (width - breite) / 2);
    let alpha = sqrt(mouseY * mouseY + dx * dx) / lambda * TWO_PI;
    Arrows[k] = new Arrow(x, y, alpha);
    Arrows[k].show();
    stroke(255, 255, 255, 100);
    //line(d * k + (width - breite) / 2, 0, x, y);
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
    let R=1000/arrownum;
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