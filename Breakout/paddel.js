class Paddel extends GameObject {
  constructor(x, y, sprite) {
    super(x, y, sprite);
  }

  left() {
    if (this.x < width - this.icon.width) {
      this.x += 10;
    }
  }
  
  right() {
    if (this.x > 0) {
      this.x -= 10;
    }
  }
}