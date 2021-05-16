let RADIUS = 1000;
let Dx, Dy;
let dx, dy;
const maxiter = 200;
let s;
let N =2;
let rgb = [];
let ax = [];
let ay = [];
let bx = [];
let by = [];
let mx = -0.7,
  my = 0.9;
let ex = 2.8,
  ey = 2.8;
let xmin, xmax, ymin, ymax;
let action = true;
let b = 1 / Math.log(2);


function setup() {
  selorder = createSelect();
  selorder.position(500, 30);
  selorder.option('N=1');
  selorder.option('N=2');
  selorder.option('N=3');
  selorder.option('N=4');
  selorder.changed(mySelectEvent);
  canvas = createCanvas(500, 500);
  canvas.position(50, 50);
  pixelDensity(1);
}

function draw() {
  //background(255);
  if (action) {
    compare();
    //mandelborder();
  }
}

function mySelectEvent() {
  action=true;
  if(selorder.value()=='N=1') N=2;
  if(selorder.value()=='N=2') N=3;
  if(selorder.value()=='N=3') N=4;
  if(selorder.value()=='N=4') N=5;
}


function mousePressed() {
  dragx = map(mouseX, 0, width, xmin, xmax);
  dragy = map(mouseY, 0, height, ymax, ymin);
}

function mouseDragged() {
  mx -= map(mouseX, 0, width, xmin, xmax) - dragx;
  my -= map(mouseY, 0, height, ymax, ymin) - dragy;
  action = true;


}

function mouseReleased() {
  action = true;
}

function mouseWheel(event) {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    var zoom = 1.15;
    if (event.delta < 0) {
      zoom = 0.85;
    }

    var ix = map(mouseX, 0, width, xmin, xmax);
    var iy = map(mouseY, 0, height, ymax, ymin);

    ex *= zoom;
    ey *= zoom;

    mx = ix - (ix - mx) * zoom;
    my = iy - (iy - my) * zoom;
    action = true;
  }
  return false;
}

function setbk(cx, cy) {
  let ax2, ay2, xh, yh, r;
  let n;

  for (let k = 0; k < N; ++k)
    ax[k] = ay[k] = 0;

  for (n = 0; n < maxiter; n++) {
    for (let k = N - 1; k >= 0; k--) {
      xh = 0;
      yh = 0;
      for (let l = 0; l <= k; ++l) {
        xh += ax[l] * ax[k - l] - ay[l] * ay[k - l];
        yh += ax[l] * ay[k - l] + ax[k - l] * ay[l];
      }
      ax[k] = xh;
      ay[k] = yh;
    }
    ax[1] += 1;
    ax[0] += cx;
    ay[0] += cy;
    r = ax[0] * ax[0] + ay[0] * ay[0];

    if (r > RADIUS)
      break;
  }
  for (let k = 1; k < N; ++k) {
    xh = ax[k];
    ax[k] = (ax[k] * ax[0] + ay[k] * ay[0]) / r;
    ay[k] = (ay[k] * ax[0] - xh * ay[0]) / r;
  }
  bx[1] = ax[1];
  by[1] = ay[1];

  ax2 = ax[1] * ax[1] - ay[1] * ay[1];
  ay2 = 2 * ax[1] * ay[1];

  bx[2] = ax[2] - 0.5 * ax2;
  by[2] = ay[2] - 0.5 * ay2;


  bx[3] = ax[3] - (ax[1] * ax[2] - ay[1] * ay[2]) + (ax[1] * ax2 - ay[1] * ay2) / 3;
  by[3] = ay[3] - (ax[1] * ay[2] + ax[2] * ay[1]) + (ax[1] * ay2 + ay[1] * ax2) / 3;

  bx[4] = ax[4] - (ax[1] * ax[3] - ay[1] * ay[3]) - 0.5 * (ax[2] * ax[2] - ay[2] * ay[2]) +
    (ax[2] * ax2 - ay[2] * ay2) - 0.25 * (ax2 * ax2 - ay2 * ay2);
  by[4] = ay[4] - (ax[1] * ay[3] + ax[3] * ay[1]) - ax[2] * ay[2] + (ax[2] * ay2 + ay[2] * ax2) - 0.5 * ax2 * ay2;

  let norm = pow(2, n);
  bx[0] = 0.5 * log(r) / norm;

  for (let k = 1; k < N; k++) {
    bx[k] = bx[k] / norm;
    by[k] = by[k] / norm;
    //  console.log(bx[k],by[k]);
  }
}

function pertcalc() {
  let yh = 0;
  let x = 0;
  let y = 0;
  for (let k = N - 1; k > 0; --k) {
    x += bx[k];
    y += by[k];
    yh = y;
    y = y * dx + x * dy;
    x = x * dx - yh * dy;
  }
  s = bx[0] + x;
}

function compare() {
  loadPixels();
  xmin = mx - ex / 2;
  xmax = xmin + ex;
  ymin = my - ey / 2;
  ymax = ymin + ey;

  setbk(mx, my);
  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; i++) {
      dx = map(i, 0, width, -ex / 2, ex / 2);
      dy = map(j, 0, height, ey / 2, -ey / 2);
      let bb = bx[0] / sqrt(bx[1] * bx[1] + by[1] * by[1]);
      let rr = sqrt(dx * dx + dy * dy);
      if (rr < bb) {
        pertcalc();
      } else {
        mandelbrot();
      }
      setcolor();

      let pix = (i + j * width) * 4;
      pixels[pix + 3] = 255;
      for (var l = 0; l < 3; l++)
        pixels[pix + l] = rgb[l];

      if (rr > bb && rr < bb + 0.002 * ex)
        for (var l = 0; l < 3; l++)
          pixels[pix + l] = 0;
    }
  }
  updatePixels();
  action = false;
}

function setcolor() {
  let farbe = [0, 0, 80, 200, 200, 200, 255, 150, 0, 0, 0, 80];
  if (s == 0)
    for (let l = 0; l < 3; l++)
      rgb[l] = 0;
  else {
    s = sqrt(1 - b * log(s));
    s = (s * 2) % 3;
    let k = floor(s);
    for (let l = 0; l < 3; l++)
      rgb[l] = farbe[3 * k + l] + (s - k) * (farbe[3 + 3 * k + l] - farbe[3 * k + l]);
  }
}

function mandelbrot() {
  let x, y, xx, yy, R;
  let n;
  s = x = y = xx = yy = 0;

  for (n = 0; n < maxiter; n++) {
    y = 2 * x * y + dy + my;
    x = xx - yy + dx + mx;
    xx = x * x;
    yy = y * y;
    R = xx + yy;
    if (R > RADIUS) {
      s = 0.5 * log(R) / pow(2, n);
      break;
    }
  }
}