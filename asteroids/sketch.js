let canvas;
let geometry;
let asteroids = [];
let planets = [];
let speed = 0;
let ypos = 0;
let xpos = 0;
let angle = 0;
let xAngle = -1.43;
let zpos = 0;

function setup() {
  img1 = loadImage('mercury.jpg');
  jimg = loadImage('jupitermap.jpg');
  earthimg = loadImage('earth.jpg');
  sun = loadImage('sun.jpg');
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  text = createP();
  text.position(20, 20);
  text.style('font-size', '160%');
  text.style("color", "#FFFFFF");
  asteroids.push(createAsteroid(1000));
  asteroids.push(createAsteroid(3500));
  let p = new Planet(createVector(-2000, -4000, 1000), 500, jimg);
  planets.push(p);
  p = new Planet(createVector(2000, -4000, 1000), 200, earthimg);
  planets.push(p);
  ambientLight(100);
  directionalLight(255, 120, 120, 0, 0.5, 0.25);
  directionalLight(255, 120, 120, 0, 0.5, 0.25);
  directionalLight(255, 120, 120, 0, 0.5, 0.25);
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

  updateAsteroids();
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].show();
  }
  for (let i = 0; i < planets.length; i++) {
    planets[i].update();
    planets[i].show();
  }

}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    if (asteroids[i].pos.y > 0) {
      asteroids.splice(i, 1);
      asteroids.push(createAsteroid(3000));
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
      angle += 0.05;
    }
    if (keyCode == 37) {
      angle -= 0.05;
    }
    if (keyCode == 40) {
      xAngle -= 0.05;
    }
    if (keyCode == 38) {
      xAngle += 0.03;
    }
    if (keyCode == 119) {
      zpos += 5;
    }
    if (keyCode == 115) {
      zpos -= 5;
    }
  }
  translate(0, ypos, zpos + 400);
  rotateX(-xAngle);
  translate(0, -ypos, -zpos - 400);
  rotateX(xAngle);
  translate(0, -ypos, -zpos);
  rotateX(-xAngle);

  translate(xpos, 400 + ypos, 0);
  rotateZ(-angle);
  translate(-xpos, -400 - ypos, 0);
  rotateZ(angle);
  translate(-xpos, -ypos, 0);
  rotateZ(-angle);

}

class Planet {
  constructor(pos, size, image) {
    this.pos = pos;
    this.img = image;
    this.size = size;
  }
  show() {
    push();
    translate(this.pos);
    rotateX(1.43);
    rotateY(millis() / 2000);
    noStroke();
    texture(this.img);
    sphere(this.size);
    pop();
  }
  update() {
    // this.pos.sub(createVector(-speed * sin(xAngle) * sin(angle),speed * sin(xAngle) * cos(angle),-speed * cos(xAngle)));  
  }
}

class Asteroid {
  constructor(pos, size) {
    this.size = size;
    this.geometry = icosphere(5);
    this.pos = pos;
  }
  show() {
    texture(img1)

    push();
    translate(this.pos);
    rotateX(millis() / 1000);
    rotateY(millis() / 2000);
    this.geometry.computeNormals();
    canvas.createBuffers("!", this.geometry);
    canvas.drawBuffersScaled("!", this.size, this.size, this.size);
    pop();
  }
  update() {
    this.pos.sub(createVector(-speed * sin(xAngle) * sin(angle), speed * sin(xAngle) * cos(angle), -speed * cos(xAngle)));
    for (let ii = 0; ii < 10; ii++) {
      let side = p5.Vector.fromAngles(random(TWO_PI), random(PI));
      let amt = random(-1, 1) * random(-1, 1) / 15;
      let vertices = this.geometry.vertices;
      let o = random(-1, 1);
      for (let i = 0; i < vertices.length; i++) {
        let v = vertices[i];
        let l = v.mag();
        if (side.dot(v) > o) {
          v.setMag(l + amt);
        } else {
          v.setMag(1 + (l - 1) * 0.991);
        }
      }
    }
  }
}

