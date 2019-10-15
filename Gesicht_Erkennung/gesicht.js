let img_data=[];
let name_data=[];
let img_index=0;
let button, input,trainButton;
let face;
let user_has_drawing = false;
let user_guess_ele;
let isTrain = false;
let capture;
let canvas;
let slider;
let size=100;
let threshold;

function setup() {
    nn = new NeuralNetwork(size*size,size,3,0.2);
    canvas=createCanvas(560,280);
    background(0);
    noStroke();
    face = createGraphics(280, 280);
    face.pixelDensity(1);
    user_guess_ele = select('#user_guess');
    capture = createCapture(VIDEO);
    capture.size(280, 280);
    capture.hide();
  input = createInput();
  input.position(20, 420);

  button = createButton('save');
  button.position(input.x + input.width, 420);
  button.mousePressed(addData);

  greeting = createElement('p','Name');
  greeting.position(20, 350);
  trainButton = createButton('train');
  trainButton.position(300, 400);
  trainButton.mousePressed(toggleTrain);
  slider = createSlider(0,765,375,1);
  slider.position(20,440);
}

function draw() {
  guessFace();
  face.image(capture, 0, 0,280,280);
  image(face,280,0);
  if(isTrain){
      train();
  }
}

function toggleTrain(){
    isTrain = !isTrain;
}
function train(){
     let train_index=Math.floor(Math.random()*(img_index));
     let label=name_data[train_index];
     let target_arr=[0,0,0];
     target_arr[label]=1;
     nn.train(img_data[train_index],target_arr); 
    // showData(img_data[train_index]);
}

function showData(arr){
    let res=280.0/size;
    for(let i=0;i<size*size;++i){
        fill(arr[i]*255);
        let x=i%size;
        let y=(i-x)/size;
        rect(x*res,y*res,res,res);
    }
}

function addData(){
  let img = face.get();
  img_data[img_index]=[];
  img.resize(size, size);
  img.loadPixels();
  name_data[img_index]=parseInt(input.value());
  setPixel(img,img_data[img_index]);
  ++img_index;
} 

function guessFace() {
  let img = face.get();
  let inputs = [];
  img.resize(size, size);
  img.loadPixels();
  setPixel(img,inputs);
  showData(inputs);
  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  user_guess_ele.html(guess);
}

function setPixel(img,inputs){
    threshold=slider.value();
    for (let i = 0; i < size*size; i++) {
    let brightness=img.pixels[i * 4]+img.pixels[i*4+1]+img.pixels[i*4+2];
    if(brightness > threshold){
        inputs[i]=1;
    } else {
        inputs[i]=0;
    }
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
