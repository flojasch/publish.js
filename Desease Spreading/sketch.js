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
let resolution = 5;
let illdays = 2;
let healthy;
let ill;
let imun;
let t;
let p;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 30, 30, 1);
  slider.position(20, 10);
  rslider = createSlider(3, 50, 10, 1);
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
  //noStroke();
  frameRate(slider.value());
  if (pslider.value() != p) {
    p = pslider.value();
    reset();
  }
  
  if (rslider.value() != resolution) {
    resolution = rslider.value();
    reset();
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      let state = grid[i][j];
      if (state == 0) {
        fill(200);
      } else if (state < illdays && state > 0) {
        fill(255, 0, 0);
      } else if (state == illdays) {
        fill(100);
      }
      rect(x, y, resolution , resolution );

    }
  }
  imun = ill = healthy = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      if (state == 0) {
        healthy++;
      } else if (state < illdays - 1) {
        ill++;
      } else {
        imun++;
      }
      if (state == 0) {
        for (let ih = -1; ih < 2; ih++) {
          for (let jh = -1; jh < 2; jh++) {
            if (i + ih >= 0 && j + jh >= 0 && i + ih < cols && j + jh < rows && (ih == 0 || jh == 0)) {
              let nstate = grid[i + ih][j + jh];
              if (nstate > 0 && nstate < illdays) {
                if (Math.random() < p) {
                  next[i][j] = 1;
                }
              }
            }
          }
        }
      } else if (state < illdays - 1) {
        next[i][j] = state + 1;
      } else if (state == illdays - 1) {
        next[i][j] = state + 1;
      } else {
        next[i][j] = state;
      }
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