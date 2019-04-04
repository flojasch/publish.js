const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;
let button;
let skip;

function mousePressed() {
    if(mouseY > 50){
        state = USER;
        drawing = [];
        x = [];
        time = 0;
        path = [];
    }
}

function mouseReleased() {
    if( mouseY > 50){
        state = FOURIER;
        skip = 1;
        for (let i = 0; i < drawing.length; i += skip) {
            const c = new Complex(drawing[i].x, drawing[i].y);
            x.push(c);
        }
        fourierX = dft(x);
        fourierX.sort((a, b) => b.amp - a.amp);
    }
}

function setup() {
    createCanvas(800, 600);
    button=createButton('draw train');
    button.position(10,10);
    button.mousePressed(drawtrain);
    
    
}

function drawtrain(){
    state = FOURIER;
    x =[];
    path=[];
    time = 0;
    skip=8;
    for (let i = 0; i < trainDrawing.length; i += skip) {
        const c = new Complex(trainDrawing[i].x, trainDrawing[i].y);
        x.push(c);
    }
    fourierX = dft(x);
    fourierX.sort((a, b) => b.amp - a.amp);
    
}

function epicycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);

        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255);
        line(prevx, prevy, x, y);
    }
    return createVector(x, y);
}

function draw() {
    background(0);
    if (state == USER) {
        let point = createVector(mouseX - width / 2, mouseY - height / 2);
        drawing.push(point);
        stroke(255,255,0);
        noFill();
        beginShape();
        for (let v of drawing) {
            vertex(v.x + width / 2, v.y + height / 2);
        }
        endShape();
    }
    else if (state == FOURIER) {
        let v = epicycles(width / 2, height / 2, 0, fourierX);
        path.unshift(v);

        beginShape();
        noFill();
        stroke(255, 255, 0);
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();

        const dt = TWO_PI / fourierX.length;
        time += dt;

        if (time > TWO_PI) {
            time = 0;
            path = [];
        }
    }
}
