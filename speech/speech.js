// var myRec = new p5.SpeechRec(); 

// 	function setup()
// 	{
// 		createCanvas(800, 400);
// 		background(255, 255, 255);
// 		fill(0, 0, 0, 255);
// 		textSize(32);
// 		textAlign(CENTER);
// 		text("say something", width/2, height/2);
// 		myRec.onResult = showResult;
// 		myRec.start();
// 	}

// 	function draw()
// 	{
// 		// why draw when you can talk?
// 	}

// 	function showResult()
// 	{
// 		if(myRec.resultValue==true) {
// 			background(192, 255, 192);
// 			text(myRec.resultString, width/2, height/2);
// 			console.log(myRec.resultString);
// 		}
// 	}

// var mic;
// function setup(){
//   mic = new p5.AudioIn()
//   mic.start();
// }
// function draw(){
//   background(0);
//   micLevel = mic.getLevel();
//   ellipse(width/2, constrain(height-micLevel*height*5, 0, height), 10, 10);
// }
let mic, fft;

function setup() {
  createCanvas(710, 400);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(200);

  let spectrum = fft.analyze();

  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}
