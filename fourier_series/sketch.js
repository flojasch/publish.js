
let time = 0;
let wave = [];

let slider;

function setup() {
  createCanvas(windowWidth, 400);
  slider = createSlider(1, 200, 1);
  slider.position(20,420);
  speedslider = createSlider(-10,10,-5,0.1);
  speedslider.position(220,420);
  //frameRate(30);
}

function draw() {
  background(0);
  speed = speedslider.value();
  translate(300, 200);

  let x = 0;
  let y = 0;

  for (let i = 0; i < slider.value(); i++) {
    let prevx = x;
    let prevy = y;

    let n = i * 2 + 1;
    let radius = 75 * (4 / (n * PI));
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    stroke(255,150);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    //fill(255);
    stroke(0,255,255);
    line(prevx, prevy, x, y);
    //ellipse(x, y, 8);
  }
  wave.unshift(y);


  translate(200, 0);
  stroke(255,100);
  line(x - 200, y, 0, wave[0]);
  stroke(0,255,255);
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.005*speed;

  if (wave.length > width-500) {
    wave.pop();
  }
}
