let mx, my, ex, ey;
let xmin, xmax, ymin, ymax;
let colorgradSlider, maxiterSlider;
let dragx, dragy;
var overscreen = false;
let cx, cy;
let RADIUS = 1000;
var darr = [];
let tarr = [];
var action;
var rgb = [];
let maxiter;
let a = 1 / 50.0;
let b = 1 / Math.log(2);
let nu, R,
  phi = 0,
  phialt = 0,
  faktor = 0.9,
  c = 4 * (1 - faktor) / (2 - faktor),
  colorgrad;
let mbutton;
let mxneu = mx;
let myneu = my;
let ismini = false;

function setup() {
  canvas = createCanvas(600, 600);
  canvas.position(50, 50);
  pixelDensity(1);
  button = createButton('max Resolution');
  button.position(600, 10);
  button.mousePressed(setmaxres);
  mbutton = createButton('minimandel');
  mbutton.position(500, 10);
  mbutton.mousePressed(minimandel);
  rbutton = createButton('reset');
  rbutton.position(450, 10);
  rbutton.mousePressed(reset);
  colorgradSlider = createSlider(5, 100, 30, 1);
  colorgradSlider.position(50, 10);
  colortxt = createDiv('Color');
  colortxt.position(50, 30);
  maxiterSlider = createSlider(0, 1000, 50, 10);
  maxiterSlider.position(200, 10);
  itertxt = createDiv('Iterations');
  itertxt.position(200, 30);
  ctxt = createDiv('');
  ctxt.position(50, 650);
  selfrac = createSelect();
  selfrac.position(350, 10);
  selfrac.option('distance');
  selfrac.option('escape time');
  selfrac.option('angle');
  selfrac.changed(mySelectEvent);
  reset();
  for (let i = 0; i < width; i++) {
    darr[i] = [];
    tarr[i] = [];
    for (let j = 0; j < height; j++) {
      darr[i][j] = 0;
      tarr[i][j] = 1;
    }
  }
  colorgrad = colorgradSlider.value();
}

function setmaxres() {
  maxres = 1;
}

function reset() {
  maxres = 1;
  maxiter = 100;
  mx = -0.7;
  my = 0.0;
  ex = 2.8;
  ey = 2.8;
  action=false;
}

function mySelectEvent() {
  action = true;
  if (selfrac.value() == 'distance') RADIUS = 1000;
  if (selfrac.value() == 'escape time') {
    RADIUS = 16;
    a = 1 / log(RADIUS);
  }
  if (selfrac.value() == 'angle') {
    RADIUS = exp(50);
    a = 1 / 50;
  }
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
  if (ismini) {
    if (abs(mxneu - mx) + abs(myneu - my) > 0.06 * ex) {
      mx += (mxneu - mx) * 0.03;
      my += (myneu - my) * 0.03;
      action = true;
    } else {
      let black = 0;
      for (let i = 0; i < width; i += res)
        for (let j = 0; j < height; j += res) {
          if (darr[i][j] == 0) black++;
        }
      if (black * res * res / (width * height) > 0.1) {
        ismini = false;
        maxres = 1;
      } else {
        ex *= 0.85;
        ey = ex;
      }
    }
  }
  mandel();
}

function setd(i, j) {
  darr[i][j] = 0;
  var c2 = cx * cx + cy * cy;
  if (256.0 * c2 * c2 - 96.0 * c2 + 32.0 * cx - 3.0 < 0.0) return;
  if (16.0 * (c2 + 2.0 * cx + 1.0) - 1.0 < 0.0) return;

  if (selfrac.value() == 'distance') {
    let xn = xsq = dx = 0;
    let yn = ysq = dy = 0;
    for (let n = 0; n < maxiter; ++n) {
      dxh = dx;
      dx = 2 * (xn * dx - yn * dy) + 1;
      dy = 2 * (xn * dy + yn * dxh);
      yn = 2 * yn * xn + cy;
      xn = xsq - ysq + cx;

      xsq = xn * xn;
      ysq = yn * yn;
      R = xsq + ysq;
      if (R > RADIUS) {
        darr[i][j] = Math.sqrt(R / (dx * dx + dy * dy)) * Math.log(R);
        break;
      }
    }
  }
  if (selfrac.value() == 'escape time') {
    let x = 0,
      xx = 0,
      y = 0,
      yy = 0;
    for (n = 0; n < maxiter; n++) {
      y = 2 * x * y + cy;
      x = xx - yy + cx;
      yy = y * y;
      xx = x * x;
      R = xx + yy;
      if (R > RADIUS) {
        darr[i][j] = Math.sqrt(n + 1 - b * log(log(R)));
        break;
      }
    }
  }
  if (selfrac.value() == 'angle') {
    tarr[i][j] = 1;
    n = 1;
    phi = 0;

    x = xx = 0;
    y = yy = 0;

    while (n < maxiter) {
      phialt = phi;
      phi *= faktor;

      y = 2 * x * y + cy;
      x = xx - yy + cx;
      yy = y * y;
      xx = x * x;
      R = xx + yy;
      phi += 1 - abs(x) * x / R;
      if (R > RADIUS) {
        nu = b * log(a * log(R));
        darr[i][j] = sqrt(n + 1 - nu);
        t = (((1 - nu) * phi + nu * phialt) * c) % 2 * 2;
        if (t > 2) {
          t = 4 - t;
        }
        tarr[i][j] = t;
        break;
      }
      ++n;
    }
  }
}

