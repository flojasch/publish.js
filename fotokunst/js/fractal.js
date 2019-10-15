var pix = [];
var impix = [];
var iterations;
var dilatx = [];
var dilaty = [];
var angle = [];
var tx = [];
var ty = [];
var farb = [];
var eck = [];
var tnum = 0;
var abbnum;
var showsquares = true;
var locked = false;
var xOffset, yOffset, txoff, tyoff;
var breite;
var xversch, yversch;
var maxiterSlider;
var saveButton;
var lines;
var img1, img2;
var filenumber;
var mouseAction='drehen';

function preload() {
  lines = loadStrings('Baum.txt');
}

function setup() {
  canvas = createCanvas(500, 500);
  canvas.position(300, 50);
  canvas.drop(gotFile);

  pixelDensity(1);
  background(200);
  createDiv('Drop file here').position(500, 300);
  maxiterSlider = createSlider(0, 50, 0);
  maxiterSlider.position(20, 100);
  var itertxt = createDiv('Wiederholungen');
  itertxt.position(20, 80);

  saveButton = createButton('Bild speichern');
  saveButton.position(20, 450);
  saveButton.mousePressed(Save);

  loadValues(lines);

  createButton('save data')
    .position(10, 10)
    .mousePressed(function() {
      var list = [];
      list.push(breite + ' ' + xversch + ' ' + yversch + ' ' + colorgrad);
      for (i = 0; i < abbnum; ++i)
        list.push(angle[i] + ' ' + dilatx[i] + ' ' + dilaty[i] + ' ' + tx[i] + ' ' + ty[i] + ' ' + farb[i]);
      saveStrings(list, 'data.txt');
    });

  iterations = 0;
  filenumber = 0;
}

function Save() {
  save('baumbild.jpg');
}

// Set a background style to gray
function highlight() {
  background(20);
  return false;
}
// Set it back to nothing
function unHighlight() {
  background(50);
  return false;
}

function gotFile(file) {
  if (filenumber == 0) {
    img1 = createImg(file.data);
    img1.hide();
    canvas.remove();
    if (img1.height < img1.width)
      canvas = createCanvas(1000, img1.height * 1000.0 / img1.width);
    else
      canvas = createCanvas(500, img1.height * 500.0 / img1.width);
    canvas.position(300, 50);
    canvas.drop(gotFile);
    pixelDensity(1);
    image(img1, 0, 0, width, height);
    filenumber = 1;
  }
  if (filenumber == 1) {
    img2 = createImg(file.data);
    img2.hide();
    image(img2, 0, 0, width, height);
    loadPixels();
    for (j = 0; j < 4 * width * height; j++) impix[j] = pix[j] = pixels[j];
    image(img1, 0, 0, width, height);

  }
  iterations = 0;
  return false;
}

function loadValues(lines) {
  for (var i = 0; i < lines.length; i++) {
    if (i == 0) {
      breite = float(split(lines[i], ' '))[0];
      xversch = float(split(lines[i], ' '))[1];
      yversch = float(split(lines[i], ' '))[2];
      colorgrad = float(split(lines[i], ' '))[3];
    } else {
      angle[i - 1] = float(split(lines[i], ' '))[0];
      dilatx[i - 1] = float(split(lines[i], ' '))[1];
      dilaty[i - 1] = float(split(lines[i], ' '))[2];
      tx[i - 1] = float(split(lines[i], ' '))[3];
      ty[i - 1] = float(split(lines[i], ' '))[4];
      farb[i - 1] = float(split(lines[i], ' '))[5];
    }
  }
  abbnum = lines.length - 1;

}

function addTransform() {
  abbnum += 1;
  tnum = abbnum - 1;
  angle[tnum] = 0;
  dilatx[tnum] = 0.5;
  dilaty[tnum] = 0.5;
  tx[tnum] = 0;
  ty[tnum] = 0;
  farb[tnum] = 0;
  maxiter = 1;
  reset();
}

