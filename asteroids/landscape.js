class Landscape {
  constructor(pos, detailX = 100, detailY = 100) {
    this.pos = pos;
    this.g = new p5.Geometry(detailX, detailY, this.oberflaeche);
    this.img=img1;
  }
  show() {
    push();
    translate(this.pos);
    noStroke();
    texture(this.img);
    this.g.computeFaces().computeNormals();
    canvas.createBuffers("!", this.g);
    canvas.drawBuffersScaled("!", 6000, 3000, 100);
    pop();
  }

  oberflaeche() {
    for (var y = 0; y <= this.detailY; y++) {
      var w = y / this.detailY;
      for (var x = 0; x <= this.detailX; x++) {
        var u = x / this.detailX;
        var p = new p5.Vector(u - 0.5, w - 0.5, 0);
        this.vertices.push(p);
        this.uvs.push(u, w);
      }
    }
  }
  update() {
    this.pos.sub(createVector(-speed * sin(xAngle) * sin(angle), speed * sin(xAngle) * cos(angle), -speed * cos(xAngle)));
    let terrain=[];
    let yoff = 0;
    for (let y = 0; y <= this.g.detailY; y++) {
      let xoff = 0;
      terrain[y] = [];
      for (let x = 0; x <= this.g.detailX; x++) {
        terrain[y][x] = 10 * noise(xoff, yoff);
        xoff += 0.03;
      }
      yoff += 0.03;
    }
    for (let y = 0; y <= this.g.detailY; y++) {
      for (let x = 0; x <= this.g.detailX; x++) {
        this.g.vertices[y * (this.g.detailX + 1) + x].z = terrain[y][x];

      }
    }
  }
}