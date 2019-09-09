class GameTree {
  constructor(cube) {
    this.children = [];
    this.cube = cube;
    this.moves = [];
  }

  getBest() {
    if (this.children.length == 0) {
      return this;
    }
    let ret;
    let opt = 0;
    for (let child of this.children) {
      let val = value(child.getBest().cube);
      if (val >= opt) {
        opt = val;
        ret = child.getBest();
      }
    }
    return ret;
  }

  grow() {
    if (this.children.length == 0) {
      let dirs = [-1, 1, 2];
      if (this.moves.length < 3) {
        for (let i = -1; i < 2; i += 2) {
          for (let j of dirs) {
            for (let k = 0; k < 3; k++) {
              this.makeMov(i, j, k);
            }
          }
        }
      } else {
        let made = false;
        while (!made) {
          let i = 2 * int(Math.random() * 2) - 1;
          let k = int(Math.random() * 3);
          let r = int(Math.random() * 3);
          let j = dirs[r];
          made = this.makeMov(i, j, k);
        }
      }
    } else {
      for (let child of this.children) {
        child.grow();
      }
    }
  }

  makeMov(i, j, k) {
    let made = false;
    let ml = new Move([0, 0, 0], 1);
    let mll = new Move([0, 0, 0], 1);
    if (this.moves.length > 0) {
      ml = this.moves[this.moves.length - 1];
    }
    if (this.moves.length > 1) {
      mll = this.moves[this.moves.length - 2];
    }
    if (ml.omega[k] != i && !(ml.omega[k] == -i && mll.omega[k] == i)) {
      let cb = turn(k, this.cube, i, j);
      let node = new GameTree(cb);
      node.moves = cp(this.moves);
      let omega = [0, 0, 0];
      omega[k] = i;
      node.moves.push(new Move(omega, j));
      this.children.push(node);
      made = true;
    }
    return made;
  }
}

function cp(moves) {
  let ret = [];
  for (let i = 0; i < moves.length; i++) {
    ret[i] = moves[i].copy();
  }
  return ret;
}