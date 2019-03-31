let nSlider;
let h = [];
let slices;
let N;
let text;
let button;
let n;
let showgaus = false;

function setup() {
  let canvas = createCanvas(1000, 700);
  nSlider = new Slider(20, 20, 1, 5, 2, 1);
  n = nSlider.slider.value();
  slices = 50;
  text = createP();
  text.position(600, 20);
  text.style('font-size', '160%');
  button = createButton('Neustart');
  button.position(500, 20);
  button.mousePressed(restart);
  nbutton = createButton('toggle Normalverteilung');
  nbutton.position(300, 20);
  nbutton.mousePressed(toggleGaus);
  restart();
}

function toggleGaus() {
  showgaus = !showgaus;
}

function restart() {
  for (let i = 0; i < slices; i++) {
    h[i] = 0;
  }
  N = 0;
}

function sigma() {
  let mu = n / 2;
  let sigma = 0;
  for (let i = 0; i < slices; i++) {
    sigma += h[i] * pow(i * n / slices - mu, 2);
  }
  return sigma / N;
}

function draw() {
  background(200);
  if (n != nSlider.slider.value()) {
    n = nSlider.slider.value();
    restart();
  }
  nSlider.text.html('Anzahl der Zufallsvariablen: ' + n)

  for (let i = 0; i < 400; ++i) {
    let rand = random();
    for (let j = 0; j < n - 1; j++) {
      rand += random();
    }
    let index = floor(rand / n * slices);
    ++h[index];
    ++N;
  }
  text.html('Anzahl Durchführungen: ' + N);
  for (let i = 0; i < slices; i++) {
    fill(0, 0, 250);
    stroke(0);
    strokeWeight(1);
    rect(i * 20, height * (1 - 15 * h[i] * 1. / N), 20, 15 * height * h[i] * 1. / N);
  }
  if (showgaus) {
    sig = sigma();
    for (let i = 0; i < width; i++) {
      stroke(200, 0, 0);
      strokeWeight(3);
      point(i, height * (1 - 0.293 * n * normal(i)));
    }
  }
}

function normal(i) {
  return exp(-0.5 / sig * pow(i * n / width - n / 2, 2)) / sqrt(2 * PI * sig);
}