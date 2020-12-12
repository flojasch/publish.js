let balls = [];
let anzahl = 400;
let rad = 10;
let n = [];
let gravity = new p5.Vector(0,0.1);

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // let canvas = createCanvas(800, 600);
  // canvas.position(20, 20);
  gSlider = new Slider(20, 20, 0, 0.5, 0.1, 0.05);
  rSlider = new Slider(220,20,5,100,10,1);
  let y = height/2;
  let x = 0;
  for (let i = 0; i < anzahl; i++) {
    if (x < width - 2 * rad - 1) {
      x += 2 * rad + 1;
    } else {
      x = 0;
      y += 2 * rad + 1;
    }
    if (i == anzahl - 1) {
      balls.push(new Ball(x, y, 10, 0.0000001, 0, 0, 0, 200));
    } else {
      balls.push(new Ball(x, y, 10, 0, 0));
    }
  }
  //balls.push(new Ball(width / 2, height / 2, 50, 0, 0, 0, 0, 200));

}

function draw() {
  background(100);
  gravity.y = gSlider.slider.value();
  let r=rSlider.slider.value();
  balls[anzahl-1].rad=r;
  balls[anzahl-1].mass=r*r;
  gSlider.text.html("gravity");
  rSlider.text.html("Radius of blue Ball");
  for (let i = 0; i < balls.length; ++i) {
    for (let j = i + 1; j < balls.length; j++) {
      Ball.collision(balls[i], balls[j]);
    }
  }
  for (let i = 0; i < 200; i++) {
    n[i] = 0;
  }

  for (ball of balls) {
    ball.checkEdges();
    ball.update();
    n[floor(p5.Vector.mag(ball.v))] += 1;
    ball.show();
  }
  for (let i = 0; i < 200; i++) {
    fill(250);
    rect(i * 20, height - n[i] * 5, 20, n[i] * 5);
  }
}