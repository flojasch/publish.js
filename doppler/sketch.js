var renderer;
var geometry;
let traeger;

function setup() {

    // we need to remember the renderer that is created so
    // we can call some of its internal methods later
    renderer = createCanvas(windowWidth, windowHeight, WEBGL);

    noStroke();

    // set up the camera. the geometry is in the x,y plane
    // so the camera is below the z axis lookup up at (0,0,0)
    camera(0, -600, 300, 0, 0, 0, 0, -1, 0);

    // there's 10,000 points on the surface.
    geometry = new p5.Geometry(10, 10, function () {
        for (var y = 0; y <= this.detailY; y++) {
            var w = y / this.detailY;
            for (var x = 0; x <= this.detailX; x++) {
                var u = x / this.detailX;
                var p = new p5.Vector(u - 0.5, w - 0.5, 0);
                this.vertices.push(p);
                this.uvs.push(u, w);
            }
        }
    });
    traeger = new Traeger(geometry.detailX, geometry.detailY);
}

function draw() {
    background(0);
    for (var y = 0; y <= geometry.detailY; y++) {
        for (var x = 0; x <= geometry.detailX; x++) {
            geometry.vertices[y * (geometry.detailX + 1) + x].z = traeger.z[x][y];

        }
    }
    traeger.update();
    fill(255);
    noStroke();

    var dirX = (mouseX / width - 0.5) * 2;
    var dirY = (mouseY / height - 0.5) * 2;

    directionalLight(255, 250, 136, -dirX, -dirY, 0.25);

    // re-compute the faces & normals
    geometry.computeFaces().computeNormals();

    // update the webgl buffers
    renderer.createBuffers("!", geometry);

    // render the geometry
    renderer.drawBuffersScaled("!", 1000, 1000, 500);
}