let healthy;
let ill;
let imun;
let t;
let r0 = 1.5;

function setup() {
  createCanvas(800, 500);
  r0slider = createSlider(0, 3, 1.5, 0.05);
  r0slider.position(50, height - 40);
  speedslider = createSlider(1, 30, 1, 1);
  speedslider.position(250, height - 40);
  tex = createP();
  tex.position(50, height-45);
  tex.style('font-size', '160%');
  tex.html("R0 = " + r0);
  reset();
}

function reset() {
  t = 0;
  background(201, 226, 235);
  ill = 0.0001;
  imun = 0;
  healthy = 1 - ill;
}

function draw() {
  frameRate(speedslider.value());
  if (r0slider.value() != r0) {
    r0 = r0slider.value();
    tex.html("R0 = " + r0);
  }
  ill = r0 * (1 - imun) * ill;
  healthy = 1 - imun - ill;

  

  noStroke();
  let b = 5;
  let h = height - 50;
  translate(0, h);
  fill(255, 0, 0);
  rect(b * t, 0, b, -ill * h);
  translate(0, -ill * h);
  fill(100);
  rect(b * t, 0, b, -imun * h);
  translate(0, -imun * h);
  fill(200);
  rect(b * t, 0, b, -healthy * h);
  imun += ill;
  t++;
  if (t > width / 5) reset();
}