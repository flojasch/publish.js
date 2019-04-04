let time = 0;
let wave = [];

let slider;

function setup() {
  createCanvas(windowWidth, 400);
  slider = createSlider(1, 200, 1);
  slider.position(20, 420);
  speedslider = createSlider(-10, 10, -5, 0.1);
  speedslider.position(220, 420);
  //frameRate(30);
}

function draw() {
  background(0);
  speed = speedslider.value();
  translate(300, 200);

  let radius = 50;
  let x1 = radius * cos(time);
  let y1 = radius * sin(time);
  let x2 = radius * cos(1.2 * time);
  let y2 = radius * sin(1.2 * time);

  stroke(255, 150);
  noFill();
  ellipse(0, 0, radius * 2);
  ellipse(x1, y1, radius * 2);
  let x = x1 + x2;
  let y = y1 + y2;
  line(0, 0, x2, y2);
  
  line(x2,y2,x,y);
  stroke(0, 255, 255);
  line(0, 0, x1, y1);
  line(x1,y1,x,y);
  

  wave.unshift(y);
  translate(200, 0);
  stroke(255, 100);
  line(x - 200, y, 0, wave[0]);
  stroke(0, 255, 255);
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.005 * speed;

  if (wave.length > width - 500) {
    wave.pop();
  }
}