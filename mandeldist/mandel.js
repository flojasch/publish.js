var mx = -0.7,
  my = 0.0;
var ex = 2.8,
  ey = 2.8;
var xmin, xmax, ymin, ymax;
var colorgradSlider, maxiterSlider;
var dragx, dragy;
var overscreen = false;
var cx, cy;
const RADIUS = 1000;
var darr=[];
var action=true;

function setup() {
  canvas = createCanvas(500, 500);
  canvas.position(50, 50);
  pixelDensity(1);
  colorgradSlider = createSlider(5, 100, 50, 1);
  colorgradSlider.position(50, 550);
  var colortxt = createDiv('Color');
  colortxt.position(50, 570);
  maxiterSlider = createSlider(0, 300, 50);
  maxiterSlider.position(350, 550);
  var itertxt = createDiv('Iterations');
  itertxt.position(350, 570);
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
  }
}

function mouseReleased() {
  if (overscreen) {
    overscreen = false;
    action=true;
  }
}

function mouseWheel(event) {
  var zoom = 1.125;
  if (event.delta < 0) {
    zoom = 0.8;
  }

  var ix = map(mouseX, 0, width, xmin, xmax);
  var iy = map(mouseY, 0, height, ymax, ymin);

  ex *= zoom;
  ey *= zoom;

  mx = ix - (ix - mx) * zoom;
  my = iy - (iy - my) * zoom;
  action=true;
}

function draw() {
  mandel();
}

function mandeldist() {
  var maxiter = maxiterSlider.value();
  var c2 = cx * cx + cy * cy;
  if (256.0 * c2 * c2 - 96.0 * c2 + 32.0 * cx - 3.0 < 0.0) return 0.0;
  if (16.0 * (c2 + 2.0 * cx + 1.0) - 1.0 < 0.0) return 0.0;
  var xn = xsq = dx = 0;
  var yn = ysq = dy = 0;

  for (n = 0; n < maxiter; ++n) {
    dxh = dx;
    dx = 2 * (xn * dx - yn * dy) + 1;
    dy = 2 * (xn * dy + yn * dxh);
    yn = 2 * yn * xn + cy;
    xn = xsq - ysq + cx;

    xsq = xn * xn;
    ysq = yn * yn;
    R = xsq + ysq;
    if (R > RADIUS) return Math.sqrt(R / (dx * dx + dy * dy)) * Math.log(R);
  }
  return 0.0;
}

function mandel() {
  loadPixels();
  var colorgrad = colorgradSlider.value();
  xm = ym = exh = 0;
  xmin = mx - ex / 2;
  xmax = xmin + ex;
  ymin = my - ey / 2;
  ymax = ymin + ey;


  if (action) {
    action=false;
    for (var i = 0; i < width; i++) {
      darr[i]=[];
      for (var j = 0; j < height; j++) {
        cx = map(i, 0, width, xmin, xmax);
        cy = map(j, 0, height, ymax, ymin);
        var d = mandeldist();
        darr[i][j]=d;
        d = Math.pow(8.  * colorgrad / 10* d / ex, 0.2);
        d = Math.min(1, d) * 255;
        var pix = (i + j * width) * 4;
        pixels[pix + 3] = 255;
        for (var l = 0; l < 3; l++)
          pixels[pix + l] = d;
      }
    }
  } else{
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        d = Math.pow(8. * colorgrad / 10 * darr[i][j] / ex, 0.2);
        d = Math.min(1, d) * 255;
        var pix = (i + j * width) * 4;
        pixels[pix + 3] = 255;
        for (var l = 0; l < 3; l++)
          pixels[pix + l] = d;
      }
    }
  }
  updatePixels();
  // text("Iterations", maxiterSlider.x * 2 + maxiterSlider.width, 495);
  // text("Color", colorgradSlider.x * 2 + colorgradSlider.width, 465);
}