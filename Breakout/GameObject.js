class GameObject {
  constructor(x,y,sprite,vx = 0,vy = 0) {
    this.x = x;
    this.y = y;
    this.icon = sprite;
    this.width = sprite.width;
    this.height = sprite.height;
    this.vx = vx;
    this.vy = vy;
  }

  show() {
    // draw the icon CENTERED around the X and Y coords of the game object
    image(this.icon, this.x, this.y, this.width, this.height);
  }

  collision(object){
    let ret = false;
    if (this.x + this.icon.width/2 > object.x && this.x + this.icon.width/2 < object.x + object.icon.width
      && this.y + this.icon.height > object.y && this.y < object.y + object.icon.height) {
      ret = true;
    }
    return ret;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

}
