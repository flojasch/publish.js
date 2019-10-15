let img_data=[];
let num_data=[];
let img_index=0;
let button, input,trainButton;
let user_digit;
let user_has_drawing = false;
let user_guess_ele;
let isTrain = false;

function setup() {
    nn = new NeuralNetwork(784,64,10,0.2);
    createCanvas(560,280);
    background(0);
    noStroke();
    user_digit = createGraphics(280, 280);
    user_digit.pixelDensity(1);
    user_guess_ele = select('#user_guess');

  input = createInput();
  input.position(20, 420);

  button = createButton('save');
  button.position(input.x + input.width, 420);
  button.mousePressed(addData);

  greeting = createElement('p','Value of number');
  greeting.position(20, 350);
  trainButton = createButton('train');
  trainButton.position(300, 400);
  trainButton.mousePressed(toggleTrain);
}

function toggleTrain(){
    isTrain = !isTrain;
}
function train(){
     let train_index=Math.floor(Math.random()*(img_index));
     let label=num_data[train_index];
     let target_arr=[0,0,0,0,0,0,0,0,0,0];
     target_arr[label]=1;
     nn.train(img_data[train_index],target_arr); 
     showData(train_index);
}

function showData(index){
    for(let i=0;i<784;++i){
        fill(img_data[index][i]*255);
        let x=i%28;
        let y=(i-x)/28;
        rect(280+x*10,y*10,10,10);
    }
}

function addData(){
  let img = user_digit.get();
  img_data[img_index]=[];
  img.resize(28, 28);
  img.loadPixels();
  num_data[img_index]=parseInt(input.value());
  for (let i = 0; i < 784; i++) {
    img_data[img_index][i] = img.pixels[i * 4] / 255;
  }
  user_digit.background(0);
  ++img_index;
} 


function guessUserDigit() {
  let img = user_digit.get();
  if(!user_has_drawing) {
    user_guess_ele.html('_');
    return img;
  }
  let inputs = [];
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    inputs[i] = img.pixels[i * 4] / 255;
  }
  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  user_guess_ele.html(guess);
  return img;
}

function draw() {
  let user = guessUserDigit();
  image(user_digit, 0, 0);

  if (mouseIsPressed) {
    user_has_drawing = true;
    user_digit.stroke(255);
    user_digit.strokeWeight(16);
    user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
  }
  if(isTrain){
      train();
  }
}

function keyPressed() {
  if (key == ' ') {
    user_has_drawing = false;
    user_digit.background(0);
  }
}

function findMax(arr) {
  let record = 0;
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > record) {
      record = arr[i];
      index = i;
    }
  }
  return index;
}
