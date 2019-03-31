class Slider {
    constructor(x, y, first, last, beginn, step) {
        this.slider = createSlider(first, last, beginn, step);
        this.slider.position(x, y);
        this.text = createP();
        this.text.position(x, y + 20);
        this.text.style('font-size', '160%');
    }
}