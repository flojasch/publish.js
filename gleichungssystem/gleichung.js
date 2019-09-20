let button;
let a1,a2,b1,b2,r1,r2;

function setup() {
  createCanvas(500, 500);
  background(200);
  button = createButton('berechne');
  button.position(300,100);
  button.mousePressed(solve);
  textSize(32);
  input_a1=createInput();
  input_a1.size(20);
  input_a1.position(50,50);
  text('x +',70,63);
  input_b1=createInput();
  input_b1.size(20);
  input_b1.position(130,50);
  text('y =',150,63);
  input_a2=createInput();
  input_a2.size(20);
  input_a2.position(50,100);
  text('x +',70,113);
  input_b2=createInput();
  input_b2.size(20);
  input_b2.position(130,100);
  text('y =',150,113);
  input_r1=createInput();
  input_r1.size(20);
  input_r1.position(210,50);
  input_r2=createInput();
  input_r2.size(20);
  input_r2.position(210,100);
  textX = createP();
  textX.position(100, 200);
  textX.style('font-size', '160%');
  textY = createP();
  textY.position(100, 230);
  textY.style('font-size', '160%');
}

function solve(){
  a1=input_a1.value();
  a2=input_a2.value();
  b1=input_b1.value();
  b2=input_b2.value();
  r1=input_r1.value();
  r2=input_r2.value();

  let x=(r1*b2-r2*b1)/(a1*b2-a2*b1);
  let y=(r1*a2-r2*a1)/(b1*a2-b2*a1);
  textX.html('x = '+x);
  textY.html('y = '+y);
}