let slider, norm;
let tMax = 10000;
let wienConst = 2898000;
let text;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, tMax, 1500, 5);
  slider.position(50, 50);
  text = createP();
  text.position(80, 70);
  text.style('font-size', '130%');
  text.style('color', '#ffffff');
  let lMax = wienConst / 6000;
  norm = 1 / planck(lMax, 6000);
}

function resultingColor(T) {
  let rm = 0;
  let bm = 0;
  let gm = 0;
  for (let lambda = 300; lambda < 900; lambda++) {
    let p = planckN(lambda, T);
    let rgb = nmToRgb(lambda);
    rm += p * rgb[0];
    gm += p * rgb[1];
    bm += p * rgb[2];
  }
  let norm = cNorm(6000);
  rm *= norm;
  gm *= norm;
  bm *= norm;
  return color(rm, gm, bm);
}
function cNorm(T){
  let rm = 0;
  let bm = 0;
  let gm = 0;
  for (let lambda = 300; lambda < 900; lambda++) {
    let p = planckN(lambda, T);
    let rgb = nmToRgb(lambda);
    rm += p * rgb[0];
    gm += p * rgb[1];
    bm += p * rgb[2];
  }
  return 255/max(rm, gm, bm);
}


function setPixel(T) {
  loadPixels();

  for (let i = 0; i < width; i++) {
    let lambda = i;
    let p = planckN(lambda, T);
    let rgb = nmToRgb(lambda);
    for (let j = 0; j < height; j++) {
      let k = j * width + i;
      pixels[k * 4] = rgb[0] * p;
      pixels[k * 4 + 1] = rgb[1] * p;
      pixels[k * 4 + 2] = rgb[2] * p;
      pixels[k * 4 + 3] = 255;
    }
  }
  updatePixels();

}

function planckN(lambda, T) {
  let lmax = wienConst / T;
  return planck(lambda, T) / planck(lmax, T);
}

function planck(lambda, T) {
  lambda = lambda * Math.pow(10, -9);
  let h = 6.62 * Math.pow(10, -34);
  let c = 3 * Math.pow(10, 8);
  let k = 1.38 * Math.pow(10, -23);
  return pow(lambda, -5) * 1 / (Math.exp(h * c / (lambda * T * k)) - 1);

}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  let T = slider.value();
  setPixel(T);
  c = resultingColor(T);
  stroke(c);
  strokeWeight(5);
  for (let i = 0; i < width; i++) {
    point(i, height * (1 - norm * planck(i, T)));
  }
  text.html('Temperatur: ' + T + 'K');
  fill(c);
  noStroke();
  ellipse(50, 95, 30);
}