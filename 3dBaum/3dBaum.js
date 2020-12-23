let gen;
let slider;
let angle;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  slider = createSlider(0, PI / 2, PI/3, 0.01);
  slider.position(50,50);
  gen = 0;
}

function mousePressed() {
  if(mouseY > 100)
  gen++;
}

function draw() {
  background(100);
  directionalLight(250, 250, 250, -1, -1, -0.5);
  ambientLight(100, 100, 100);
  noStroke();
  angle = slider.value();
  translate(0,height/2,0);
  rotateY(frameCount*0.01);
  baum(height / 3,20,1,0);
}

function baum(h,b,f,g) {
  fill(114+f*(130-114),181 +f*(69-181),38 +f*(4-38));
  translate(0,-h/2,0);
  cylinder(b,h);
  if (g >= gen) {
    return;
  }
  translate(0,-h/2,0);
  h *=0.67;
  b *=0.9;
  f *=0.9;
  g+=1;
  push();
  rotateZ(angle);
  baum(h,b,f,g);
  pop();

  push();
  rotateY(TWO_PI/3)
  rotateZ(angle);
  baum(h,b,f,g);
  pop();

  push();
  rotateY(PI/3);
  rotateZ(-angle);
  baum(h,b,f,g);
  pop();
}