
let slider;
let widthSlider;
let myshader;
let breite;
let lambda;

function preload() {
  myshader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(800, 800, WEBGL);
  lambslider = createSlider(1, 300, 100, 1);
  lambslider.position(50, 30);
  widthSlider = createSlider(1, width, width / 2, 1);
  widthSlider.position(50, 60);
  pixelDensity(1);
}

function draw() {
  lambda = lambslider.value();
  breite = widthSlider.value();
  let brightness = setBrightness();

  myshader.setUniform("u_resolution", [width, height]);
  myshader.setUniform("mouse", [mouseX / width, 1 - mouseY / height]);
  myshader.setUniform("lambda", lambda / width);
  myshader.setUniform("breite", breite / width);
  myshader.setUniform("brightness", brightness);
  shader(myshader);
  rect(0, 0, width, height);
}

function setBrightness() {
  let arrownum=500;
  let d = breite / arrownum;
  let x = 0;
  let y = 0;
  for (let k = 0; k < arrownum; k++) {
    let dx = width/2 - (d * k + (width - breite) / 2);
    let alpha = sqrt(height * height + dx * dx) / lambda * TWO_PI;
    x += cos(alpha);
    y += sin(alpha);
  }
  return 1./sqrt(x * x + y * y) ;
}
