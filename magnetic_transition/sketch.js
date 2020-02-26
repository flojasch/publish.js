let slider;
let mag = [];
let scl = 1;
let cols;
let rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  const tc=0.5*log(1+sqrt(2));
  slider = createSlider(0, 2, tc, 0.001);
  slider.position(50, 50);
  cols = floor(width / scl);
  rows = floor(height / scl)

  for (let j = 0; j < rows; j++) {
    mag[j] = [];
    for (let i = 0; i < cols; i++) {
      mag[j][i] = random([-1, 1]);
    }
  }
  noStroke();
}

function draw() {
  background(0);
  let beta = slider.value();

  let b = exp(-2*beta);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      left = (i + 1) % cols;
      right = (i - 1 + cols) % cols;
      down = (j + 1) % rows;
      up = (j - 1 + rows) % rows;
      sum = mag[up][i] + mag[down][i] + mag[j][left] + mag[j][right];
      if (Math.random() < 1 / (1 + Math.pow(b, sum))) {
        mag[j][i] = 1;
        stroke(200);
      } else {
        mag[j][i] = -1;
        stroke(50);
      }
      // rect(i * scl, j * scl, scl, scl);
      // fill(255);
      // rect(50,60,50,30);
      // textSize(30);
      // text("beta", 50, 60);
      point(i,j);
    }
  }
}