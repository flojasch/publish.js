function preload() {
  img1 = loadImage('mercury.jpg');
  img2 = loadImage('earth.jpg');
  img3 = loadImage('sun.jpg');
  img3 = loadImage('mars.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

}

function draw() {
  background(0);
  ambientLight(50);
  directionalLight(200, 200, 200, -1, -1, -1);
  push();
  translate(0, 0, 0);
  texture(img1);
  noStroke();
  sphere(100,100,100);
  pop();
}