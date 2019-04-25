let canvas;
let geometry;
let asteroids = [];
let planets = [];
let projectiles = [];
let explosions = [];
let speed = 0;
let angle = 0;
let xAngle;
let counter;

function setup() {
  xAngle = -HALF_PI;
  img1 = loadImage('mercury.jpg');
  jimg = loadImage('jupitermap.jpg');
  earthimg = loadImage('earth.jpg');
  mars = loadImage('mars.jpg');
  sun = loadImage('sun.jpg');
  expimg = loadImage('explosion.jpg');
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  text = createP();
  text.position(20, 20);
  text.style('font-size', '160%');
  text.style("color", "#FFFFFF");
  asteroids.push(createAsteroid(1000));
  asteroids.push(createAsteroid(3500));
  let p = new Planet(createVector(-2000, -4000, 1000), 600, jimg);
  planets.push(p);
  p = new Planet(createVector(2000, -4000, 1000), 300, earthimg);
  planets.push(p);
  p = new Planet(createVector(0, -4000, -500), 200, mars);
  planets.push(p);
  p = new Planet(createVector(4000, 2000, 0), 1000, sun);
  planets.push(p);

  ambientLight(100);
  directionalLight(255, 120, 120, -2, -1, 0);
  directionalLight(255, 120, 120, -2, -1, 0);
  directionalLight(255, 120, 120, -2, -1, 0);
}

function createAsteroid(dist) {
  let x = (random() * width - width / 2) * dist / 1000;
  let y = (random() * height - height / 2) * dist / 1000;
  return new Asteroid(createVector(x, -1000 - dist, height / 2 + y), 200);
}

function draw() {
  background(0);
  text.html('speed: ' + speed);
  updatePlayer();
  updateProjectiles();
  updateAsteroids();
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].show();
  }
  for (let i = 0; i < planets.length; i++) {
    planets[i].update();
    planets[i].show();
    if (planets[i].hit > 4) {
      planets[i].time -= 1;
    }
    if (planets[i].time < 0) {
      planets.splice(i, 1);
    }
  }
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].show();
  }
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].show();
    if (explosions[i].time > 100) {
      explosions.splice(i, 1);
    }
  }
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    if (asteroids[i].pos.y > 0) {
      asteroids.splice(i, 1);
      asteroids.push(createAsteroid(3000));
    }
    for (let i = 0; i < asteroids.length; i++) {
      if (asteroids[i].hit) {
        asteroids[i].time -= 1;
      }
      if (asteroids[i].time <0) {
        asteroids.splice(i, 1);
      }
    }
    if (asteroids.length < 2) {
      asteroids.push(createAsteroid(3000));
    }
  }
}

function updateProjectiles() {
  for (let j = 0; j < asteroids.length; j++) {
    for (let i = 0; i < projectiles.length; i++) {
      if (projectiles[i].hit(asteroids[j])) {
        explosions.push(new Explosion(projectiles[i].pos));
        projectiles.splice(i, 1);
        asteroids[j].hit = true;
      }
    }
  }
  for (let j = 0; j < planets.length; j++) {
    for (let i = 0; i < projectiles.length; i++) {
      if (projectiles[i].hit(planets[j])) {
        explosions.push(new Explosion(projectiles[i].pos));
        projectiles.splice(i, 1);
        ++planets[j].hit;
      }
    }
  }
  for (let i = 0; i < projectiles.length; i++) {
    if (abs(projectiles[i].pos.y) > 6000) {
      projectiles.splice(i, 1);
    }
  }
}

function updatePlayer() {
  if (keyIsPressed) {
    if (keyCode == 101) {
      speed += 1;
    }
    if (keyCode == 100) {
      speed -= 1;
    }
    if (keyCode == 39) {
      angle += 0.02;
    }
    if (keyCode == 37) {
      angle -= 0.02;
    }
    if (keyCode == 40) {
      xAngle -= 0.02;
    }
    if (keyCode == 38) {
      xAngle += 0.02;
    }
    if (key == ' ') {
      projectiles.push(new Projectile());
    }
  }
  translate(0, 0, 400);
  rotateX(-xAngle);
  translate(0, 0, -400);
  rotateZ(-angle);

}

class Planet {
  constructor(pos, size, image) {
    this.pos = pos;
    this.img = image;
    this.size = size;
    this.hit = 0;
    this.time = 10;
  }
  show() {
    push();
    translate(this.pos);
    rotateX(HALF_PI);
    rotateY(millis() / 2000);
    noStroke();
    texture(this.img);
    sphere(this.size);
    pop();
  }
  update() {
    this.pos.sub(createVector(-speed * sin(xAngle) * sin(angle), speed * sin(xAngle) * cos(angle), -speed * cos(xAngle)));
  }
}

class Projectile {
  constructor() {
    this.pos = createVector(0, 0, 0);
    this.speed = 200;
    this.xAngle = xAngle;
    this.angle = angle;
    this.dir = createVector(this.speed * sin(xAngle) * sin(angle), -this.speed * sin(xAngle) * cos(angle), this.speed * cos(xAngle));
  }
  show() {
    push();
    translate(this.pos);
    rotateX(this.xAngle + HALF_PI);
    rotateZ(this.angle);
    noStroke();
    fill(color('magenta'));
    cylinder(20, 200);
    pop();
  }
  update() {
    this.pos.sub(this.dir);
  }
  hit(obj) {
    let dist = this.pos.dist(obj.pos);
    // console.log(dist);
    return dist < obj.size;
  }
}

class Explosion {
  constructor(pos) {
    this.pos = pos;
    this.time = 0;
    this.size = 200;
    this.img = expimg;
    this.speed = 30;
  }
  show() {
    push();
    translate(this.pos);
    noStroke();
    texture(this.img);
    sphere(this.size);
    pop();
  }
  update() {
    this.pos.sub(createVector(-this.speed * sin(xAngle) * sin(angle), this.speed * sin(xAngle) * cos(angle), -this.speed * cos(xAngle)));
    this.time += 1;
    let t = (this.time - 5) * 0.5;
    this.size = exp(-t * t) * 200;
  }

}