function setrgb(i, j) {

  if (selfrac.value() == 'distance') {
    // let d=255;
    // if(darr[i][j]/ex < 0.05/colorgrad) d=0;
    let d = Math.pow(5 * darr[i][j] / ex, 5 / colorgrad);
    d = Math.min(1, d) * 255;
    for (let l = 0; l < 3; l++) {
      rgb[l] = d;
    }
  }
  if (selfrac.value() == 'escape time') {
    let farbe = [0, 0, 80, 200, 200, 200, 255, 150, 0, 0, 0, 80];
    let s = (darr[i][j] * 0.004 * colorgrad) % 3;
    var k = floor(s);
    if (darr[i][j] != 0)
      for (let l = 0; l < 3; l++)
        rgb[l] = farbe[3 * k + l] + (s - k) * (farbe[3 + 3 * k + l] - farbe[3 * k + l]);
    else
      for (let l = 0; l < 3; l++)
        rgb[l] = 0;
  }
  if (selfrac.value() == 'angle') {
    let farbe = [0, 0, 80, 200, 200, 200, 255, 150, 0, 0, 0, 80];
    let s = (darr[i][j] * 0.004 * colorgrad) % 3;
    let t = tarr[i][j];
    let k = floor(s);

    if (darr[i][j] != 0)
      for (var l = 0; l < 3; l++) {
        rgb[l] = farbe[3 * k + l] + (s - k) * (farbe[3 + 3 * k + l] - farbe[3 * k + l]);
        if (t < 1)
          rgb[l] = floor((255 + t * (rgb[l] - 255)));
        else
          rgb[l] = floor((2 - t) * rgb[l]);
      }
    else
      for (let l = 0; l < 3; l++)
        rgb[l] = 0;
  }
}

function mandel() {
  loadPixels();

  if (maxiter != maxiterSlider.value()) {
    maxiter = maxiterSlider.value();
    action = true;
  }
  xm = ym = exh = 0;
  xmin = mx - ex / 2;
  xmax = xmin + ex;
  ymin = my - ey / 2;
  ymax = ymin + ey;
  ctxt.html('ex=' + ex + '  c= ' + mx + ' + ' + my + '*I');

  if (action) {
    res = 16;
    maxres = 4;
    action = false;
  }

  if (res >= maxres) {
    for (let i = 0; i < width; i += res) {
      if (action) break;
      for (let j = 0; j < height; j += res) {
        cx = map(i, 0, width, xmin, xmax);
        cy = map(j, 0, height, ymax, ymin);
        setd(i, j);
        setrgb(i, j);
        for (let di = 0; di < res; di++) {
          for (let dj = 0; dj < res; dj++) {
            var pix = (i + di + (j + dj) * width) * 4;
            pixels[pix + 3] = 255;
            for (var l = 0; l < 3; l++)
              pixels[pix + l] = rgb[l];
          }
        }
      }
    }
    res /= 4;
  }

  if (colorgradSlider.value() != colorgrad) {
    colorgrad = colorgradSlider.value();
    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        setrgb(i, j);
        var pix = (i + j * width) * 4;
        pixels[pix + 3] = 255;
        for (var l = 0; l < 3; l++)
          pixels[pix + l] = rgb[l];
      }
    }
  }

  updatePixels();
}