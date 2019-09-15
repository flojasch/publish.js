let button;
let lButton;
let charges = [];
let arrow;
let feldlinien = true;
let ladung = 1;
let pg;
let g;
let ypos = -10;
let xangle = 1;
let yangle = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton('Feldlinien');
  button.position(50, 50);
  button.mousePressed(onoff);
  lButton = createButton('Ladung: +');
  lButton.position(150, 50);
  lButton.mousePressed(plusminus);
  strokeWeight(2);
  g = new p5.Geometry(200, 200, oberflaeche);
  pg = createGraphics(windowWidth / 2, windowHeight, WEBGL);
  pg.background(100);
}

function calcPotential() {
  let inkr = width / (2 * g.detailX);
  for (let j = 0; j <= g.detailY; j++) {
    for (let i = 0; i <= g.detailX; i++) {
      let h = 0;
      for (let charge of charges) {
        let x = (charge.x - i * inkr);
        let y = (charge.y - j * inkr);
        let r = x * x + y * y;
        h += charge.charge * (0.1 * log(r) - 1);
      }
      g.vertices[j * (g.detailX + 1) + i].z = h;

    }
  }
}

function onoff() {
  feldlinien = !feldlinien;
}

function plusminus() {
  ladung = -ladung;
  if (ladung == -1)
    lButton.html('Ladung: -');
  else
    lButton.html('Ladung: +');
}

function mousePressed() {
  if (mouseY > 70) {
    charges.push(new Charge(mouseX, mouseY, ladung));
    calcPotential();
    drawGraphics();
  }
}

function draw() {
  background(200);
  if (feldlinien) {
    showfeldlinien();
  }
  let rArrow = new Arrow(mouseX, mouseY, 0, 0);
  for (let charge of charges) {
    charge.show();
    let x = (mouseX - charge.x) * 0.0001 * charge.charge;
    let y = (mouseY - charge.y) * 0.0001 * charge.charge;
    let r = x * x + y * y;
    arrow = new Arrow(mouseX, mouseY, x / r, y / r);
    arrow.show(color(0, 0, 0));
    rArrow.add(arrow);
  }
  rArrow.show(color(255, 0, 0));
  
  if (keyIsPressed) {
    if (keyCode == UP_ARROW) {
      xangle += 0.1;
    }
    if (keyCode == DOWN_ARROW) {
      xangle -= 0.1;
    }
    if (keyCode == RIGHT_ARROW) {
      yangle += 0.1;
    }
    if (keyCode == LEFT_ARROW) {
      yangle -= 0.1;
    }
    if (key == 'w') {
      ypos += 10;
    }
    if (key == 's') {
      ypos -= 10;
    }
    drawGraphics();
  }
  image(pg, width / 2, 0);
}

function drawGraphics() {
  pg = createGraphics(windowWidth / 2, windowHeight, WEBGL);
  pg.background(100);
  pg.fill(255);
  pg.noStroke();
  pg.directionalLight(66, 140, 244, 0, 1, 0.1);
  pg.translate(0, ypos, 0);
  pg.rotateY(yangle);
  pg.rotateX(xangle);
  g.computeFaces().computeNormals();
  pg._renderer.createBuffers("!", g);
  pg._renderer.drawBuffersScaled("!", 1000, 1000, 200);
}

function oberflaeche() {
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

function showfeldlinien() {
  let alpha = 0;
  for (let j = 0; j < charges.length; ++j) {
    let ladung = charges[j].charge;
    if (ladung == 1) {
      for (let n = 0; n < 10; n++) {
        alpha += TWO_PI / 10;
        let x = charges[j].x + 10 * cos(alpha);
        let y = charges[j].y + 10 * sin(alpha);
        for (let k = 0; k < 500; k++) {
          let dx = 0;
          let dy = 0;
          for (let charge of charges) {
            let xh = (x - charge.x) * charge.charge;
            let yh = (y - charge.y) * charge.charge;
            let r = xh * xh + yh * yh;
            dx += xh / r;
            dy += yh / r;
          }
          let r = sqrt(dx * dx + dy * dy);
          let xh = x + dx / r * 3;
          let yh = y + dy / r * 3;
          line(x, y, xh, yh);
          x = xh;
          y = yh;
        }
      }
    }
  }
}

class Arrow {
  constructor(tx, ty, x, y) {
    this.tx = tx;
    this.ty = ty;
    this.x = x;
    this.y = y;
    this.r = 1;
    this.alpha = 0;
    this.update();
  }

  update() {
    this.r = sqrt(this.x * this.x + this.y * this.y);
    if (this.r != 0) {
      if (this.y > 0) {
        this.alpha = acos(this.x / this.r);
      } else {
        this.alpha = TWO_PI - acos(this.x / this.r);
      }
    }
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.update();
  }
  show(c) {
    stroke(c);
    fill(c);
    push();
    translate(this.tx, this.ty);
    rotate(this.alpha);
    line(0, 0, this.r, 0);
    translate(this.r, 0);
    beginShape();
    vertex(-7, -3);
    vertex(0, 0);
    vertex(-7, 3);
    endShape(CLOSE);
    pop();
  }
}

class Charge {
  constructor(x, y, ladung) {
    this.x = x;
    this.y = y;
    this.charge = ladung;
  }
  show() {
    stroke(0);
    if (this.charge == -1) {
      fill(0, 0, 255);
      circle(this.x, this.y, 10);
      line(this.x - 7, this.y, this.x + 7, this.y);
    } else {
      fill(255, 0, 0);
      circle(this.x, this.y, 10);
      line(this.x - 7, this.y, this.x + 7, this.y);
      line(this.x, this.y - 7, this.x, this.y + 7);
    }
  }
}