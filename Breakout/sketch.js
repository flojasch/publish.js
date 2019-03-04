
let bgImg;
let paddel;
let ball;
let bricks = [];

function preload() {
  brickSprite = loadImage('Images/brick.png');
  paddelSprite = loadImage('Images/paddel.png');
  ballSprite = loadImage('Images/ball.png');
  bgImg = loadImage('Images/space.jpg');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.position(20, 20);
  paddel = new Paddel(width/2,height-20,paddelSprite);
  startGame();
}

function startGame(){
  let x = floor(random()*width);
  let y = floor(random()*height);
  ball = new Ball(x,y,ballSprite,5,-5);
  bricks=[];
  y = 0;
  for (let i = 0; i < 4; i++) {
    x = 0;
    while (x < width) {
      bricks.push(new GameObject(x, y,brickSprite));
      x += brickSprite.width;
    }
    y += brickSprite.height;
  }
}

/*function keyPressed(){
  if(keyCode == 32){

  }
}*/

function draw() {
  background(0);
  image(bgImg, 0, 0, width, height);
  if (keyIsPressed) {
    //console.log(keyCode);
    if (keyCode == 39) {
      paddel.left();
    }
    if (keyCode == 37) {
      paddel.right();
    }
    if (keyCode == 32) {
      startGame();
    }
  }
  if(ball.y < 0){
    textSize(60);
    fill(200,50,10);
    text('Winner!',width/2-100,height/2);
  } else if(ball.y > height){
    textSize(60);
    fill(200,50,10);
    text('Looser!',width/2-100,height/2);
  } else{
    paddel.show();
    ball.checkEdges();
    if(ball.collision(paddel)){
      ball.vy *= -1;
    }
    for (let i = 0; i < bricks.length; i++) {
      if (ball.collision(bricks[i])){
        bricks.splice(i,1);
        ball.vy *= -1;
      }
    }
    ball.update();
    ball.show();
    for (let i = 0; i < bricks.length; i++) {
      bricks[i].show();
    }
  }
}
