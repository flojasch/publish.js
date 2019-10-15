let nn;
let lr_slider;
let lr_old;

let training_data = [
    {
        inputs: [0,1],
        targets: [1]
    },
    {
        inputs: [1,0],
        targets: [1]
    },
    {
        inputs: [0,0],
        targets: [0]
    },
    {
        inputs: [1,1],
        targets: [0]
    },
    ];

function setup() {
    createCanvas(400,400);    
    lr_slider = createSlider(0,1,0.1,0.01);
    lr_old = lr_slider.value();
    nn = new NeuralNetwork(2,2,1,lr_slider.value());
}

function draw(){
    background(0);
    if(lr_old != lr_slider.value()){
        nn = new NeuralNetwork(2,2,1,lr_slider.value());
        lr_old = lr_slider.value();
    }
    for(let i=0;i<100;i++){
        let data = random(training_data)
        nn.train(data.inputs,data.targets);
    
    }
    let resolution=10;
    let cols =width/resolution;
    let rows = height/resolution;
    for(let i=0;i<cols; i++){
        for(let j=0;j<rows;j++){
            let x1=i/cols;
            let x2=j/rows;
            let input=[x1,x2];
            let y=nn.predict(input);
            fill(y*255);
            noStroke();
            rect(i*resolution,j*resolution,resolution,resolution);
        }
    }
}
