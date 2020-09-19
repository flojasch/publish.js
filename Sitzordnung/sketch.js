let tables = [];
let tableWidth = 100;
let tableHeight = 50;
let xAbstand = 150;
let yAbstand = 150;
let names = ['Yassin','Mihajlo','Anastasia','Caio','Rahel'
,'Tarja','Felix','Mila','Raquel','David','Noah','Marc','Vivien','Diana','Luca'
,'Danil','Mariam','Mika','Michael','Luca','Tenaya','Marlon','Anahit','Samuel'
,'Hannah','David','Moritz','Elias'];
let name = 'none';
let picked = 0;
let isPicked = false;
let noList = true;
let list=[];


function setup() {
  canvas = createCanvas(1000, 1000);
  canvas.position(50, 100);
  background(255);
  button = createButton('bestimme Sitzordnung');
  button.position(20, 20);
  button.mousePressed(erstelleSitzordnung);
  saveButton = createButton('save Image');
  saveButton.position(200, 20);
  saveButton.mousePressed(saveOrdnung);
  for(let i=0;i<names.length;i++){
    list[i]=names[i];
  }
  tables = [];
  let x = 0;
  let y = 100;
  let k = 0;
  for (let i = 0; i < 4; i++) {
    x = 7 * tableWidth;
    for (let j = 0; j < 7; j++) {
      if (k == list.length)
        break;
      tables.push(new Table(x, y, list[k], 0));
      x -= tableWidth;
      k++;
    }
    if (k == list.length)
      break;
    y += 150;
  }
}

function saveOrdnung() {
  saveCanvas(canvas, 'Sitzordnung7e', 'jpg');
}


function mousePressed() {
  if (mouseY > 0) {
    for (let i = 0; i < list.length; i++) {
      if (abs(tables[i].x + tableWidth / 2 - mouseX) < tableWidth / 2 &&
        abs(tables[i].y + tableHeight / 2 - mouseY) < tableHeight / 2) {
        picked = i;
        isPicked = true;
      }
    }
  }
}

function mouseDragged() {
  if (isPicked) {
    tables[picked].x = mouseX;
    tables[picked].y = mouseY;
  }
}

function mouseReleased() {
  isPicked = false;
}

function createTable(x, y, orientation) {
  let i = floor(random() * list.length);
  name = list.splice(i, 1);
  tables.push(new Table(x, y, name, orientation));
}



function erstelleSitzordnung() {
  tables = [];
  for(let i=0;i<names.length;i++){
    list[i]=names[i];
  }
  // Mittelreihen
  let x = xAbstand + tableHeight;
  let y = yAbstand + tableHeight + 2 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y, 0);
    x += tableWidth;
  }
  x = xAbstand + tableHeight;
  y = yAbstand + 6 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight;
  y = yAbstand + 4.25 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight + 4 * tableWidth;
  y = yAbstand + 3.25 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight + 4 * tableWidth;
  y = yAbstand + 6 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  //Türreihe
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight;
  for (let i = 0; i < 6; i++) {
    createTable(x, y, 90);
    y += tableWidth;
  }
  //hintere Reihe
  x = xAbstand+ tableWidth/2;
  y = yAbstand+ tableHeight;
  for (let i = 0; i < 6; i++) {
    createTable(x, y, 0);
    x += tableWidth;
  }
  //Fensterreihe
  x = xAbstand + 7 * tableWidth;
  y = yAbstand + tableHeight;
  for (let i = 0; i < 6; i++) {
    createTable(x, y, 90);
    y += tableWidth;
  }

}

function draw() {
  background(255);
  for (let i = 0; i < tables.length; i++) {
    tables[i].show();
  }
}

class Table {
  constructor(x, y, name, orientation) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.orientation = orientation * PI / 180;
  }
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.orientation);
    fill(200);
    rect(0, 0, tableWidth, tableHeight);
    fill(0);
    textSize(20);
    text(this.name, 10, tableHeight / 2);
    pop();
  }
}


function createList() {
  list = [];
  while (tables.length > 0) {
    list.push(tables[0].name);
    let y = tables[0].y;
    let x = tables[0].x;
    tables.splice(0, 1);
    for (let j = 0; j < tables.length; j++) {
      if (abs(y - tables[j].y) < tableHeight + 10 &&
        abs(x - tables[j].x) < 10) {
        list.push(tables[j].name);
        tables.splice(j, 1);
        break;
      }
    }
  }
  noList = false;
}