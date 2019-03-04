
var sponge = [];

function setup() {
createCanvas(500,500,WEBGL);
ambientLight(200,200,200)
var b = new Box(0,0,0,200);
sponge.push(b);

}

function mousePressed(){
  var next = [];
  for (var i = 0; i < sponge.length; i++) {
    var b = sponge[i];
    var newBoxes = b.generate();
    next = next.concat(newBoxes);
  }
  sponge = next;
}


function draw() {
  background(51);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  for (var i = 0; i < sponge.length; i++) {
    var b = sponge[i];
    b.show();
  }
}


function Box(x,y,z,r){
 this.x = x;
 this.y=y;
 this.z=z;
 this.r = r;

 this.show = function(){
    push();
    translate(this.x,this.y,this.z);
    directionalLight(250, 250, 250, -1, -1, 0.25);
    ambientMaterial(125,20,80);
    noStroke();
    box(this.r);
    pop();
  }
this.generate = function(){
  var boxes = [];
  for(var i = -1; i < 2; i++){
    for (var j = -1; j < 2; j++){
      for (var k=-1; k< 2; k++){
        var sum = abs(i) + abs(j) + abs(k);
        var newR = this.r/3;
        if(sum<=1){
          var b = new Box(this.x+i*newR,this.y+j*newR,this.z+k*newR,newR);
        boxes.push(b);
      }
     }
    }
  }
    return boxes;
  }

}
