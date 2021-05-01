var mx = -0.7,
  my = 0.0;
var ex = 2.8,
  ey = 2.8;
var xmin, xmax, ymin, ymax;
var colorgradSlider, maxiterSlider;
var dragx, dragy;
var overscreen = false;
let cx, cy;
const RADIUS = Math.exp(100);
var action = true;
var rgb = [];
let maxiter = 60;
let colorgrad = 20;
let d = 0;
const a = 1 / Math.log(RADIUS);
const b = 1 / Math.log(2);


function setup() {
  canvas = createCanvas(600, 600);
  canvas.position(50, 50);
  pixelDensity(1);

}

function mousePressed() {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    dragx = map(mouseX, 0, width, xmin, xmax);
    dragy = map(mouseY, 0, height, ymax, ymin);
    overscreen = true;
  }

}

function mouseDragged() {
  if (overscreen) {
    mx -= map(mouseX, 0, width, xmin, xmax) - dragx;
    my -= map(mouseY, 0, height, ymax, ymin) - dragy;
    action = true;
  }

}

function mouseReleased() {
  if (overscreen) {
    overscreen = false;
    action = true;
  }
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

function draw() {
  mandel();
}

function setd() {
  d = 0;
  var c2 = cx * cx + cy * cy;
  if (256.0 * c2 * c2 - 96.0 * c2 + 32.0 * cx - 3.0 < 0.0) return;
  if (16.0 * (c2 + 2.0 * cx + 1.0) - 1.0 < 0.0) return;

  let xn = xsq = 0;
  let yn = ysq = 0;
  for (let n = 0; n < maxiter; ++n) {
    yn = 2 * yn * xn + cy;
    xn = xsq - ysq + cx;

    xsq = xn * xn;
    ysq = yn * yn;
    R = xsq + ysq;
    if (R > RADIUS) {
      d = Math.sqrt(n + 1 - b * log(a * log(R)));
      break;
    }
  }
}

function setrgb() {
  let farbe = [0, 0, 80, 200, 200, 200, 255, 150, 0, 0, 0, 80];
  let s = (d * 0.04 * colorgrad) % 3;
  var k = floor(s);
  if (d != 0)
    for (let l = 0; l < 3; l++)
      rgb[l] = farbe[3 * k + l] + (s - k) * (farbe[3 + 3 * k + l] - farbe[3 * k + l]);
  else
    for (let l = 0; l < 3; l++)
      rgb[l] = 0;
}

function mandel() {
  loadPixels();
  xm = ym = exh = 0;
  xmin = mx - ex / 2;
  xmax = xmin + ex;
  ymin = my - ey / 2;
  ymax = ymin + ey;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      cx = map(i, 0, width, xmin, xmax);
      cy = map(j, 0, height, ymax, ymin);
      for (let k = 0; k < 2; k++) {
        cxh = -2-6*cx-4*cx*cx+4*cy*cy;
        cy = -6*cy-8*cx*cy;
        cx = cxh;
      }
      setd();
      setrgb();
      var pix = (i + j * width) * 4;
      pixels[pix + 3] = 255;
      for (var l = 0; l < 3; l++)
        pixels[pix + l] = rgb[l];
    }
  }
  updatePixels();
}