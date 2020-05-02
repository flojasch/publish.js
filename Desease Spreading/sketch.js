function make2DArray(cols, rows) {
  let arr = [];
  for (let i = 0; i < cols; i++) {
    arr[i] = [];
    for (let j = 0; j < rows; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

let grid;
let cols;
let rows;
let resolution=2;
let healthy;
let ill;
let imun;
let t;
let p;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 30, 30, 1);
  slider.position(20, 10);
  rslider = createSlider(2, 50, 2, 1);
  rslider.position(170, 10);
  pslider = createSlider(0, 1, 0.5, 0.01);
  pslider.position(320, 10);
  reset();
  textSize(20);
}

function reset() {
  cols = floor(width / resolution);
  rows = floor((height - 200) / resolution);
  grid = make2DArray(cols, rows);
  next = make2DArray(cols, rows);
  grid[floor(cols / 2)][floor(rows / 2)] = 1;
  t = 0;
  background(255);
}

function draw() {
  stroke(255);
  noStroke();
  frameRate(slider.value());
  if (pslider.value() != p) {
    p = pslider.value();
    reset();
  }
  if (rslider.value() != resolution) {
    resolution = rslider.value();
    reset();
  }
  imun = ill = healthy = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      if (state == 0) {
        healthy++;
        fill(200);
      } else if (state == 1) {
        ill++;
        fill(255, 0, 0);
        next[i][j] = 2;
        for (let ih = -1; ih < 2; ih++) {
          for (let jh = -1; jh < 2; jh++) {
            if (ih == 0 || jh == 0) {
              let ni=(i+ih+cols)%cols;
              let nj=(j+jh+rows)%rows;
              let nstate = grid[ni][nj];
              if (nstate == 0) {
                if (Math.random() < p) {
                  next[ni][nj] = 1;
                }
              }
            }
          }
        }
      } else if (state == 2) {
        fill(100);
        imun++;
      }
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = next[i][j];
    }
  }
  stroke(0);
  fill(0);
  text("p = " + p, 350, 40);

  noStroke();
  let b = 1;
  let scale = 200 / (cols * rows);
  translate(0, height);
  fill(255, 0, 0);
  rect(b * t, 0, b, -ill * scale);
  translate(0, -ill * scale);
  fill(200);
  rect(b * t, 0, b, -healthy * scale);
  translate(0, -healthy * scale);
  fill(100);
  rect(b * t, 0, b, -imun * scale);
  translate(0, -imun * scale);
  t++;
}