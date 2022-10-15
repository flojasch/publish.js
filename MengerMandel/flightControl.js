document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

let scale=2;
let maxIter=30;
let rotx=0;
let rotz=0;
let roty=0;

function rot(p, n, alpha) {
  let c = Math.cos(alpha);
  let s = Math.sin(alpha);
  let res = {};
  res.x = p.x * (n.x * n.x * (1. - c) + c) + p.y * (n.x * n.y * (1. - c) - n.z * s) + p.z * (n.x * n.z * (1. - c) + n.y * s);
  res.y = p.x * (n.x * n.y * (1. - c) + n.z * s) + p.y * (n.y * n.y * (1. - c) + c) + p.z * (n.y * n.z * (1. - c) - n.x * s);
  res.z = p.x * (n.x * n.z * (1. - c) - n.y * s) + p.y * (n.z * n.y * (1. - c) + n.x * s) + p.z * (n.z * n.z * (1. - c) + c);
  return res;
}

function rotZ(p, alpha){
  let c=Math.cos(alpha), s=Math.sin(alpha);
  let ret={};
  ret.z=p.z;
  ret.x=c*p.x+s*p.y;
  ret.y=-s*p.x+c*p.y;
  return ret;
}

function rotX(p, alpha){
  let c=Math.cos(alpha), s=Math.sin(alpha);
  let ret={};
  ret.x=p.x;
  ret.y=c*p.y+s*p.z;
  ret.z=-s*p.y+c*p.z;
  return ret;
}

function rotY(p, alpha){
  let c=Math.cos(alpha), s=Math.sin(alpha);
  let ret={};
  ret.y=p.y;
  ret.x=c*p.x+s*p.z;
  ret.z=-s*p.x+c*p.z;
  return ret;
}

function getDist(p){
  let dp=1.;
  for(let n=0; n < maxIter; ++n){
      p=rotX(p,rotx);
      
      p.x=Math.abs(p.x);p.y=Math.abs(p.y);p.z=Math.abs(p.z);
      if(p.y > p.x){
        let px=p.x;
        p.x=p.y;
        p.y=px;
      } 
      if(p.z > p.y){
        let py=p.y;
        p.y=p.z;
        p.z=py;
      } 
      p.x *=scale; p.y *= scale; p.z *=scale;
      dp= dp*scale;
      p=rotZ(p,rotz);
      p=rotY(p,roty);
      p.x -= scale-1; 
      p.y -= scale-1; 
      if(p.z > .5*(scale-1)) p.z -= scale-1; 
  }
  return Math.sqrt(p.x*p.x+p.y*p.y+p.z*p.z)/dp;
}

const mov = {
  left: false,
  right: false,
  up: false,
  down: false,
  tleft: false,
  tright: false,
  forward: false,
  backward: false,
}

const p = {
  X: {
    x: 1,
    y: 0,
    z: 0
  },
  Y: {
    x: 0,
    y: 1,
    z: 0
  },
  Z: {
    x: 0,
    y: 0,
    z: 1
  },
  x: 0,
  y: 1,
  z: -5,
};

function keyDownHandler(event) {
  switch (event.keyCode) {
    case 37: // keyleft
      mov.left = true;
      break;
    case 38: // keyup
      mov.up = true;
      break;
    case 39: // keyright
      mov.right = true;
      break;
    case 40: // keydown
      mov.down = true;
      break;
    case 65: // a
      mov.tleft = true;
      break;
    case 68: //d
      mov.tright = true;
      break;
    case 87: //w
      mov.forward = true;
      break;
    case 83: //s
      mov.backward = true;
      break;
  }
}

function keyUpHandler(event) {
  switch (event.keyCode) {
    case 37: // keyleft
      mov.left = false;
      break;
    case 38: // keyup
      mov.up = false;
      break;
    case 39: // keyright
      mov.right = false;
      break;
    case 40: // keydown
      mov.down = false;
      break;
    case 65: // a
      mov.tleft = false;
      break;
    case 68: //d
      mov.tright = false;
      break;
    case 87: //w
      mov.forward = false;
      break;
    case 83: //s
      mov.backward = false;
      break;
  }
}

function movePlayer(move) {
  let ang = 0.01;
  let speed= 0.02*getDist(p);
  if (move.left) {
    p.Z = rot(p.Z, p.Y, -ang);
    p.X = rot(p.X, p.Y, -ang);
    //rotx += 1e-3;
  }
  if (move.right) {
    p.Z = rot(p.Z, p.Y, ang);
    p.X = rot(p.X, p.Y, ang);
    // rotx -= 1e-3;
  }
  if (move.up) {
    p.Z = rot(p.Z, p.X, -ang);
    p.Y = rot(p.Y, p.X, -ang);
    //rotz +=1e-3;
  }
  if (move.down) {
    p.Z = rot(p.Z, p.X, ang);
    p.Y = rot(p.Y, p.X, ang);
    //rotz -=1e-3;
  }
  if (move.tleft) {
    p.X = rot(p.X, p.Z, ang);
    p.Y = rot(p.Y, p.Z, ang);
  }
  if (move.tright) {
    p.X = rot(p.X, p.Z, -ang);
    p.Y = rot(p.Y, p.Z, -ang);
  }
  if (move.forward) {
    newPos(speed, p);
  }
  if (move.backward) {
    newPos(-speed, p);
  }

  function newPos(incr, p) {
    p.x += incr * p.Z.x;
    p.y += incr * p.Z.y;
    p.z += incr * p.Z.z;
  }
}