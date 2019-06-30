

class GameTree {
  constructor(feld) {
    this.children = [];
    this.feld = feld;
    this.value = feld.calcValue();
  }

  addChild(childNode) {
    this.children.push(childNode);
  }

  isTerminal() {
    if (this.children.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  maxPlayer(alpha, beta) {
    if (this.isTerminal()) {
      return heuristic(this.feld);
    }
    for (let child of this.children) {
      alpha = max(alpha, child.minPlayer(alpha, beta));
      if (alpha >= beta) {
        break;
      }
    }
    return alpha;
  }
  minPlayer(alpha, beta) {
    if (this.isTerminal()) {
      return heuristic(this.feld);
    }
    for (let child of this.children) {
      beta = min(beta, child.maxPlayer(alpha, beta));
      if (alpha >= beta) {
        break;
      }
    }
    return beta;
  }
  growTree(gen) {
    for (let i = 0; i < gen; i++) {
      this.grow(true);
    }
  }
  grow(isPlayer) {
    if (this.value !== 0) {
      return;
    }
    if (this.isTerminal()) {
      let nextFields = this.feld.nextFields(isPlayer);
      for (let newField of nextFields) {
        let newNode = new GameTree(newField);
        this.addChild(newNode);
      }
    } else {
      for (let child of this.children) {
        child.grow(!isPlayer);
      }
    }
  }
  makeTurn(zugtiefe) {
    this.growTree(zugtiefe);
    let res;
    let opt = -1;
    for (let child of this.children) {
      let val = child.minPlayer(-1, 1);
      if (val > opt) {
        opt = val;
        res = child.feld.copy();
      }
    }
    console.log(opt);
    return res;
  }

}
