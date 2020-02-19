let slider;
let d = [];
let resolution = 2;
let L;

function setup() {
  createCanvas(1000, 1000);
  slider = createSlider(0, 1, 0.5, 0.001);
  L = width / resolution;
  for (let i = 0; i < L; i++) {
    d[i] = [];
    for (let j = 0; j < L; j++) {
      d[i][j] = random([-1, 1]);
    }
  }
  noStroke();
}

function draw() {
  background(0);
  let beta = slider.value();
  let b = exp(-beta);

  for (let i = 0; i < L; i++) {
    for (let j = 0; j < L; j++) {
      m = (j + 1)%(L + 1);
      n = (L + i)%(L + 1);
      p = (L + j)%(L + 1);
      q = (i + 1)%(L + 1);
      nachbarn = d[i][p] + d[i][m] + d[n][j] + d[q][j];
      if (Math.random() < 1 / (1 + Math.pow(b, sum))) {
        d[i][j] = 1;
        fill(255, 0, 0);
      } else {
        d[i][j] = -1;
        fill(0, 255, 0);
      }
      rect(i * resolution, j * resolution, resolution, resolution);
      // point(i,j);
    }
  }
}