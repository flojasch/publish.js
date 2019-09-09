class McTree {
    constructor(cube) {
        this.cube = cube;
        this.value = value(cube);
        this.children = [];
        this.moves = [];
    }

    print() {
        console.log("node: " + this.value);
        for (let child of this.children) {
            console.log("child: " + child.value);
        }
        console.log("-------------------");
        for (let child of this.children) {
            child.print();
        }
    }

    getValue() {
        if (this.children.length == 0) {
            return this.value;
        }
        let opt = this.value;
        for (let child of this.children) {
            let val=child.getValue();
            if (opt < val) {
                opt = val;
            }
        }
        return opt;
    }

    getBest() {
        let ret;
        let opt = 0;
        for (let child of this.children) {
            let val=child.getValue();
            if (val >= opt) {
                opt = val;
                ret = child;
            }
        }
        return ret;
    }

    grow() {
        if (this.children.length == 0) {
            let dirs = [-1, 1, 2];
            for (let i = -1; i < 2; i += 2) {
                for (let j of dirs) {
                    for (let k = 0; k < 3; k++) {
                        this.makeMov(i, j, k);
                    }
                }
            }
        } else {
            let bIndex=0;
            let opt=this.children[0].value;
            let sopt=0;
            let sbIndex;
            for (let i=1;i< this.children.length;i++) {
                let val = this.children[i].value;
                if (val > opt) {
                    sopt=opt;
                    opt = val;
                    sbIndex=bIndex;
                    bIndex=i;
                } else if(val > sopt){
                    sopt=val;
                    sbIndex=i;
                }
            }
            this.children[bIndex].grow();
            this.children[sbIndex].grow();
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
            let node = new McTree(cb);
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

function equals(c1, c2) {
    for (let i = 0; i < c1.length; i++) {
        let f1 = [c1.cubes[i].faces[0], c1.cubes[i].faces[2]];
        let f2 = [c2.cubes[i].faces[0], c2.cubes[i].faces[2]];
        for (let j = 0; j < f1.length; ++j) {
            if (f1[j].x != f2[j].x || f1[j].y != f2[j].y || f1[j].z != f2[j].z) {
                return false;
            }
        }
    }
    return true;
}