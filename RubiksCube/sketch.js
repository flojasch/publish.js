let cube;
let len = 100;
let inkr = 2;
let dist = len / inkr;
let started = false;
let angle = 0;
let speed = 2;
let animating = false;
let finished = true;
let move = new Move([0, 0, 0], 1);
let moves = [];
let moveindex = -1;
let button;
let nn;
let traindata;
let targetdata;
let gnum = 3;


let allMoves = [
  new Move([0, 1, 0], 1),
  new Move([0, 1, 0], -1),
  new Move([0, -1, 0], 1),
  new Move([0, -1, 0], -1),
  new Move([1, 0, 0], 1),
  new Move([1, 0, 0], -1),
  new Move([-1, 0, 0], 1),
  new Move([-1, 0, 0], -1),
  new Move([0, 0, 1], 1),
  new Move([0, 0, 1], -1),
  new Move([0, 0, -1], 1),
  new Move([0, 0, -1], -1)
];

function preload() {
  nnJSON = loadJSON("nn2x2.json");
  // nnJSON = loadJSON("nn.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cube = new Cube(1);
  for (let i = 0; i < 15; i++) {
    let r = int(random(allMoves.length));
    moves.push(allMoves[r]);
  }
  button = createButton('solve');
  button.position(20, 20);
  button.mousePressed(solve);
  // nn = new NeuralNetwork(192, 600, gnum + 1, 0.1);
  nn = NeuralNetwork.deserialize(nnJSON);
}

function draw() {
  background(0);
  orbitControl();
  rotateX(-0.5);
  rotateY(0.4);
  rotateZ(0.1);
  ambientLight(250);
  background(51);
  move.update();
  if (move.finished) {
    if (moveindex < moves.length - 1) {
      moveindex++;
      move = moves[moveindex];
      move.start();
    }
  }
  show(cube);
}

function show(cube) {
  for (let i = 0; i < cube.length; i++) {
    let qb = cube.cubes[i];
    push();
    if (abs(move.omega[2]) > 0 && qb.z == move.omega[2] * dist) {
      rotateZ(angle);
    }
    if (abs(move.omega[1]) > 0 && qb.y == move.omega[1] * dist) {
      rotateY(angle);
    }
    if (abs(move.omega[0]) > 0 && qb.x == move.omega[0] * dist) {
      rotateX(angle);
    }
    qb.show();
    pop();

  }
}

function turn(omega, cube, index, dir) {
  let ret = cube.copy();
  ret.turn(omega, index, dir);
  return ret;
}

function isSolved(cube) {
  for (let i = 0; i < cube.length; i++) {
    let f = cube.cubes[i].faces[0];
    let g = cube.cubes[i].faces[2];
    if (f.x != 0 || f.y != 0 || f.z != -1 ||
      g.x != 0 || g.y != 1 || g.z != 0) {
      return false;
    }
  }
  return true;
}

let vari;

function value(cube) {
  let out = nn.predict(makeArray(cube));
  // let max = 0;
  // let imax;

  // for (let i = 0; i < out.length; i++) {
  //   let val = out[i];
  //   if (val > max) {
  //     max = val;
  //     imax = i;
  //   }
  // }

  // let mean = 0;
  // for (let i = 0; i < out.length; i++) {
  //   mean += i * out[i];
  // }

  // vari = 0;
  let ret = 0;

  for (let i = 0; i < out.length; i++) {
    // vari += (i - mean) * (i - mean) * out[i];
    ret = 3 * ret + out[i];
  }

  return ret;
}

let pos;


function solve() {
  pos = new McTree(cube);
  grow(pos, 12);
  for (let i = 0; i < 400; i++) {
    pos = pos.getBest();
    console.log("predicted value " + pos.getValue());
    console.log("cubevalue: " + value(pos.cube));
    if (isSolved(pos.cube)) break;
    if (pos.getValue() < 26) pos.grow();
  }
  moves = pos.moves;
  moveindex = -1;
}

function makeArray(cube) {
  let ret = [];
  let arr;
  let index = 0;
  for (let i = 0; i < cube.length; i++) {
    for (let j = 0; j < 6; j++) {
      for (let k = 0; k < 4; k++) {
        ret[index] = 0;
        let f = cube.cubes[i].faces[j];
        if (f.x == 0 && f.y == 0 && f.z == 1) {
          if (j == 0 || j == 1) {
            arr = [2, 3, 4, 5];
          }
          if (j == 2 || j == 3) {
            arr = [0, 1, 4, 5];
          }
          if (j == 4 || j == 5) {
            arr = [0, 1, 2, 3];
          }
          f = cube.cubes[i].faces[arr[k]];
          if (f.x == 0 && f.y == 1 && f.z == 0) {
            ret[index] = 1;
          }
        }
        index++;
      }
    }
  }
  return ret;
}

function train(n) {
  for (let k = 0; k < n; k++) {
    makeData();
    //let time=millis();
    for (let i = 0; i < 4000; ++i) {
      for (let j = 0; j < gnum + 1; j++) {
        let r = int(random(traindata[j].length));
        nn.train(traindata[j][r], targetdata[j][r]);
      }
    }
    console.log(k);
    //console.log(millis()-time);
  }
  saveNn();
}

function makeData() {
  tree = new GameTree(new Cube(1));
  grow(tree, gnum);
  traindata = [];
  targetdata = [];
  for (let i = 0; i < gnum + 1; i++) {
    traindata[i] = [];
    targetdata[i] = [];
  }
  makeDataR(tree);
}

function makeDataR(tree) {
  let arr = [];
  for (let i = 0; i < gnum + 1; i++) {
    arr[i] = 0;
  }
  let gen = tree.moves.length;
  arr[gen] = 1;
  targetdata[gen].push(arr);
  traindata[gen].push(makeArray(tree.cube));
  for (let child of tree.children) {
    makeDataR(child);
  }
}

function grow(tree, n) {
  for (let i = 0; i < n; i++) {
    tree.grow();
  }
}

function saveNn() {
  saveJSON(nn, 'nn2x2.json');
}