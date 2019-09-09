class Cube {
    constructor(size) {
        this.cubes = [];
        let index = 0;
        for (let i = -size; i <= size; i += inkr) {
            for (let j = -size; j <= size; j += inkr) {
                for (let k = -size; k <= size; k += inkr) {
                    if (abs(i) + abs(j) + abs(k) > 1) {
                        let x = i * dist;
                        let y = j * dist;
                        let z = k * dist;
                        let matrix = new p5.Matrix();
                        matrix.translate([x, y, z]);
                        this.cubes[index] = new Cubie(matrix, x, y, z);
                        index++;
                    }
                }
            }
        }
        this.length = index;
        this.size = size;
    }

    copy() {
        let ret = new Cube(this.size);
        for (let i = 0; i < this.length; i++) {
            ret.cubes[i] = this.cubes[i].copy();
        }
        return ret;
    }

    turn(omega, index, dir) {
        for (let i = 0; i < this.length; i++) {
            let qb = this.cubes[i];
            if (omega == 2) {
                if (qb.z == index * dist) {
                    let matrix = new p5.Matrix();
                    matrix.rotateZ(dir * HALF_PI);
                    matrix.translate([qb.x, qb.y, qb.z]);
                    qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
                    qb.turnFacesZ(dir);
                }
            } else if (omega == 1) {
                if (qb.y == index * dist) {
                    let matrix = new p5.Matrix();
                    matrix.rotateY(dir * HALF_PI);
                    matrix.translate([qb.x, qb.y, qb.z]);
                    qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
                    qb.turnFacesY(dir);
                }
            } else if (omega == 0) {
                if (qb.x == index * dist) {
                    let matrix = new p5.Matrix();
                    matrix.rotateX(dir * HALF_PI);
                    matrix.translate([qb.x, qb.y, qb.z]);
                    qb.update(matrix.mat4[12], matrix.mat4[13], matrix.mat4[14]);
                    qb.turnFacesX(dir);
                }
            }
        }
    }
}