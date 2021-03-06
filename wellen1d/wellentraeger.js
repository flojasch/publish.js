class Traeger {
    constructor(rows) {
        this.rows = rows;
        this.y = [];
        this.vy = [];
        // this.damping = 0;
        this.c = 0.2;
        this.fest =true;
        this.reset();
         
    }
    reset() {
        for (let i = 0; i <= this.rows; i++) {
            this.y[i] = 0;
            this.vy[i] = 0;
        }
    }

    set(x, value) {
        let i = floor(x / width * this.rows);
        this.y[i] = 10*value;
        this.vy[i] = 0;
    }

    pull(x, value) {
        let i = floor(x / width * this.rows);
        this.vy[i] += (value-this.y[i])*0.02;
    }

    update() {
        let ay = [];
        for (let i = 0; i <= this.rows; i++) {
            ay[i] = 0;
            // if (i == this.rows || i == 0) {
            //     ay[i] = this.damping * this.vy[i];
            // }

            if (i < this.rows) {
                ay[i] += this.y[i + 1] - this.y[i];
            }
            if (i > 0) {
                ay[i] += this.y[i - 1] - this.y[i];
            }
            ay[i] *= this.c;
        }

        for (let i = 0; i <= this.rows; i++) {
            this.vy[i] += ay[i];
            this.y[i] += this.vy[i];
        }
        if(this.fest){
            this.y[this.rows-1]=0;
        }

    }

    show() {
        fill(0);
        for (let i = 0; i < this.rows; ++i) {
            ellipse(i * width / this.rows, this.y[i] + height / 2, 10);
        }
    }

}