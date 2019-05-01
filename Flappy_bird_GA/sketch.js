var allBirds = [];
var activeBirds = [];
var bestBird;
var pipes;
var parallax = 0.8;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var counter = 0;
let highScore = 0;
let time = 0;

var mutationRate;
let speedSlider;
let mutationSlider;
let mutationSpan;
let selectionSlider;
let selectionSpan;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;


let totalPopulation = 500;

function keyPressed() {
  if (key == 's') {
    let bird = activeBirds[0];
    saveJSON(bird.brain, 'bird.json')

  }
}

let runBest = false;
let runBestButton;
let playGame = false;
let playGameButton;

function preload() {
  pipeBodySprite = loadImage('graphics/pipe_marshmallow_fix.png');
  pipePeakSprite = loadImage('graphics/pipe_marshmallow_fix.png');
  birdSprite = loadImage('graphics/train.png');
  bgImg = loadImage('graphics/background.png');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvascontainer');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  mutationSlider = select('#mutationSlider');
  mutationSpan = select('#mutation');
  selectionSlider = select('#selectionSlider');
  selectionSpan = select('#selection');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);
  playGameButton = select('#play');
  playGameButton.mousePressed(toggleGameState);
  bgX = 0;
  pipes = [];
  // Create a population
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}

// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}

function toggleGameState() {
  playGame = !playGame;
  // Play game
  if (playGame) {
    reset();
    playGameButton.html('quit playing');
    // Go train some more
  } else {
    nextGeneration();
    playGameButton.html('play game');
  }
}

function draw() {
  if (playGame) {
    playYourself();
  } else {
    let cycles = speedSlider.value();
    speedSpan.html(cycles);
    mutationRate = 0.02 * mutationSlider.value();
    mutationSpan.html(mutationRate);
    selectionPower = selectionSlider.value();
    selectionSpan.html(selectionPower);
    for (let n = 0; n < cycles; n++) {
      if (counter % 100 === 0) {
        pipes.push(new Pipe());
      }
      counter++;
      time++;
      bgX -= pipes[0].speed * parallax;
      if (bgX <= -bgImg.width) {
        bgX = 0;
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }

      if (runBest) {
        bestBird.think(pipes);
        bestBird.update();
        for (let j = 0; j < pipes.length; j++) {
          // Start over, bird hit pipe
          if (pipes[j].hits(bestBird)) {
            resetGame();
            break;
          }
        }

        if (bestBird.bottomTop()) {
          resetGame();
        }
        // Or are we running all the active birds
      } else {
        for (let i = activeBirds.length - 1; i >= 0; i--) {
          let bird = activeBirds[i];
          // Bird uses its brain!
          bird.think(pipes);
          bird.update();

          // Check all the pipes
          for (let j = 0; j < pipes.length; j++) {
            // It's hit a pipe
            if (pipes[j].hits(activeBirds[i])) {
              // Remove this bird
              activeBirds.splice(i, 1);
              break;
            }
          }
          if (bird.bottomTop()) {
            activeBirds.splice(i, 1);
          }
        }
      }

    }
    // What is highest score of the current population
    let tempHighScore = 0;
    // If we're training
    if (!runBest) {
      // Which is the best bird?
      let tempBestBird = null;
      for (let i = 0; i < activeBirds.length; i++) {
        let s = activeBirds[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = activeBirds[i];
        }
      }

      // Is it the all time high scorer?
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      // Just one bird, the best one so far
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
    }
    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(floor(100 * highScore * 1.0 / sqrt(time)) / 100.0);

    background(0);
    image(bgImg, bgX, 0, bgImg.width, height);
    if (bgX <= -bgImg.width + width) {
      image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    }

    for (let pipe of pipes) {
      pipe.show();
    }

    if (runBest) {
      bestBird.show();
    } else {
      for (let i = 0; i < activeBirds.length; i++) {
        activeBirds[i].show();
      }
      // If we're out of birds go to the next generation
      if (activeBirds.length == 0) {
        nextGeneration();
      }
    }
  }
}
