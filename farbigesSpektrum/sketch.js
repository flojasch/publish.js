let slider;
let text;
let weis=false;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  background(0);
  if (slider) {
    slider.remove();
    text.remove();
    slider2.remove();
    text2.remove();
  }
  button = createButton('weiß');
  button.position(550, 30);
  button.mousePressed(toggleWeis);
  slider = createSlider(0, 0.5, 0.1, 0.01);
  slider.position(50, 50);
  text = createP();
  text.position(50, 60);
  text.style('font-size', '130%');
  text.style('color', '#ffffff');
  slider2 = createSlider(0, 0.5, 0.1, 0.01);
  slider2.position(250, 50);
  text2 = createP();
  text2.position(250, 60);
  text2.style('font-size', '130%');
  text2.style('color', '#ffffff');
  slider3 = createSlider(300, 900, 650, 1);
  slider3.position(550, 50);
  text3 = createP();
  text3.position(550, 60);
  text3.style('font-size', '130%');
  text3.style('color', '#ffffff');
  pixelDensity(1);
}

function toggleWeis(){
  weis=!weis;
}

function colorValues(x) {
  let rm = 0;
  let bm = 0;
  let gm = 0;
  for (let lambda = 300; lambda < 900; lambda++) {
    let p = I(x, lambda);
    let rgb = nmToRgb(lambda);
    rm += p * rgb[0] / 250;
    gm += p * rgb[1] / 250;
    bm += p * rgb[2] / 250;
  }

  return [int(rm), int(gm), int(bm)];
}

function setPixel() {
  loadPixels();
  let w=width;
  let h=height;
  for (let i = 0; i < w; i++) {
    let p=1;
    let x = (i - w / 2);
    if (weis) {
      rgb = colorValues(x);
    } else {
      p = I(x, lambda);
      rgb = nmToRgb(lambda);
    }
    for (let j = 0; j < h; j++) {
      let k = j * w + i;
      pixels[k * 4] = rgb[0] * p;
      pixels[k * 4 + 1] = rgb[1] * p;
      pixels[k * 4 + 2] = rgb[2] * p;
      pixels[k * 4 + 3] = 255;
    }
  }
  updatePixels();

}

function I(x, lambda) {
  if (x == 0) return 1;
  let b = PI * d * 50 / lambda * x;
  let a = sin(b) / b;
  a *= cos(PI * g * 50 / lambda * x);
  return a * a;

}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  background(0);
  d = slider.value();
  g = slider2.value() + d;
  lambda = slider3.value();
  setPixel(d, g);
  text.html('Spaltbreite: ' + d + 'mm');
  text2.html('Spaltmittenabstand: ' + int(g * 100) / 100 + 'mm');
  text3.html('Wellenlänge: ' + lambda + 'nm');
}