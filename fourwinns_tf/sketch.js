let feld;
let isTurn;
let isTrain = false;
let button;
let zugtiefe = 6;
let model;


function setup() {
  let canvas = createCanvas(700, 800);
  canvas.parent('canvascontainer');
  //canvas.position(50, 50);
  background(200);
  button = select('#play');
  button.mousePressed(toggleButton);
  model = tf.sequential();
  model.add(tf.layers.dense({
    units: 63,
    inputShape: [126],
    activation: "sigmoid",
    useBias: true
  }));

  // model.add(tf.layers.dense({
  //   units: 30,
  //   activation: "sigmoid",
  //   useBias: true
  // }));
  model.add(tf.layers.dense({
    units: 2,
    activation: "sigmoid",
    useBias: true
  }));

  const learningRate = 0.1;
  const opti = tf.train.sgd(learningRate);

  model.compile({
    loss: 'meanSquaredError',
    optimizer: opti,
  });
  train();
  // model.summary();
  // test();
  // feld = new Spielfeld(6, 7);
  button.html('train')
  isTurn = false;

}

function test() {
  let error = 0;
  for (let i = 0; i < 100; ++i) {
    spielfeld = new Spielfeld(6, 7);
    spielfeld.play();
    spielfeld.draw();
    let v = spielfeld.calcValue();
    let h = heuristic(spielfeld);
    // console.log(v);
    // console.log(h);
    let d = v - h;
    error += d * d / 100;
  }
  console.log("error: " + error);
}


function heuristic(field) {
    let input = tf.tensor2d([field.makeArray()]);
    let output = model.predict(input).dataSync();
    return output[1] - output[0];
}

function toggleButton() {
  isTrain = !isTrain;
  if (isTrain) {
    button.html('play')
  } else {
    feld = new Spielfeld(6, 7);
    button.html('train')
    isTurn = false;
  }
  return false;
}

function mouseClicked() {
  if (isTurn) {
    let player = -1;
    if (mouseY < 200) {
      feld.turn(floor(mouseX / 100), player);
      isTurn = false;
    }
  }
}

// function draw() {
//   if (isTrain) {
//     train();
//   } else {
//     if (feld.calcValue() == -1) {
//       textSize(64);
//       fill(0, 102, 153);
//       text('you win!', width / 2, height / 2);
//     } else if (feld.calcValue() == 1) {
//       textSize(64);
//       fill(0, 102, 153);
//       text('you loose!', width / 2, height / 2);
//     } else {
//       background(200);
//       if (isTurn) {
//         fill(250, 250, 0);
//         ellipse(mouseX, mouseY, 90, 90);
//       } else {
//         let tree = new GameTree(feld);
//         feld = tree.makeTurn(zugtiefe);
//         isTurn = true;
//       }
//       feld.draw();
//     }
//   }
// }

async function train() {
  let spielfeld;
  let targets = [];
  let inputs = [];
  for (let i = 0; i < 1000; ++i) {
    spielfeld = new Spielfeld(6, 7);
    spielfeld.play();
    targets.push(spielfeld.getTarget());
    inputs.push(spielfeld.makeArray());
  }

  let y = tf.tensor2d(targets);
  let x = tf.tensor2d(inputs);
  // await model.fit(x, y, {
  //   // shuffle: true,
  //   batchSize: 1,
  //   epochs: 1,
  //   validationData: [x, y],
  //   callbacks: {
  //     onEpochEnd: async (epoch, logs) => {
  //       console.log("loss: " + logs.loss);
  //       test();
  //       await tf.nextFrame();
  //     }
  //   }
  // });
  for (let i = 0; i < 100; ++i) {
    const h = await model.fit(x, y, {
      batchSize: 3,
      epochs: 1
    });
    console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
    // test();
  }

}