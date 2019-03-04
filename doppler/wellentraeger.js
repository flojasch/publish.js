class Traeger {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.z = [];
        this.vz = [];
        for (let i = 0; i <= rows; i++) {
            this.z[i] = [];
            this.vz[i] = [];
            for (let j = 0; j <= cols; j++) {
                this.z[i][j] = 0;
                this.vz[i][j] = 0;
            }
        }
        this.z[1][1] = 0.01;
    }
    update() {
        let az = [];
        for (let i = 1; i < this.rows; i++) {
            az[i] = [];
            for (let j = 1; j < this.cols; j++) {
                az[i][j] = this.z[i][j + 1] + this.z[i][j - 1] +
                    this.z[i + 1][j] + this.z[i - 1][j] - 4 * this.z[i][j];
            }
        }


        for (let i = 1; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                this.z[i][j] += this.vz[i][j];
                this.vz[i][j] += az[i][j];
            }
        }
    }

}