function rmTransform() {
  if (abbnum > 0) {
    angle[tnum] = angle[abbnum - 1];
    dilatx[tnum] = dilatx[abbnum - 1];
    dilaty[tnum] = dilaty[abbnum - 1];
    tx[tnum] = tx[abbnum - 1];
    ty[tnum] = ty[abbnum - 1];
    farb[tnum] = farb[abbnum - 1];
    abbnum -= 1;
  }
  reset();
}


function mouseWheel(event) {

  var zoom = 1.05;
  if (event.delta < 0) {
    zoom = 0.95;
  }

  if (mouseAction == 'vergrößern') {
    dilatx[tnum] *= zoom;
    dilaty[tnum] *= zoom;
  } else if (mouseAction == 'strecken') {
    dilatx[tnum] *= zoom;
  } else if (mouseAction == 'drehen') {
    angle[tnum] += (zoom - 1) * 20;
  } else {
    dilatx[tnum] *= zoom;
    dilaty[tnum] *= zoom;
  }
  reset();
  return false;
}

function mousePressed() {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    xOffset = mouseX;
    yOffset = mouseY;
    txoff = tx[tnum];
    tyoff = ty[tnum];
    locked = true;
  }
}

function mouseDragged() {
  if (locked) {
    tx[tnum] = txoff + (mouseX - xOffset) * breite / width;
    ty[tnum] = tyoff - (mouseY - yOffset) * breite / width;
    reset();
  }
}

function mouseReleased() {
  if (locked) {
    locked = false;
    reset();
  }
}

function draw() {
  var x, y, dist, disti, i;
  var maxiter = maxiterSlider.value();
  var j = height / 2 * width + width / 2;


  if (!locked) {
    i = tnum;
    x = transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i]) % width;
    y = transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i]) / width;
    dist = (mouseX - x) * (mouseX - x) + (mouseY - y) * (mouseY - y);
    for (i = 0; i < abbnum; i++) {
      x = transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i]) % width;
      y = transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i]) / width;
      disti = (mouseX - x) * (mouseX - x) + (mouseY - y) * (mouseY - y);
      if (disti < dist) {
        tnum = i;
        dist = disti;
      }
    }
  }

  if (iterations < maxiter) {
    iterations++;
    abbildung();
  }

  drawpix();

}

function reset() {
  for (j = 0; j < 4 * width * height; j++)
    pix[j] = impix[j];
  image(img1, 0, 0, width, height);
  iterations = 0;
}

function drawpix() {
  loadPixels();
  for (j = 0; j < width * height; j++) {
    var color = pix[4 * j + 1] + pix[4 * j + 2] + pix[4 * j + 3];
    for (l = 0; l < 4; l++)
      if (color < 735)
        pixels[4 * j + l] = pix[4 * j + l];
  }
  updatePixels();
}

function abbildung() {
  var j, hpix = [],
    l;
  for (j = 0; j < 4 * width * height; j++)
    hpix[j] = pix[j];
  for (j = 0; j < width * height; j++) {
    var color = hpix[4 * j + 1] + hpix[4 * j + 2] + hpix[4 * j + 3];
    for (var i = 0; i < abbnum; i++)
      for (l = 0; l < 4; l++)
        if (color < 740)
          pix[4 * transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i]) + l] = hpix[4 * j + l];

  }

}

function transform(j, winkel, streckx, strecky, xverschiebung, yverschiebung) {
  var x, y;
  var xh, yh, xhh;
  xh = (j % width * 1.0 / width - xversch) * breite;
  yh = ((1 - yversch) * height - j / width) * breite / width;
  xh = xh * streckx;
  yh = yh * strecky;

  xhh = xh;
  xh = xh * cos(PI / 180 * winkel) - yh * sin(PI / 180 * winkel);
  yh = yh * cos(PI / 180 * winkel) + xhh * sin(PI / 180 * winkel);

  xh += xverschiebung;
  yh += yverschiebung;

  x = floor(width * (xh / breite + xversch));
  y = floor(height * (1 - yversch) - width * yh / breite);

  if (0 <= x && x < width && 0 <= y && y < height)
    return width * y + x;
  else
    return 0;
}
