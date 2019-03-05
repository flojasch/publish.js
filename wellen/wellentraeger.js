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
                this.z[i][j] = 0;//0.5 * Math.exp(-0.1 * (pow(i - rows / 2,2) + pow(j - cols / 2,2)));
                this.vz[i][j] = 0;
            }
        }

    }
    set(i, j, value) {
        this.z[i][j] = value;
    }
    update() {
        let az = [];
        let damping = -2.0;
        for (let i = 0; i <= this.rows; i++) {
            az[i] = [];
            for (let j = 0; j <= this.cols; j++) {
                az[i][j] = 0;
                if (j == this.cols||j==0||i==this.rows||i==0) {
                    az[i][j] = damping * this.vz[i][j];
                } 
                if (j < this.cols){
                    az[i][j] += this.z[i][j + 1] - this.z[i][j];
                }
                if (j > 0) {
                    az[i][j] += this.z[i][j - 1] - this.z[i][j];
                }
                if (i < this.rows) {
                    az[i][j] += this.z[i + 1][j] - this.z[i][j];
                }
                if (i > 0) {
                    az[i][j] += this.z[i - 1][j]- this.z[i][j];
                }
                az[i][j] *= 0.2;
            }
        }

        for (let i = 0; i <= this.rows; i++) {
            for (let j = 0; j <= this.cols; j++) {
                this.vz[i][j] += az[i][j];
                this.z[i][j] += this.vz[i][j];
            }
        }
    }

}