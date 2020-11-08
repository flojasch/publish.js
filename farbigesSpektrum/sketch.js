let slider;
let text;

function setup() {
  width=windowWidth;
  height=windowHeight;
  createCanvas(width, height);
  background(0);
  if(slider){ 
    slider.remove();
    text.remove();
  }
  slider = createSlider(0, 0.5, 0.1, 0.01);
  slider.position(50, 50);
  text = createP();
  text.position(80, 70);
  text.style('font-size', '130%');
  text.style('color', '#ffffff');
}

function setPixel(T) {
  loadPixels();

  for (let i = 0; i < width; i++) {
    lambda=650;
    let x=(i-width/2); 
    let p = I(x);
    let rgb = nmToRgb(lambda);
    for (let j = 0; j < height; j++) {
      let k = j * width + i;
      pixels[k * 4] = rgb[0] * p;
      pixels[k * 4 + 1] = rgb[1] * p;
      pixels[k * 4 + 2] = rgb[2] * p;
      pixels[k * 4 + 3] = 255;
    }
  }
  updatePixels();

}

function I(x){
  let b=PI*d*100/lambda*x;
  let a=sin(b)/b;
  return a*a;

}

function draw() {
  if (width != windowWidth || height != windowHeight) {
    setup();
  }
  background(0);
  d = slider.value();
  setPixel(d);
  text.html('Spaltbreite: '+ d+'mm');
  
}