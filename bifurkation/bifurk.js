let mx = 3.5,
  my = 0.5;
let ex = 1,
  ey = 1;
let colorgradSlider, maxiterSlider;
let dragx, dragy;
let overscreen = false;
let action=true;
let f= new Function('a','x','return a*x*(1-x)');

function setup() {
  slider=createSlider(0,500,100,1);
  slider.position(250,20);
  maxiter=slider.value();
  input = createInput();
  input.position(10, 10);
  inputButton = createButton('Submit');
  inputButton.position(150,10);
  inputButton.mousePressed(drawdiagramm)
  canvas = createCanvas(800, 500);
  canvas.position(50, 50);

}

function drawdiagramm() {
  action=true;
  background(230);
  f = new Function('a', 'x', 'return ' + input.value());
  bifurc();
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
  if(maxiter!=slider.value()){
    maxiter=slider.value();
    action=true;
  }
  if(action){ 
    bifurc();
    //mandel();
  }
}

function bifurc() {
  background(230);
  stroke(0);
  action = false;
  xmin = mx - ex / 2;
  xmax = xmin + ex;
  ymin = my - ey / 2;
  ymax = ymin + ey;

  for (let i = 0; i < width; i++) {
    let a = map(i, 0, width, xmin, xmax);
    let x = 0.001;
    for (let n = 0; n < maxiter; ++n) {
      x = f(a, x);
    }
    for (let n = 0; n < maxiter; ++n) {
      x = f(a, x);
      let j = map(x, ymax, ymin, 0, height);
      if(j<height) point(i, j);
    }
  }
}