function icosphere(detail) {
  var g = new p5.Geometry(detail);

  var addVertex = function (p) {
    p.normalize();
    g.vertices.push(p);
    g.vertexNormals.push(p);

    g.uvs.push([
      ((Math.atan2(p.x, p.z) / Math.PI + 1) / 2) % 1,
      Math.acos(-p.y) / Math.PI
    ]);
  };

  var midPointIndexCache = {};

  // return index of point in the middle of p1 and p2
  var midPoint = function (p1, p2) {
    var key = p1 < p2 ? p1 + "," + p2 : p2 + "," + p1;
    var ret = midPointIndexCache[key];
    if (typeof ret === "undefined") {
      ret = midPointIndexCache[key] = g.vertices.length;
      addVertex(p5.Vector.add(g.vertices[p1], g.vertices[p2]));
    }
    return ret;
  };

  // golden ratio FTW!
  var phi = (1 + Math.sqrt(5)) / 2;

  addVertex(new p5.Vector(-1, phi, 0));
  addVertex(new p5.Vector(1, phi, 0));
  addVertex(new p5.Vector(-1, -phi, 0));
  addVertex(new p5.Vector(1, -phi, 0));
  addVertex(new p5.Vector(0, -1, phi));
  addVertex(new p5.Vector(0, 1, phi));
  addVertex(new p5.Vector(0, -1, -phi));
  addVertex(new p5.Vector(0, 1, -phi));
  addVertex(new p5.Vector(phi, 0, -1));
  addVertex(new p5.Vector(phi, 0, 1));
  addVertex(new p5.Vector(-phi, 0, -1));
  addVertex(new p5.Vector(-phi, 0, 1));

  var faces = [
    [0, 5, 11],
    [0, 1, 5],
    [0, 7, 1],
    [0, 10, 7],
    [0, 11, 10],
    [1, 9, 5],
    [5, 4, 11],
    [11, 2, 10],
    [10, 6, 7],
    [7, 8, 1],
    [3, 4, 9],
    [3, 2, 4],
    [3, 6, 2],
    [3, 8, 6],
    [3, 9, 8],
    [4, 5, 9],
    [2, 11, 4],
    [6, 10, 2],
    [8, 7, 6],
    [9, 1, 8]
  ];

  for (var ff = 0; ff < faces.length; ff++) {
    var f = faces[ff];
    var t = f[0];
    f[0] = f[1];
    f[1] = t;
  }

  // refine triangles
  for (var i = 0; i < detail; i++) {
    var faces2 = [];
    for (var iTri = 0; iTri < faces.length; iTri++) {
      var tri = faces[iTri];

      var a = tri[0];
      var b = tri[1];
      var c = tri[2];

      // replace triangle by 4 triangles
      var ab = midPoint(a, b);
      var bc = midPoint(b, c);
      var ca = midPoint(c, a);

      faces2.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = faces2;
  }

  var dupe = function (iv, u, v) {
    return iv;
    var ret = g.vertices.length;
    g.vertices.push(g.vertices[iv]);
    g.vertexNormals.push(g.vertices[iv]);
    g.uvs.push([u, v]);
    return ret;
  };

  var q, iv;
  for (var fi = 0; fi < faces.length; fi++) {
    var face = faces[fi];
    var uv1 = g.uvs[face[0]];
    var uv2 = g.uvs[face[1]];
    var uv3 = g.uvs[face[2]];
    var u1 = uv1[0];
    var u2 = uv2[0];
    var u3 = uv3[0];

    if (
      (u1 < 0.25 || u2 < 0.25 || u3 < 0.25) &&
      (u1 > 0.75 || u2 > 0.75 || u3 > 0.75)
    ) {
      for (q = 0; q < 3; q++) {
        iv = face[q];
        if (g.uvs[iv][0] === 0) {
          face[q] = dupe(iv, 1, g.uvs[iv][1]);
        }
      }
    }

    for (q = 0; q < 3; q++) {
      iv = face[q];
      var v = g.uvs[face[q]][1];
      if (v % 1 === 0) {
        var u = (g.uvs[face[(q + 1) % 3]][0] + g.uvs[face[(q + 2) % 3]][0]) / 2;
        face[q] = dupe(iv, u, v);
      }
    }
  }

  g.faces = faces;
  return g;
}